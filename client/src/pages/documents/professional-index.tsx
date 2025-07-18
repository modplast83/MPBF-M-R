import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Archive,
  Download,
  Calendar,
  User,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  PieChart,
  Target,
  AlertTriangle,
  Settings,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Document } from "@/types/document";

interface DocumentStats {
  totalDocuments: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  byDepartment: Record<string, number>;
  recentViews: number;
  pendingApprovals: number;
  expiringDocuments: number;
}

const API_ENDPOINTS = {
  DOCUMENTS: '/api/documents',
  DOCUMENT_STATS: '/api/documents/stats',
  DOCUMENT_TYPES: '/api/document-types',
  DOCUMENT_STATUSES: '/api/document-statuses',
  ACCESS_LEVELS: '/api/access-levels',
  PRIORITY_LEVELS: '/api/priority-levels',
};

export default function ProfessionalDocumentsIndex() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch documents with advanced filtering
  const {
    data: documentsData,
    isLoading: documentsLoading,
    error: documentsError,
    refetch: refetchDocuments,
  } = useQuery({
    queryKey: [
      API_ENDPOINTS.DOCUMENTS,
      {
        search: searchTerm,
        documentType: selectedType !== "all" ? selectedType : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        department: selectedDepartment !== "all" ? selectedDepartment : undefined,
        priority: selectedPriority !== "all" ? selectedPriority : undefined,
        page: currentPage,
        limit: pageSize,
        sortBy,
        sortOrder,
      },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedType !== "all") params.append("documentType", selectedType);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (selectedDepartment !== "all") params.append("department", selectedDepartment);
      if (selectedPriority !== "all") params.append("priority", selectedPriority);
      params.append("page", currentPage.toString());
      params.append("limit", pageSize.toString());
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);

      const response = await fetch(`${API_ENDPOINTS.DOCUMENTS}?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      return response.json();
    },
  });

  // Fetch document statistics
  const {
    data: stats,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: [API_ENDPOINTS.DOCUMENT_STATS],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.DOCUMENT_STATS);
      if (!response.ok) {
        throw new Error("Failed to fetch document statistics");
      }
      return response.json();
    },
  });

  // Fetch dropdown options
  const { data: documentTypes } = useQuery({
    queryKey: [API_ENDPOINTS.DOCUMENT_TYPES],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.DOCUMENT_TYPES);
      return response.json();
    },
  });

  const { data: documentStatuses } = useQuery({
    queryKey: [API_ENDPOINTS.DOCUMENT_STATUSES],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.DOCUMENT_STATUSES);
      return response.json();
    },
  });

  const documents = documentsData?.documents || [];
  const totalDocuments = documentsData?.total || 0;

  // Archive document mutation
  const archiveMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const response = await fetch(`${API_ENDPOINTS.DOCUMENTS}/${id}/archive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) {
        throw new Error("Failed to archive document");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('documents.success.archived'),
        description: t('documents.success.archived_description'),
      });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.DOCUMENTS] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.DOCUMENT_STATS] });
    },
    onError: () => {
      toast({
        title: t('documents.error.archive_failed'),
        description: t('documents.error.archive_failed_description'),
        variant: "destructive",
      });
    },
  });

  const handleArchive = async (documentId: number) => {
    if (window.confirm(t('documents.confirm.archive'))) {
      archiveMutation.mutate({ id: documentId, reason: "Manual archive" });
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'draft': return 'bg-gray-100 text-gray-800';
        case 'under_review': return 'bg-yellow-100 text-yellow-800';
        case 'approved': return 'bg-green-100 text-green-800';
        case 'published': return 'bg-blue-100 text-blue-800';
        case 'archived': return 'bg-gray-100 text-gray-600';
        case 'obsolete': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <Badge className={getStatusColor(status)}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  // Priority badge component
  const PriorityBadge = ({ priority }: { priority: string }) => {
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'low': return 'bg-green-100 text-green-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'high': return 'bg-orange-100 text-orange-800';
        case 'urgent': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <Badge className={getPriorityColor(priority)}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  // Document type icon component
  const DocumentTypeIcon = ({ type }: { type: string }) => {
    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'policy': return <Target className="h-4 w-4" />;
        case 'procedure': return <Settings className="h-4 w-4" />;
        case 'instruction': return <FileText className="h-4 w-4" />;
        case 'form': return <FileText className="h-4 w-4" />;
        case 'contract': return <FileText className="h-4 w-4" />;
        case 'agreement': return <FileText className="h-4 w-4" />;
        case 'report': return <BarChart3 className="h-4 w-4" />;
        case 'memo': return <FileText className="h-4 w-4" />;
        case 'letter': return <FileText className="h-4 w-4" />;
        case 'manual': return <FileText className="h-4 w-4" />;
        case 'specification': return <FileText className="h-4 w-4" />;
        case 'guideline': return <FileText className="h-4 w-4" />;
        default: return <FileText className="h-4 w-4" />;
      }
    };

    return getTypeIcon(type);
  };

  if (documentsError) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2">{t('documents.error.loading_failed')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('documents.error.loading_failed_description')}
              </p>
              <Button onClick={() => refetchDocuments()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('common.try_again')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('documents.title')}</h1>
          <p className="text-muted-foreground">{t('documents.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/documents/templates">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              {t('documents.templates')}
            </Button>
          </Link>
          <Link href="/documents/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('documents.create_document')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('documents.stats.total_documents')}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">
                {t('documents.stats.active_documents')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('documents.stats.recent_views')}</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentViews}</div>
              <p className="text-xs text-muted-foreground">
                {t('documents.stats.last_30_days')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('documents.stats.pending_approvals')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                {t('documents.stats.awaiting_review')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('documents.stats.expiring_documents')}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.expiringDocuments}</div>
              <p className="text-xs text-muted-foreground">
                {t('documents.stats.next_30_days')}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t('documents.filters.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('documents.filters.search')}</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('documents.filters.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('documents.filters.document_type')}</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder={t('documents.filters.all_types')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('documents.filters.all_types')}</SelectItem>
                  {documentTypes?.map((type: any) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('documents.filters.status')}</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={t('documents.filters.all_statuses')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('documents.filters.all_statuses')}</SelectItem>
                  {documentStatuses?.map((status: any) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('documents.filters.department')}</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder={t('documents.filters.all_departments')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('documents.filters.all_departments')}</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('documents.filters.priority')}</label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger>
                  <SelectValue placeholder={t('documents.filters.all_priorities')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('documents.filters.all_priorities')}</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('documents.list.title')}</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t('documents.list.showing_results', { 
                  from: (currentPage - 1) * pageSize + 1,
                  to: Math.min(currentPage * pageSize, totalDocuments),
                  total: totalDocuments
                })}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {documentsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t('documents.loading')}</p>
              </div>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">{t('documents.empty.title')}</h3>
              <p className="text-muted-foreground mb-4">{t('documents.empty.description')}</p>
              <Link href="/documents/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('documents.create_first_document')}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((document: any) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <DocumentTypeIcon type={document.documentType} />
                          <span className="text-sm text-muted-foreground">
                            {document.documentNumber}
                          </span>
                          <StatusBadge status={document.status} />
                          <PriorityBadge priority={document.priority} />
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-1">{document.title}</h3>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {document.content.substring(0, 200)}...
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{document.createdBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(document.createdAt), 'MMM dd, yyyy')}</span>
                          </div>
                          {document.department && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{document.department}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{document.viewCount} views</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Link href={`/documents/${document.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            {t('documents.actions.view')}
                          </Button>
                        </Link>
                        
                        <Link href={`/documents/${document.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            {t('documents.actions.edit')}
                          </Button>
                        </Link>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleArchive(document.id)}
                          disabled={archiveMutation.isPending}
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          {t('documents.actions.archive')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalDocuments > pageSize && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {Math.ceil(totalDocuments / pageSize)}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(Math.ceil(totalDocuments / pageSize), currentPage + 1))}
            disabled={currentPage === Math.ceil(totalDocuments / pageSize)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}