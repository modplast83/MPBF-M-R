import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth-v2";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Archive, 
  Download,
  AlertCircle,
  Bell,
  FileCheck,
  FileX,
  Calendar,
  User,
  FileType,
  BarChart3,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const documentTypes = [
  { value: "instruction", label: "Instructions", icon: FileCheck },
  { value: "obligation", label: "Obligations", icon: AlertCircle },
  { value: "announcement", label: "Announcements", icon: Bell },
  { value: "general_letter", label: "General Letters", icon: FileText },
  { value: "agreement", label: "Agreements", icon: FileCheck },
  { value: "contract", label: "Contracts", icon: FileX },
  { value: "request", label: "Requests", icon: FileType },
  { value: "disclaimer", label: "Disclaimers", icon: FileX },
];

const statusOptions = [
  { value: "draft", label: "Draft", variant: "secondary" },
  { value: "active", label: "Active", variant: "default" },
  { value: "archived", label: "Archived", variant: "outline" },
];

const priorityOptions = [
  { value: "low", label: "Low", variant: "secondary" },
  { value: "medium", label: "Medium", variant: "default" },
  { value: "high", label: "High", variant: "destructive" },
  { value: "urgent", label: "Urgent", variant: "destructive" },
];

interface Document {
  id: number;
  documentNumber: string;
  documentType: string;
  title: string;
  content: string;
  status: string;
  priority: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  isArchived: boolean;
  createdByUser?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
}

interface DocumentStats {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  recentViews: number;
}

export default function DocumentsIndex() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch documents with filters
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
        page: currentPage,
        limit: pageSize,
      },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedType !== "all") params.append("documentType", selectedType);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      params.append("page", currentPage.toString());
      params.append("limit", pageSize.toString());

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
    queryKey: [`${API_ENDPOINTS.DOCUMENTS}/stats`],
    queryFn: async () => {
      const response = await fetch(`${API_ENDPOINTS.DOCUMENTS}/stats`);
      if (!response.ok) {
        throw new Error("Failed to fetch document statistics");
      }
      return response.json();
    },
  });

  const documents = documentsData?.documents || [];
  const totalDocuments = documentsData?.total || 0;

  const columns = [
    {
      accessorKey: "documentNumber",
      header: "Document #",
      cell: ({ row }: { row: any }) => (
        <div className="font-mono text-sm">{row.getValue("documentNumber")}</div>
      ),
    },
    {
      accessorKey: "documentType",
      header: "Type",
      cell: ({ row }: { row: any }) => {
        const type = row.getValue("documentType") as string;
        const typeInfo = documentTypes.find(t => t.value === type);
        const Icon = typeInfo?.icon || FileText;
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{typeInfo?.label || type}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }: { row: any }) => (
        <div className="max-w-[300px] truncate">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.getValue("status") as string;
        const statusInfo = statusOptions.find(s => s.value === status);
        return (
          <Badge variant={statusInfo?.variant as any}>
            {statusInfo?.label || status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }: { row: any }) => {
        const priority = row.getValue("priority") as string;
        const priorityInfo = priorityOptions.find(p => p.value === priority);
        return (
          <Badge variant={priorityInfo?.variant as any}>
            {priorityInfo?.label || priority}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdByUser",
      header: "Created By",
      cell: ({ row }: { row: any }) => {
        const user = row.getValue("createdByUser") as any;
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.username || "Unknown"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "viewCount",
      header: "Views",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>{row.getValue("viewCount")}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }: { row: any }) => (
        <div className="text-sm text-muted-foreground">
          {format(new Date(row.getValue("createdAt")), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const document = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link href={`/documents/${document.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link href={`/documents/${document.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            {!document.isArchived && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleArchive(document.id)}
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const handleArchive = async (documentId: number) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.DOCUMENTS}/${documentId}/archive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Manual archive" }),
      });

      if (!response.ok) {
        throw new Error("Failed to archive document");
      }

      toast({
        title: "Document archived",
        description: "The document has been successfully archived.",
      });

      refetchDocuments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive document. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (documentsError) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Documents</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load documents. Please try again.
              </p>
              <Button onClick={() => refetchDocuments()}>
                Try Again
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Manage company documents, templates, and archives
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/documents/templates">
              <FileType className="h-4 w-4 mr-2" />
              Templates
            </Link>
          </Button>
          <Button asChild>
            <Link href="/documents/new">
              <Plus className="h-4 w-4 mr-2" />
              New Document
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Documents</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byStatus.active || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Documents</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byStatus.draft || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentViews}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Document Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={documents}
            loading={documentsLoading}
            pagination={{
              page: currentPage,
              pageSize: pageSize,
              total: totalDocuments,
              onPageChange: setCurrentPage,
              onPageSizeChange: setPageSize,
            }}
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {documentTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card key={type.value} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">{type.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats?.byType[type.value] || 0} documents
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/documents/${type.value}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}