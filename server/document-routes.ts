import type { Express } from "express";
import { documentStorage } from "./document-storage";
import { requireAuth } from "./auth-utils";
import {
  insertDocumentSchema,
  insertDocumentTemplateSchema,
  insertDocumentViewSchema,
  insertDocumentCommentSchema,
} from "../shared/schema";

export function setupDocumentRoutes(app: Express) {
  // Documents CRUD
  app.post("/api/documents", requireAuth, async (req, res) => {
    try {
      const validatedData = insertDocumentSchema.parse(req.body);
      const document = await documentStorage.createDocument({
        ...validatedData,
        createdBy: req.user.id,
      });
      res.json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to create document" 
      });
    }
  });

  app.get("/api/documents", requireAuth, async (req, res) => {
    try {
      const {
        documentType,
        status,
        createdBy,
        isArchived,
        search,
        page = "1",
        limit = "10",
      } = req.query;

      const filters = {
        documentType: documentType as string,
        status: status as string,
        createdBy: createdBy as string,
        isArchived: isArchived === "true",
        search: search as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      };

      const result = await documentStorage.getDocuments(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await documentStorage.getDocumentById(id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  app.put("/api/documents/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const document = await documentStorage.updateDocument(id, updates);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json(document);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ message: "Failed to update document" });
    }
  });

  app.delete("/api/documents/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await documentStorage.deleteDocument(id);
      
      if (!success) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  app.post("/api/documents/:id/archive", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { reason } = req.body;
      
      const success = await documentStorage.archiveDocument(id, req.user.id, reason);
      
      if (!success) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json({ message: "Document archived successfully" });
    } catch (error) {
      console.error("Error archiving document:", error);
      res.status(500).json({ message: "Failed to archive document" });
    }
  });

  app.post("/api/documents/:id/unarchive", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const success = await documentStorage.unarchiveDocument(id);
      
      if (!success) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json({ message: "Document unarchived successfully" });
    } catch (error) {
      console.error("Error unarchiving document:", error);
      res.status(500).json({ message: "Failed to unarchive document" });
    }
  });

  // Document Templates
  app.post("/api/document-templates", requireAuth, async (req, res) => {
    try {
      const validatedData = insertDocumentTemplateSchema.parse(req.body);
      const template = await documentStorage.createTemplate({
        ...validatedData,
        createdBy: req.user.id,
      });
      res.json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to create template" 
      });
    }
  });

  app.get("/api/document-templates", requireAuth, async (req, res) => {
    try {
      const { documentType } = req.query;
      const templates = await documentStorage.getTemplates(documentType as string);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/document-templates/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await documentStorage.getTemplateById(id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.put("/api/document-templates/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const template = await documentStorage.updateTemplate(id, updates);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  app.delete("/api/document-templates/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await documentStorage.deleteTemplate(id);
      
      if (!success) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // Document Views
  app.post("/api/document-views", requireAuth, async (req, res) => {
    try {
      const validatedData = insertDocumentViewSchema.parse(req.body);
      const view = await documentStorage.recordView({
        ...validatedData,
        viewedBy: req.user.id,
      });
      res.json(view);
    } catch (error) {
      console.error("Error recording view:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to record view" 
      });
    }
  });

  app.get("/api/documents/:id/views", requireAuth, async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const views = await documentStorage.getDocumentViews(documentId);
      res.json(views);
    } catch (error) {
      console.error("Error fetching views:", error);
      res.status(500).json({ message: "Failed to fetch views" });
    }
  });

  // Document Comments
  app.post("/api/document-comments", requireAuth, async (req, res) => {
    try {
      const validatedData = insertDocumentCommentSchema.parse(req.body);
      const comment = await documentStorage.createComment({
        ...validatedData,
        commentBy: req.user.id,
      });
      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to create comment" 
      });
    }
  });

  app.get("/api/documents/:id/comments", requireAuth, async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const comments = await documentStorage.getDocumentComments(documentId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.put("/api/document-comments/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { comment } = req.body;
      
      const updatedComment = await documentStorage.updateComment(id, comment);
      
      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      res.json(updatedComment);
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ message: "Failed to update comment" });
    }
  });

  app.delete("/api/document-comments/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await documentStorage.deleteComment(id);
      
      if (!success) {
        return res.status(404).json({ message: "Comment not found" });
      }

      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // Document Statistics
  app.get("/api/documents/stats", requireAuth, async (req, res) => {
    try {
      const stats = await documentStorage.getDocumentStats();
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

      const documents = await documentStorage.searchDocuments(q, filters);
      res.json(documents);
    } catch (error) {
      console.error("Error searching documents:", error);
      res.status(500).json({ message: "Failed to search documents" });
    }
  });
}