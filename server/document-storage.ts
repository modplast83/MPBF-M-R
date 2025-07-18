import { db } from "./db";
import {
  documents,
  documentTemplates,
  documentViews,
  documentApprovals,
  documentComments,
  documentSubscriptions,
  Document,
  InsertDocument,
  DocumentTemplate,
  InsertDocumentTemplate,
  DocumentView,
  InsertDocumentView,
  DocumentApproval,
  InsertDocumentApproval,
  DocumentComment,
  InsertDocumentComment,
  DocumentSubscription,
  InsertDocumentSubscription,
} from "../shared/schema";
import { eq, desc, asc, and, or, ilike, sql, inArray, isNull } from "drizzle-orm";
import { users } from "../shared/schema";

export class DocumentStorage {
  // Document number generation with retry logic to handle concurrent requests
  async generateDocumentNumber(documentType: string, retryCount = 0): Promise<string> {
    const typePrefix = this.getDocumentTypePrefix(documentType);
    const year = new Date().getFullYear();
    
    // Get all document numbers for this type and year to find the highest number
    const existingDocuments = await db
      .select({ documentNumber: documents.documentNumber })
      .from(documents)
      .where(
        and(
          eq(documents.documentType, documentType),
          ilike(documents.documentNumber, `${typePrefix}${year}%`)
        )
      )
      .orderBy(desc(documents.documentNumber));

    console.log(`Found ${existingDocuments.length} existing documents for type ${documentType} in ${year}`);

    let nextNumber = 1;
    if (existingDocuments.length > 0) {
      // Find the highest existing number
      let maxNumber = 0;
      for (const doc of existingDocuments) {
        // Extract the number from format like "INS2025-0001"
        const parts = doc.documentNumber.split('-');
        if (parts.length === 2) {
          const numberPart = parts[1]; // "0001"
          const parsedNumber = parseInt(numberPart);
          console.log(`Parsing document ${doc.documentNumber}: parts=${JSON.stringify(parts)}, numberPart=${numberPart}, parsedNumber=${parsedNumber}`);
          if (!isNaN(parsedNumber) && parsedNumber > maxNumber) {
            maxNumber = parsedNumber;
          }
        }
      }
      nextNumber = maxNumber + 1;
      console.log(`Highest existing number: ${maxNumber}, next number: ${nextNumber}`);
    }

    // Add retry count to nextNumber to handle concurrent requests
    nextNumber += retryCount;

    const newDocumentNumber = `${typePrefix}${year}-${nextNumber.toString().padStart(4, '0')}`;
    console.log(`Generated document number: ${newDocumentNumber} (retry count: ${retryCount})`);
    
    return newDocumentNumber;
  }

  private getDocumentTypePrefix(documentType: string): string {
    const prefixes = {
      'instruction': 'INS',
      'obligation': 'OBL',
      'announcement': 'ANN',
      'general_letter': 'GLT',
      'agreement': 'AGR',
      'contract': 'CON',
      'request': 'REQ',
      'disclaimer': 'DIS',
    };
    return prefixes[documentType as keyof typeof prefixes] || 'DOC';
  }

  // Get user's documents for analysis
  async getUserDocuments(userId: string, limit: number = 50): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.createdBy, userId))
      .orderBy(desc(documents.createdAt))
      .limit(limit);
  }

  // Documents CRUD operations with retry logic for duplicate document numbers
  async createDocument(document: InsertDocument, retryCount = 0): Promise<Document> {
    const maxRetries = 5;
    
    try {
      const documentNumber = await this.generateDocumentNumber(document.documentType, retryCount);
      
      const [newDocument] = await db
        .insert(documents)
        .values({
          ...document,
          documentNumber,
          updatedAt: new Date(),
        })
        .returning();

      return newDocument;
    } catch (error: any) {
      // Check if it's a unique constraint violation for document_number
      // The error might be nested in the cause property
      const actualError = error.cause || error;
      const isUniqueConstraintViolation = 
        (actualError?.code === '23505' && actualError?.constraint === 'documents_document_number_key') ||
        (error?.code === '23505' && error?.constraint === 'documents_document_number_key') ||
        (actualError?.detail?.includes('already exists') && actualError?.detail?.includes('document_number')) ||
        (error?.detail?.includes('already exists') && error?.detail?.includes('document_number'));
      
      if (isUniqueConstraintViolation) {
        if (retryCount < maxRetries) {
          console.log(`Document number conflict, retrying... (attempt ${retryCount + 1}/${maxRetries})`);
          // Add a small delay to avoid immediate retry conflicts
          await new Promise(resolve => setTimeout(resolve, 100 * (retryCount + 1)));
          return this.createDocument(document, retryCount + 1);
        } else {
          throw new Error(`Failed to generate unique document number after ${maxRetries} attempts`);
        }
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  async getDocuments(filters?: {
    documentType?: string;
    status?: string;
    createdBy?: string;
    isArchived?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ documents: Document[]; total: number }> {
    let query = db
      .select({
        ...documents,
        createdByUser: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(documents)
      .leftJoin(users, eq(documents.createdBy, users.id));

    const conditions = [];
    
    if (filters?.documentType) {
      conditions.push(eq(documents.documentType, filters.documentType));
    }
    
    if (filters?.status) {
      conditions.push(eq(documents.status, filters.status));
    }
    
    if (filters?.createdBy) {
      conditions.push(eq(documents.createdBy, filters.createdBy));
    }
    
    // Default to showing only non-archived documents unless explicitly requested
    if (filters?.isArchived !== undefined) {
      conditions.push(eq(documents.isArchived, filters.isArchived));
    } else {
      conditions.push(eq(documents.isArchived, false));
    }
    
    if (filters?.search) {
      conditions.push(
        or(
          ilike(documents.title, `%${filters.search}%`),
          ilike(documents.content, `%${filters.search}%`),
          ilike(documents.documentNumber, `%${filters.search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Get total count with same conditions
    let countQuery = db
      .select({ count: sql`count(*)`.as('count') })
      .from(documents);
    
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }
    
    const [{ count }] = await countQuery;
    const total = Number(count);

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    const result = await query
      .orderBy(desc(documents.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      documents: result.map(row => ({
        ...row.documents,
        createdByUser: row.createdByUser,
      })) as Document[],
      total,
    };
  }

  async getDocumentById(id: number): Promise<Document | null> {
    const [document] = await db
      .select({
        ...documents,
        createdByUser: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(documents)
      .leftJoin(users, eq(documents.createdBy, users.id))
      .where(eq(documents.id, id))
      .limit(1);

    if (!document) return null;

    return {
      ...document.documents,
      createdByUser: document.createdByUser,
    } as Document;
  }

  async updateDocument(id: number, updates: Partial<Document>): Promise<Document | null> {
    const [updated] = await db
      .update(documents)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, id))
      .returning();

    return updated || null;
  }

  async deleteDocument(id: number): Promise<boolean> {
    const result = await db
      .delete(documents)
      .where(eq(documents.id, id));

    return result.rowCount > 0;
  }

  async archiveDocument(id: number, userId: string, reason?: string): Promise<boolean> {
    const [updated] = await db
      .update(documents)
      .set({
        isArchived: true,
        archivedAt: new Date(),
        archivedBy: userId,
        archiveReason: reason,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, id))
      .returning();

    return !!updated;
  }

  async unarchiveDocument(id: number): Promise<boolean> {
    const [updated] = await db
      .update(documents)
      .set({
        isArchived: false,
        archivedAt: null,
        archivedBy: null,
        archiveReason: null,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, id))
      .returning();

    return !!updated;
  }

  // Document Templates CRUD
  async createTemplate(template: InsertDocumentTemplate): Promise<DocumentTemplate> {
    const [newTemplate] = await db
      .insert(documentTemplates)
      .values({
        ...template,
        updatedAt: new Date(),
      })
      .returning();

    return newTemplate;
  }

  async getTemplates(documentType?: string): Promise<DocumentTemplate[]> {
    let query = db
      .select()
      .from(documentTemplates)
      .where(eq(documentTemplates.isActive, true));

    if (documentType) {
      query = query.where(eq(documentTemplates.documentType, documentType));
    }

    return await query.orderBy(asc(documentTemplates.templateName));
  }

  async getTemplateById(id: number): Promise<DocumentTemplate | null> {
    const [template] = await db
      .select()
      .from(documentTemplates)
      .where(eq(documentTemplates.id, id))
      .limit(1);

    return template || null;
  }

  async updateTemplate(id: number, updates: Partial<DocumentTemplate>): Promise<DocumentTemplate | null> {
    const [updated] = await db
      .update(documentTemplates)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(documentTemplates.id, id))
      .returning();

    return updated || null;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    const result = await db
      .delete(documentTemplates)
      .where(eq(documentTemplates.id, id));

    return result.rowCount > 0;
  }

  // Document Views tracking
  async recordView(view: InsertDocumentView): Promise<DocumentView> {
    // Update document view count
    await db
      .update(documents)
      .set({
        viewCount: sql`${documents.viewCount} + 1`,
        lastViewedAt: new Date(),
      })
      .where(eq(documents.id, view.documentId));

    const [newView] = await db
      .insert(documentViews)
      .values(view)
      .returning();

    return newView;
  }

  async getDocumentViews(documentId: number): Promise<DocumentView[]> {
    return await db
      .select({
        ...documentViews,
        viewedByUser: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(documentViews)
      .leftJoin(users, eq(documentViews.viewedBy, users.id))
      .where(eq(documentViews.documentId, documentId))
      .orderBy(desc(documentViews.viewedAt));
  }

  // Document Comments
  async createComment(comment: InsertDocumentComment): Promise<DocumentComment> {
    const [newComment] = await db
      .insert(documentComments)
      .values({
        ...comment,
        updatedAt: new Date(),
      })
      .returning();

    return newComment;
  }

  async getDocumentComments(documentId: number): Promise<DocumentComment[]> {
    return await db
      .select({
        ...documentComments,
        commentByUser: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(documentComments)
      .leftJoin(users, eq(documentComments.commentBy, users.id))
      .where(eq(documentComments.documentId, documentId))
      .orderBy(asc(documentComments.createdAt));
  }

  async updateComment(id: number, comment: string): Promise<DocumentComment | null> {
    const [updated] = await db
      .update(documentComments)
      .set({
        comment,
        updatedAt: new Date(),
      })
      .where(eq(documentComments.id, id))
      .returning();

    return updated || null;
  }

  async deleteComment(id: number): Promise<boolean> {
    const result = await db
      .delete(documentComments)
      .where(eq(documentComments.id, id));

    return result.rowCount > 0;
  }

  // Document Statistics
  async getDocumentStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    recentViews: number;
  }> {
    // Total documents
    const [{ total }] = await db
      .select({ total: sql`count(*)`.as('total') })
      .from(documents);

    // By type
    const byTypeResult = await db
      .select({
        documentType: documents.documentType,
        count: sql`count(*)`.as('count'),
      })
      .from(documents)
      .groupBy(documents.documentType);

    // By status
    const byStatusResult = await db
      .select({
        status: documents.status,
        count: sql`count(*)`.as('count'),
      })
      .from(documents)
      .groupBy(documents.status);

    // Recent views (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const [{ recentViews }] = await db
      .select({ recentViews: sql`count(*)`.as('recentViews') })
      .from(documentViews)
      .where(sql`${documentViews.viewedAt} >= ${sevenDaysAgo}`);

    return {
      total: Number(total),
      byType: byTypeResult.reduce((acc, row) => {
        acc[row.documentType] = Number(row.count);
        return acc;
      }, {} as Record<string, number>),
      byStatus: byStatusResult.reduce((acc, row) => {
        acc[row.status] = Number(row.count);
        return acc;
      }, {} as Record<string, number>),
      recentViews: Number(recentViews),
    };
  }

  // Search functionality
  async searchDocuments(searchTerm: string, filters?: {
    documentType?: string;
    status?: string;
    userId?: string;
  }): Promise<Document[]> {
    let query = db
      .select({
        ...documents,
        createdByUser: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(documents)
      .leftJoin(users, eq(documents.createdBy, users.id));

    const conditions = [
      or(
        ilike(documents.title, `%${searchTerm}%`),
        ilike(documents.content, `%${searchTerm}%`),
        ilike(documents.documentNumber, `%${searchTerm}%`),
        sql`${documents.tags}::text ILIKE ${'%' + searchTerm + '%'}`
      ),
    ];

    if (filters?.documentType) {
      conditions.push(eq(documents.documentType, filters.documentType));
    }

    if (filters?.status) {
      conditions.push(eq(documents.status, filters.status));
    }

    if (filters?.userId) {
      conditions.push(eq(documents.createdBy, filters.userId));
    }

    const result = await query
      .where(and(...conditions))
      .orderBy(desc(documents.createdAt));

    return result.map(row => ({
      ...row.documents,
      createdByUser: row.createdByUser,
    })) as Document[];
  }
}

export const documentStorage = new DocumentStorage();