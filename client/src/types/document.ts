export interface Document {
  id: number;
  documentNumber: string;
  documentType: string;
  title: string;
  content: string;
  templateId?: number;
  status: string;
  version: string;
  parentDocumentId?: number;
  createdBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  publishedBy?: string;
  effectiveDate?: string;
  expiryDate?: string;
  reviewDate?: string;
  priority: string;
  category?: string;
  department?: string;
  tags: string[];
  recipientIds: string[];
  sectionIds: string[];
  isPublic: boolean;
  accessLevel: string;
  requiresApproval: boolean;
  approvalWorkflow: string[];
  isTemplate: boolean;
  isActive: boolean;
  attachments: any[];
  references: any[];
  viewCount: number;
  downloadCount: number;
  lastViewedAt?: string;
  isArchived: boolean;
  archivedAt?: string;
  archivedBy?: string;
  archiveReason?: string;
  complianceRequired: boolean;
  auditTrail: any[];
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  approvedAt?: string;
  publishedAt?: string;
}

export interface DocumentTemplate {
  id: number;
  templateName: string;
  documentType: string;
  templateContent: string;
  templateVariables: any;
  description?: string;
  category?: string;
  department?: string;
  isDefault: boolean;
  isActive: boolean;
  version: string;
  parentTemplateId?: number;
  accessLevel: string;
  usageCount: number;
  lastUsedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentStats {
  totalDocuments: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  byDepartment: Record<string, number>;
  recentViews: number;
  pendingApprovals: number;
  expiringDocuments: number;
}

export interface DocumentFilters {
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
}

export interface CreateDocumentRequest {
  documentType: string;
  title: string;
  content: string;
  templateId?: number;
  effectiveDate?: string;
  expiryDate?: string;
  reviewDate?: string;
  priority?: string;
  category?: string;
  department?: string;
  tags?: string[];
  recipientIds?: string[];
  sectionIds?: string[];
  isPublic?: boolean;
  accessLevel?: string;
  requiresApproval?: boolean;
  approvalWorkflow?: string[];
  isTemplate?: boolean;
  complianceRequired?: boolean;
}

export interface UpdateDocumentRequest extends Partial<CreateDocumentRequest> {
  id: number;
}

export interface DocumentVersion {
  id: number;
  parentDocumentId: number;
  version: string;
  title: string;
  content: string;
  changes: string;
  createdBy: string;
  createdAt: string;
}

export interface DocumentApproval {
  id: number;
  documentId: number;
  approverId: string;
  approverName: string;
  approvalLevel: number;
  status: string;
  comments?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface DocumentComment {
  id: number;
  documentId: number;
  commentBy: string;
  commentByName: string;
  comment: string;
  commentType: string;
  isInternal: boolean;
  parentCommentId?: number;
  createdAt: string;
  updatedAt: string;
  replies?: DocumentComment[];
}

export interface DocumentView {
  id: number;
  documentId: number;
  viewedBy: string;
  viewedByName: string;
  viewedAt: string;
  viewDuration?: number;
  deviceType?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface DocumentSubscription {
  id: number;
  userId: string;
  documentId?: number;
  documentType?: string;
  category?: string;
  subscriptionType: string;
  isActive: boolean;
  createdAt: string;
}

export interface DocumentActivity {
  id: number;
  documentId: number;
  activityType: string;
  description: string;
  performedBy: string;
  performedByName: string;
  metadata?: any;
  createdAt: string;
}

export interface DocumentShare {
  id: number;
  documentId: number;
  sharedBy: string;
  sharedWith: string;
  accessLevel: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface DocumentRevision {
  id: number;
  documentId: number;
  revisionNumber: number;
  title: string;
  content: string;
  changes: string;
  createdBy: string;
  createdAt: string;
}

export interface DocumentWorkflow {
  id: number;
  documentId: number;
  workflowName: string;
  currentStep: number;
  totalSteps: number;
  status: string;
  assignedTo?: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}