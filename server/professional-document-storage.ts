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
import { eq, desc, asc, and, or, ilike, sql, inArray, isNull, like, count } from "drizzle-orm";
import { users } from "../shared/schema";

export class ProfessionalDocumentStorage {
  // Enhanced document number generation with improved retry logic
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

    let nextNumber = 1;
    if (existingDocuments.length > 0) {
      let maxNumber = 0;
      for (const doc of existingDocuments) {
        const parts = doc.documentNumber.split('-');
        if (parts.length === 2) {
          const numberPart = parts[1];
          const parsedNumber = parseInt(numberPart);
          if (!isNaN(parsedNumber) && parsedNumber > maxNumber) {
            maxNumber = parsedNumber;
          }
        }
      }
      nextNumber = maxNumber + 1;
    }

    // Add retry count for concurrent request handling
    nextNumber += retryCount;

    const newDocumentNumber = `${typePrefix}${year}-${nextNumber.toString().padStart(4, '0')}`;
    return newDocumentNumber;
  }

  private getDocumentTypePrefix(documentType: string): string {
    const prefixes: Record<string, string> = {
      'policy': 'POL',
      'procedure': 'PRO',
      'instruction': 'INS',
      'form': 'FRM',
      'contract': 'CON',
      'agreement': 'AGR',
      'report': 'RPT',
      'memo': 'MEM',
      'letter': 'LTR',
      'manual': 'MAN',
      'specification': 'SPC',
      'guideline': 'GDL',
    };
    return prefixes[documentType] || 'DOC';
  }

  // Create document with enhanced retry logic
  async createDocument(document: InsertDocument, maxRetries = 5): Promise<Document> {
    for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
      try {
        const documentNumber = await this.generateDocumentNumber(document.documentType, retryCount);
        
        const newDocument = await db.insert(documents).values({
          ...document,
          documentNumber,
          version: "1.0",
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        return newDocument[0];
      } catch (error) {
        if (error instanceof Error && error.message.includes('duplicate key') && retryCount < maxRetries - 1) {
          const delay = 100 * (retryCount + 1);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
    throw new Error("Failed to create document after maximum retries");
  }

  // Get documents with advanced filtering and pagination
  async getDocuments(filters: {
    search?: string;
    documentType?: string;
    status?: string;
    category?: string;
    department?: string;
    accessLevel?: string;
    createdBy?: string;
    priority?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ documents: Document[]; total: number }> {
    const {
      search,
      documentType,
      status,
      category,
      department,
      accessLevel,
      createdBy,
      priority,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    let query = db
      .select()
      .from(documents);

    // Apply filters
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          ilike(documents.title, `%${search}%`),
          ilike(documents.content, `%${search}%`),
          ilike(documents.documentNumber, `%${search}%`)
        )
      );
    }

    if (documentType) {
      conditions.push(eq(documents.documentType, documentType));
    }

    if (status) {
      conditions.push(eq(documents.status, status));
    }

    if (category) {
      conditions.push(eq(documents.category, category));
    }

    if (department) {
      conditions.push(eq(documents.department, department));
    }

    if (accessLevel) {
      conditions.push(eq(documents.accessLevel, accessLevel));
    }

    if (createdBy) {
      conditions.push(eq(documents.createdBy, createdBy));
    }

    if (priority) {
      conditions.push(eq(documents.priority, priority));
    }

    // Apply archived filter (exclude archived by default)
    conditions.push(eq(documents.isArchived, false));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = sortBy === 'createdAt' ? documents.createdAt : 
                      sortBy === 'updatedAt' ? documents.updatedAt :
                      sortBy === 'title' ? documents.title :
                      sortBy === 'documentNumber' ? documents.documentNumber :
                      documents.createdAt;

    query = query.orderBy(sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn));

    // Apply pagination
    query = query.limit(limit).offset((page - 1) * limit);

    const result = await query;

    // Get total count
    let countQuery = db
      .select({ count: count() })
      .from(documents);

    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }

    const totalResult = await countQuery;
    const total = totalResult[0].count;

    return { documents: result, total };
  }

  // Get document by ID with full details
  async getDocumentById(id: number): Promise<Document | null> {
    const result = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    return result[0] || null;
  }

  // Update document with version control
  async updateDocument(id: number, updates: Partial<Document>): Promise<Document | null> {
    const result = await db
      .update(documents)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, id))
      .returning();

    return result[0] || null;
  }

  // Create new document version
  async createDocumentVersion(parentId: number, changes: Partial<Document>): Promise<Document | null> {
    const parentDoc = await this.getDocumentById(parentId);
    if (!parentDoc) return null;

    const versionParts = parentDoc.version.split('.');
    const majorVersion = parseInt(versionParts[0]);
    const minorVersion = parseInt(versionParts[1] || '0');
    const newVersion = `${majorVersion}.${minorVersion + 1}`;

    const newDoc = await this.createDocument({
      ...parentDoc,
      ...changes,
      parentDocumentId: parentId,
      version: newVersion,
      status: 'draft',
      createdBy: changes.createdBy || parentDoc.createdBy,
    });

    return newDoc;
  }

  // Archive document
  async archiveDocument(id: number, userId: string, reason: string): Promise<Document | null> {
    const result = await db
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

    return result[0] || null;
  }

  // Delete document (soft delete)
  async deleteDocument(id: number): Promise<boolean> {
    const result = await db
      .update(documents)
      .set({
        status: 'obsolete',
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, id))
      .returning();

    return result.length > 0;
  }

  // Document Templates CRUD
  async createTemplate(template: InsertDocumentTemplate): Promise<DocumentTemplate> {
    const result = await db.insert(documentTemplates).values({
      ...template,
      version: "1.0",
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return result[0];
  }

  async getTemplates(filters: {
    documentType?: string;
    category?: string;
    department?: string;
    isActive?: boolean;
  } = {}): Promise<DocumentTemplate[]> {
    let query = db.select().from(documentTemplates);

    const conditions = [];

    if (filters.documentType) {
      conditions.push(eq(documentTemplates.documentType, filters.documentType));
    }

    if (filters.category) {
      conditions.push(eq(documentTemplates.category, filters.category));
    }

    if (filters.department) {
      conditions.push(eq(documentTemplates.department, filters.department));
    }

    if (filters.isActive !== undefined) {
      conditions.push(eq(documentTemplates.isActive, filters.isActive));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(documentTemplates.createdAt));
  }

  async getTemplateById(id: number): Promise<DocumentTemplate | null> {
    const result = await db
      .select()
      .from(documentTemplates)
      .where(eq(documentTemplates.id, id))
      .limit(1);

    return result[0] || null;
  }

  async updateTemplate(id: number, updates: Partial<DocumentTemplate>): Promise<DocumentTemplate | null> {
    const result = await db
      .update(documentTemplates)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(documentTemplates.id, id))
      .returning();

    return result[0] || null;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    const result = await db
      .update(documentTemplates)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(documentTemplates.id, id))
      .returning();

    return result.length > 0;
  }

  // Document Views and Analytics
  async recordView(documentId: number, userId: string, duration?: number): Promise<void> {
    await db.insert(documentViews).values({
      documentId,
      viewedBy: userId,
      viewDuration: duration,
      deviceType: 'desktop', // This could be detected from user agent
      viewedAt: new Date(),
    });

    // Update document view count
    await db
      .update(documents)
      .set({
        viewCount: sql`${documents.viewCount} + 1`,
        lastViewedAt: new Date(),
      })
      .where(eq(documents.id, documentId));
  }

  async getDocumentStats(): Promise<{
    totalDocuments: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    byDepartment: Record<string, number>;
    recentViews: number;
    pendingApprovals: number;
    expiringDocuments: number;
  }> {
    // Get total documents
    const totalResult = await db
      .select({ count: count() })
      .from(documents)
      .where(eq(documents.isArchived, false));

    // Get counts by type
    const typeResults = await db
      .select({
        documentType: documents.documentType,
        count: count(),
      })
      .from(documents)
      .where(eq(documents.isArchived, false))
      .groupBy(documents.documentType);

    // Get counts by status
    const statusResults = await db
      .select({
        status: documents.status,
        count: count(),
      })
      .from(documents)
      .where(eq(documents.isArchived, false))
      .groupBy(documents.status);

    // Get counts by department
    const departmentResults = await db
      .select({
        department: documents.department,
        count: count(),
      })
      .from(documents)
      .where(and(
        eq(documents.isArchived, false),
        isNull(documents.department)
      ))
      .groupBy(documents.department);

    // Get recent views (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentViewsResult = await db
      .select({ count: count() })
      .from(documentViews)
      .where(sql`${documentViews.viewedAt} >= ${thirtyDaysAgo}`);

    // Get pending approvals
    const pendingApprovalsResult = await db
      .select({ count: count() })
      .from(documents)
      .where(and(
        eq(documents.status, 'under_review'),
        eq(documents.isArchived, false)
      ));

    // Get expiring documents (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringResult = await db
      .select({ count: count() })
      .from(documents)
      .where(and(
        sql`${documents.expiryDate} <= ${thirtyDaysFromNow}`,
        sql`${documents.expiryDate} >= ${new Date()}`,
        eq(documents.isArchived, false)
      ));

    return {
      totalDocuments: totalResult[0].count,
      byType: typeResults.reduce((acc, item) => {
        acc[item.documentType] = item.count;
        return acc;
      }, {} as Record<string, number>),
      byStatus: statusResults.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {} as Record<string, number>),
      byDepartment: departmentResults.reduce((acc, item) => {
        acc[item.department || 'Unassigned'] = item.count;
        return acc;
      }, {} as Record<string, number>),
      recentViews: recentViewsResult[0].count,
      pendingApprovals: pendingApprovalsResult[0].count,
      expiringDocuments: expiringResult[0].count,
    };
  }

  // Document Search
  async searchDocuments(query: string, filters: {
    documentType?: string;
    status?: string;
    userId?: string;
    limit?: number;
  } = {}): Promise<Document[]> {
    const { documentType, status, userId, limit = 20 } = filters;

    let searchQuery = db
      .select()
      .from(documents)
      .where(
        and(
          or(
            ilike(documents.title, `%${query}%`),
            ilike(documents.content, `%${query}%`),
            ilike(documents.documentNumber, `%${query}%`)
          ),
          eq(documents.isArchived, false)
        )
      );

    const conditions = [];

    if (documentType) {
      conditions.push(eq(documents.documentType, documentType));
    }

    if (status) {
      conditions.push(eq(documents.status, status));
    }

    if (userId) {
      conditions.push(eq(documents.createdBy, userId));
    }

    if (conditions.length > 0) {
      searchQuery = searchQuery.where(and(...conditions));
    }

    return await searchQuery
      .orderBy(desc(documents.updatedAt))
      .limit(limit);
  }
}

export const professionalDocumentStorage = new ProfessionalDocumentStorage();