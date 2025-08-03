import express from "express";
import { 
  createDocumentVersion,
  getDocumentVersions,
  getDocumentVersionById,
  setActiveVersion,
  getActiveVersion,
  deleteDocumentVersion,
  compareVersions,
  getVersionComparisons,
  createVersionConflict,
  resolveVersionConflict,
  getVersionConflicts,
  createVersionTag,
  getVersionTags,
  deleteVersionTag,
  getVersionHistory,
  getVersionStatistics,
  rollbackToVersion
} from "./document-version-storage";
import { insertDocumentVersionSchema, insertDocumentVersionTagSchema } from "@shared/schema";
import { z } from "zod";

const router = express.Router();

// Get all versions for a document
router.get("/documents/:documentId/versions", async (req, res) => {
  try {
    const documentId = parseInt(req.params.documentId, 10);
    const versions = await getDocumentVersions(documentId);
    res.json(versions);
  } catch (error) {
    console.error("Error fetching document versions:", error);
    res.status(500).json({ error: "Failed to fetch document versions" });
  }
});

// Create a new document version
router.post("/documents/:documentId/versions", async (req, res) => {
  try {
    const documentId = parseInt(req.params.documentId, 10);
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const versionData = insertDocumentVersionSchema.parse({
      ...req.body,
      documentId,
      createdBy: userId,
    });

    const newVersion = await createDocumentVersion(versionData);
    res.status(201).json(newVersion);
  } catch (error) {
    console.error("Error creating document version:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid version data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create document version" });
  }
});

// Get a specific version
router.get("/versions/:versionId", async (req, res) => {
  try {
    const versionId = parseInt(req.params.versionId, 10);
    const version = await getDocumentVersionById(versionId);
    
    if (!version) {
      return res.status(404).json({ error: "Version not found" });
    }
    
    res.json(version);
  } catch (error) {
    console.error("Error fetching document version:", error);
    res.status(500).json({ error: "Failed to fetch document version" });
  }
});

// Set active version
router.put("/documents/:documentId/versions/:versionId/activate", async (req, res) => {
  try {
    const documentId = parseInt(req.params.documentId, 10);
    const versionId = parseInt(req.params.versionId, 10);
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    await setActiveVersion(documentId, versionId, userId);
    res.json({ message: "Version activated successfully" });
  } catch (error) {
    console.error("Error activating version:", error);
    res.status(500).json({ error: "Failed to activate version" });
  }
});

// Get active version
router.get("/documents/:documentId/versions/active", async (req, res) => {
  try {
    const documentId = parseInt(req.params.documentId, 10);
    const activeVersion = await getActiveVersion(documentId);
    
    if (!activeVersion) {
      return res.status(404).json({ error: "No active version found" });
    }
    
    res.json(activeVersion);
  } catch (error) {
    console.error("Error fetching active version:", error);
    res.status(500).json({ error: "Failed to fetch active version" });
  }
});

// Delete a version
router.delete("/versions/:versionId", async (req, res) => {
  try {
    const versionId = parseInt(req.params.versionId, 10);
    await deleteDocumentVersion(versionId);
    res.json({ message: "Version deleted successfully" });
  } catch (error) {
    console.error("Error deleting version:", error);
    res.status(500).json({ error: "Failed to delete version" });
  }
});

// Compare two versions
router.post("/versions/:fromVersionId/compare/:toVersionId", async (req, res) => {
  try {
    const fromVersionId = parseInt(req.params.fromVersionId, 10);
    const toVersionId = parseInt(req.params.toVersionId, 10);
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const comparison = await compareVersions(fromVersionId, toVersionId, userId);
    res.json(comparison);
  } catch (error) {
    console.error("Error comparing versions:", error);
    res.status(500).json({ error: "Failed to compare versions" });
  }
});

// Get version comparisons for a document
router.get("/documents/:documentId/comparisons", async (req, res) => {
  try {
    const documentId = parseInt(req.params.documentId, 10);
    const comparisons = await getVersionComparisons(documentId);
    res.json(comparisons);
  } catch (error) {
    console.error("Error fetching version comparisons:", error);
    res.status(500).json({ error: "Failed to fetch version comparisons" });
  }
});

// Get version conflicts
router.get("/documents/:documentId/conflicts", async (req, res) => {
  try {
    const documentId = parseInt(req.params.documentId, 10);
    const status = req.query.status as string;
    const conflicts = await getVersionConflicts(documentId, status);
    res.json(conflicts);
  } catch (error) {
    console.error("Error fetching version conflicts:", error);
    res.status(500).json({ error: "Failed to fetch version conflicts" });
  }
});

// Resolve a version conflict
router.put("/conflicts/:conflictId/resolve", async (req, res) => {
  try {
    const conflictId = parseInt(req.params.conflictId, 10);
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { resolvedContent, resolutionStrategy, resolutionNotes } = req.body;
    
    await resolveVersionConflict(
      conflictId, 
      resolvedContent, 
      resolutionStrategy, 
      userId, 
      resolutionNotes
    );
    
    res.json({ message: "Conflict resolved successfully" });
  } catch (error) {
    console.error("Error resolving conflict:", error);
    res.status(500).json({ error: "Failed to resolve conflict" });
  }
});

// Create version tag
router.post("/versions/:versionId/tags", async (req, res) => {
  try {
    const versionId = parseInt(req.params.versionId, 10);
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const tagData = insertDocumentVersionTagSchema.parse({
      ...req.body,
      versionId,
      createdBy: userId,
    });

    const newTag = await createVersionTag(tagData);
    res.status(201).json(newTag);
  } catch (error) {
    console.error("Error creating version tag:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid tag data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create version tag" });
  }
});

// Get version tags
router.get("/versions/:versionId/tags", async (req, res) => {
  try {
    const versionId = parseInt(req.params.versionId, 10);
    const tags = await getVersionTags(versionId);
    res.json(tags);
  } catch (error) {
    console.error("Error fetching version tags:", error);
    res.status(500).json({ error: "Failed to fetch version tags" });
  }
});

// Delete version tag
router.delete("/tags/:tagId", async (req, res) => {
  try {
    const tagId = parseInt(req.params.tagId, 10);
    await deleteVersionTag(tagId);
    res.json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error deleting tag:", error);
    res.status(500).json({ error: "Failed to delete tag" });
  }
});

// Get version history
router.get("/documents/:documentId/history", async (req, res) => {
  try {
    const documentId = parseInt(req.params.documentId, 10);
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const history = await getVersionHistory(documentId, limit);
    res.json(history);
  } catch (error) {
    console.error("Error fetching version history:", error);
    res.status(500).json({ error: "Failed to fetch version history" });
  }
});

// Get version statistics
router.get("/documents/:documentId/stats", async (req, res) => {
  try {
    const documentId = parseInt(req.params.documentId, 10);
    const stats = await getVersionStatistics(documentId);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching version statistics:", error);
    res.status(500).json({ error: "Failed to fetch version statistics" });
  }
});

// Rollback to a specific version
router.post("/documents/:documentId/rollback/:targetVersionId", async (req, res) => {
  try {
    const documentId = parseInt(req.params.documentId, 10);
    const targetVersionId = parseInt(req.params.targetVersionId, 10);
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const newVersion = await rollbackToVersion(documentId, targetVersionId, userId);
    res.json(newVersion);
  } catch (error) {
    console.error("Error rolling back version:", error);
    res.status(500).json({ error: "Failed to rollback version" });
  }
});

export default router;