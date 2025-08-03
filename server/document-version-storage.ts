import { desc, eq, and, or, sql, ne, asc } from "drizzle-orm";
import { 
  documentVersions, 
  documentVersionComparisons, 
  documentVersionConflicts, 
  documentVersionTags,
  documents,
  users,
  type InsertDocumentVersion,
  type DocumentVersion,
  type InsertDocumentVersionComparison,
  type DocumentVersionComparison,
  type InsertDocumentVersionConflict,
  type DocumentVersionConflict,
  type InsertDocumentVersionTag,
  type DocumentVersionTag
} from "@shared/schema";
import { db } from "./db";

// Document Version Management
export async function createDocumentVersion(version: InsertDocumentVersion): Promise<DocumentVersion> {
  // Generate version number
  const versionNumber = `${version.majorVersion}.${version.minorVersion}.${version.patchVersion}`;
  
  // Calculate content statistics
  const content = version.content || '';
  const plainText = content.replace(/<[^>]*>/g, '');
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
  const characterCount = plainText.length;
  
  // Generate content hash for duplicate detection
  const contentHash = await generateContentHash(content);
  
  const [newVersion] = await db.insert(documentVersions).values({
    ...version,
    versionNumber,
    wordCount,
    characterCount,
    contentHash,
  }).returning();

  return newVersion;
}

export async function getDocumentVersions(documentId: number): Promise<DocumentVersion[]> {
  return await db
    .select()
    .from(documentVersions)
    .where(eq(documentVersions.documentId, documentId))
    .orderBy(desc(documentVersions.createdAt));
}

export async function getDocumentVersionById(versionId: number): Promise<DocumentVersion | null> {
  const [version] = await db
    .select()
    .from(documentVersions)
    .where(eq(documentVersions.id, versionId));
  
  return version || null;
}

export async function setActiveVersion(documentId: number, versionId: number, userId: string): Promise<void> {
  // First, deactivate all versions for this document
  await db
    .update(documentVersions)
    .set({ isActive: false, isCurrent: false })
    .where(eq(documentVersions.documentId, documentId));

  // Then activate the specified version
  await db
    .update(documentVersions)
    .set({ 
      isActive: true, 
      isCurrent: true,
      status: 'published',
      publishedAt: new Date()
    })
    .where(eq(documentVersions.id, versionId));

  // Update the main document with the version content
  const version = await getDocumentVersionById(versionId);
  if (version) {
    await db
      .update(documents)
      .set({ 
        content: version.content,
        title: version.title,
        version: version.versionNumber,
        updatedAt: new Date()
      })
      .where(eq(documents.id, documentId));
  }
}

export async function getActiveVersion(documentId: number): Promise<DocumentVersion | null> {
  const [activeVersion] = await db
    .select()
    .from(documentVersions)
    .where(and(
      eq(documentVersions.documentId, documentId),
      eq(documentVersions.isActive, true)
    ));
  
  return activeVersion || null;
}

export async function deleteDocumentVersion(versionId: number): Promise<void> {
  await db.delete(documentVersions).where(eq(documentVersions.id, versionId));
}

// Version Comparison Functions
export async function createVersionComparison(comparison: InsertDocumentVersionComparison): Promise<DocumentVersionComparison> {
  const [newComparison] = await db.insert(documentVersionComparisons).values(comparison).returning();
  return newComparison;
}

export async function compareVersions(fromVersionId: number, toVersionId: number, userId: string): Promise<DocumentVersionComparison> {
  const fromVersion = await getDocumentVersionById(fromVersionId);
  const toVersion = await getDocumentVersionById(toVersionId);
  
  if (!fromVersion || !toVersion) {
    throw new Error("Version not found");
  }

  // Perform content comparison
  const comparison = performContentDiff(fromVersion.content, toVersion.content);
  
  const comparisonData = {
    fromVersionId,
    toVersionId,
    documentId: fromVersion.documentId,
    performedBy: userId,
    comparisonData: comparison,
    addedContent: comparison.additions.join('\n'),
    removedContent: comparison.deletions.join('\n'),
    modifiedSections: comparison.modifications,
    additionsCount: comparison.additions.length,
    deletionsCount: comparison.deletions.length,
    modificationsCount: comparison.modifications.length,
  };

  return await createVersionComparison(comparisonData);
}

export async function getVersionComparisons(documentId: number): Promise<DocumentVersionComparison[]> {
  return await db
    .select()
    .from(documentVersionComparisons)
    .where(eq(documentVersionComparisons.documentId, documentId))
    .orderBy(desc(documentVersionComparisons.createdAt));
}

// Version Conflict Management
export async function createVersionConflict(conflict: InsertDocumentVersionConflict): Promise<DocumentVersionConflict> {
  const [newConflict] = await db.insert(documentVersionConflicts).values(conflict).returning();
  return newConflict;
}

export async function resolveVersionConflict(
  conflictId: number, 
  resolvedContent: string, 
  resolutionStrategy: string,
  resolvedBy: string,
  resolutionNotes?: string
): Promise<void> {
  await db
    .update(documentVersionConflicts)
    .set({
      status: 'resolved',
      resolvedContent,
      resolutionStrategy,
      resolvedBy,
      resolutionNotes,
      resolvedAt: new Date()
    })
    .where(eq(documentVersionConflicts.id, conflictId));
}

export async function getVersionConflicts(documentId: number, status?: string): Promise<DocumentVersionConflict[]> {
  const conditions = [eq(documentVersionConflicts.documentId, documentId)];
  
  if (status) {
    conditions.push(eq(documentVersionConflicts.status, status));
  }

  return await db
    .select()
    .from(documentVersionConflicts)
    .where(and(...conditions))
    .orderBy(desc(documentVersionConflicts.detectedAt));
}

// Version Tags Management
export async function createVersionTag(tag: InsertDocumentVersionTag): Promise<DocumentVersionTag> {
  const [newTag] = await db.insert(documentVersionTags).values(tag).returning();
  return newTag;
}

export async function getVersionTags(versionId: number): Promise<DocumentVersionTag[]> {
  return await db
    .select()
    .from(documentVersionTags)
    .where(eq(documentVersionTags.versionId, versionId))
    .orderBy(desc(documentVersionTags.createdAt));
}

export async function deleteVersionTag(tagId: number): Promise<void> {
  await db.delete(documentVersionTags).where(eq(documentVersionTags.id, tagId));
}

// Utility Functions
async function generateContentHash(content: string): Promise<string> {
  // Simple hash generation for content comparison
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

function performContentDiff(oldContent: string, newContent: string) {
  // Simple diff implementation
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  
  const additions: string[] = [];
  const deletions: string[] = [];
  const modifications: string[] = [];
  
  // Basic line-by-line comparison
  const maxLines = Math.max(oldLines.length, newLines.length);
  
  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i] || '';
    const newLine = newLines[i] || '';
    
    if (oldLine && !newLine) {
      deletions.push(oldLine);
    } else if (!oldLine && newLine) {
      additions.push(newLine);
    } else if (oldLine !== newLine) {
      modifications.push(`Line ${i + 1}: "${oldLine}" → "${newLine}"`);
    }
  }
  
  return {
    additions,
    deletions,
    modifications,
    summary: `+${additions.length} -${deletions.length} ~${modifications.length}`
  };
}

// Version History and Analytics
export async function getVersionHistory(documentId: number, limit: number = 10): Promise<DocumentVersion[]> {
  return await db
    .select()
    .from(documentVersions)
    .where(eq(documentVersions.documentId, documentId))
    .orderBy(desc(documentVersions.createdAt))
    .limit(limit);
}

export async function getVersionStatistics(documentId: number) {
  const versions = await getDocumentVersions(documentId);
  const activeVersion = await getActiveVersion(documentId);
  const conflicts = await getVersionConflicts(documentId);
  const comparisons = await getVersionComparisons(documentId);
  
  return {
    totalVersions: versions.length,
    activeVersion: activeVersion?.versionNumber || 'None',
    draftVersions: versions.filter(v => v.status === 'draft').length,
    publishedVersions: versions.filter(v => v.status === 'published').length,
    pendingConflicts: conflicts.filter(c => c.status === 'unresolved').length,
    totalComparisons: comparisons.length,
    lastVersionCreated: versions[0]?.createdAt || null,
    majorVersions: [...new Set(versions.map(v => v.majorVersion))].length,
  };
}

// Rollback functionality
export async function rollbackToVersion(documentId: number, targetVersionId: number, userId: string): Promise<DocumentVersion> {
  const targetVersion = await getDocumentVersionById(targetVersionId);
  if (!targetVersion) {
    throw new Error("Target version not found");
  }

  // Create a new version based on the target version
  const currentActiveVersion = await getActiveVersion(documentId);
  const newMajorVersion = currentActiveVersion ? currentActiveVersion.majorVersion + 1 : 1;
  
  const rollbackVersion: InsertDocumentVersion = {
    documentId,
    majorVersion: newMajorVersion,
    minorVersion: 0,
    patchVersion: 0,
    title: targetVersion.title,
    content: targetVersion.content,
    summary: `Rollback to version ${targetVersion.versionNumber}`,
    changeType: 'major',
    changeLog: `Rolled back to version ${targetVersion.versionNumber} from ${currentActiveVersion?.versionNumber || 'unknown'}`,
    status: 'published',
    createdBy: userId,
    basedOnVersionId: targetVersionId,
    documentMetadata: targetVersion.documentMetadata,
  };

  const newVersion = await createDocumentVersion(rollbackVersion);
  await setActiveVersion(documentId, newVersion.id, userId);
  
  return newVersion;
}