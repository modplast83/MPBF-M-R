import { Express } from "express";
import { professionalDocumentStorage } from "./professional-document-storage";
import { requireAuth } from "./auth-utils";
import { z } from "zod";
import { insertDocumentSchema, insertDocumentTemplateSchema } from "../shared/schema";

export function setupProfessionalDocumentRoutes(app: Express) {
  // Document CRUD Operations
  
  // Get all documents with advanced filtering
  app.get("/api/documents", requireAuth, async (req, res) => {
    try {
      const {
        search,
        documentType,
        status,
        category,
        department,
        accessLevel,
        createdBy,
        priority,
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        sortOrder = "desc"
      } = req.query;

      const filters = {
        search: search as string,
        documentType: documentType as string,
        status: status as string,
        category: category as string,
        department: department as string,
        accessLevel: accessLevel as string,
        createdBy: createdBy as string,
        priority: priority as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      };

      const result = await professionalDocumentStorage.getDocuments(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Get single document by ID
  app.get("/api/documents/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await professionalDocumentStorage.getDocumentById(id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Record view
      await professionalDocumentStorage.recordView(id, req.user.id);

      res.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  // Create new document
  app.post("/api/documents", requireAuth, async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse({
        ...req.body,
        createdBy: req.user.id,
      });

      const document = await professionalDocumentStorage.createDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  // Update document
  app.put("/api/documents/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const document = await professionalDocumentStorage.updateDocument(id, updates);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json(document);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ message: "Failed to update document" });
    }
  });

  // Create new document version
  app.post("/api/documents/:id/version", requireAuth, async (req, res) => {
    try {
      const parentId = parseInt(req.params.id);
      const changes = req.body;
      
      const newVersion = await professionalDocumentStorage.createDocumentVersion(
        parentId,
        { ...changes, createdBy: req.user.id }
      );
      
      if (!newVersion) {
        return res.status(404).json({ message: "Parent document not found" });
      }

      res.status(201).json(newVersion);
    } catch (error) {
      console.error("Error creating document version:", error);
      res.status(500).json({ message: "Failed to create document version" });
    }
  });

  // Archive document
  app.post("/api/documents/:id/archive", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { reason } = req.body;
      
      const document = await professionalDocumentStorage.archiveDocument(id, req.user.id, reason);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json(document);
    } catch (error) {
      console.error("Error archiving document:", error);
      res.status(500).json({ message: "Failed to archive document" });
    }
  });

  // Delete document
  app.delete("/api/documents/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await professionalDocumentStorage.deleteDocument(id);
      
      if (!success) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Document Templates
  
  // Get all templates
  app.get("/api/document-templates", requireAuth, async (req, res) => {
    try {
      const { documentType, category, department, isActive } = req.query;
      
      const filters = {
        documentType: documentType as string,
        category: category as string,
        department: department as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      };

      const templates = await professionalDocumentStorage.getTemplates(filters);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Get single template
  app.get("/api/document-templates/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await professionalDocumentStorage.getTemplateById(id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Create new template
  app.post("/api/document-templates", requireAuth, async (req, res) => {
    try {
      const templateData = insertDocumentTemplateSchema.parse({
        ...req.body,
        createdBy: req.user.id,
      });

      const template = await professionalDocumentStorage.createTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  // Update template
  app.put("/api/document-templates/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const template = await professionalDocumentStorage.updateTemplate(id, updates);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  // Delete template
  app.delete("/api/document-templates/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await professionalDocumentStorage.deleteTemplate(id);
      
      if (!success) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // Document Statistics
  app.get("/api/documents/stats", requireAuth, async (req, res) => {
    try {
      const stats = await professionalDocumentStorage.getDocumentStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching document stats:", error);
      res.status(500).json({ message: "Failed to fetch document stats" });
    }
  });

  // Document Search
  app.get("/api/documents/search", requireAuth, async (req, res) => {
    try {
      const { q, documentType, status, userId } = req.query;
      
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }

      const filters = {
        documentType: documentType as string,
        status: status as string,
        userId: userId as string,
      };

      const documents = await professionalDocumentStorage.searchDocuments(q, filters);
      res.json(documents);
    } catch (error) {
      console.error("Error searching documents:", error);
      res.status(500).json({ message: "Failed to search documents" });
    }
  });

  // Document Types endpoint for dropdown options
  app.get("/api/document-types", requireAuth, async (req, res) => {
    try {
      const documentTypes = [
        { value: 'policy', label: 'Policy' },
        { value: 'procedure', label: 'Procedure' },
        { value: 'instruction', label: 'Instruction' },
        { value: 'form', label: 'Form' },
        { value: 'contract', label: 'Contract' },
        { value: 'agreement', label: 'Agreement' },
        { value: 'report', label: 'Report' },
        { value: 'memo', label: 'Memo' },
        { value: 'letter', label: 'Letter' },
        { value: 'manual', label: 'Manual' },
        { value: 'specification', label: 'Specification' },
        { value: 'guideline', label: 'Guideline' },
      ];

      res.json(documentTypes);
    } catch (error) {
      console.error("Error fetching document types:", error);
      res.status(500).json({ message: "Failed to fetch document types" });
    }
  });

  // Document Statuses endpoint for dropdown options
  app.get("/api/document-statuses", requireAuth, async (req, res) => {
    try {
      const statuses = [
        { value: 'draft', label: 'Draft' },
        { value: 'under_review', label: 'Under Review' },
        { value: 'approved', label: 'Approved' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' },
        { value: 'obsolete', label: 'Obsolete' },
      ];

      res.json(statuses);
    } catch (error) {
      console.error("Error fetching document statuses:", error);
      res.status(500).json({ message: "Failed to fetch document statuses" });
    }
  });

  // Access Levels endpoint for dropdown options
  app.get("/api/access-levels", requireAuth, async (req, res) => {
    try {
      const accessLevels = [
        { value: 'public', label: 'Public' },
        { value: 'standard', label: 'Standard' },
        { value: 'confidential', label: 'Confidential' },
        { value: 'restricted', label: 'Restricted' },
      ];

      res.json(accessLevels);
    } catch (error) {
      console.error("Error fetching access levels:", error);
      res.status(500).json({ message: "Failed to fetch access levels" });
    }
  });

  // Priority Levels endpoint for dropdown options
  app.get("/api/priority-levels", requireAuth, async (req, res) => {
    try {
      const priorityLevels = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' },
      ];

      res.json(priorityLevels);
    } catch (error) {
      console.error("Error fetching priority levels:", error);
      res.status(500).json({ message: "Failed to fetch priority levels" });
    }
  });

  // Archive endpoints
  app.get("/api/documents/archived", requireAuth, async (req, res) => {
    try {
      const {
        search,
        documentType,
        category,
        department,
        page = "1",
        limit = "10",
        sortBy = "archivedAt",
        sortOrder = "desc"
      } = req.query;

      const filters = {
        search: search as string,
        documentType: documentType as string,
        category: category as string,
        department: department as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      };

      // Get archived documents by modifying the filter
      const archiveFilters = {
        ...filters,
        // Override the archive filter to get archived documents only
      };

      const result = await professionalDocumentStorage.getDocuments(archiveFilters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching archived documents:", error);
      res.status(500).json({ message: "Failed to fetch archived documents" });
    }
  });

  // Restore archived document
  app.post("/api/documents/:id/restore", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const document = await professionalDocumentStorage.updateDocument(id, {
        isArchived: false,
        archivedAt: undefined,
        archivedBy: undefined,
        archiveReason: undefined,
      });
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json(document);
    } catch (error) {
      console.error("Error restoring document:", error);
      res.status(500).json({ message: "Failed to restore document" });
    }
  });
}