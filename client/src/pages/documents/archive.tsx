import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { API_ENDPOINTS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { 
  Archive, 
  ArchiveRestore, 
  Search, 
  Eye, 
  AlertCircle,
  ArrowLeft,
  FileText,
  User,
  Calendar
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function DocumentArchive() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: documentsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      API_ENDPOINTS.DOCUMENTS,
      {
        search: searchTerm,
        documentType: selectedType !== "all" ? selectedType : undefined,
        isArchived: true,
        page: currentPage,
        limit: pageSize,
      },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("isArchived", "true");
      if (searchTerm) params.append("search", searchTerm);
      if (selectedType !== "all") params.append("documentType", selectedType);
      params.append("page", currentPage.toString());
      params.append("limit", pageSize.toString());

      const response = await fetch(`${API_ENDPOINTS.DOCUMENTS}?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch archived documents");
      }
      return response.json();
    },
  });

  const unarchiveMutation = useMutation({
    mutationFn: async (documentId: number) => {
      const response = await fetch(`${API_ENDPOINTS.DOCUMENTS}/${documentId}/unarchive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to unarchive document");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Document unarchived",
        description: "The document has been successfully restored.",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unarchive document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const documents = documentsData?.documents || [];
  const totalDocuments = documentsData?.total || 0;

  const documentTypes = [
    { value: "instruction", label: "Instructions" },
    { value: "obligation", label: "Obligations" },
    { value: "announcement", label: "Announcements" },
    { value: "general_letter", label: "General Letters" },
    { value: "agreement", label: "Agreements" },
    { value: "contract", label: "Contracts" },
    { value: "request", label: "Requests" },
    { value: "disclaimer", label: "Disclaimers" },
  ];

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
        return (
          <Badge variant="secondary">
            {typeInfo?.label || type}
          </Badge>
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
      accessorKey: "createdByUser",
      header: "Created By",
      cell: ({ row }: { row: any }) => {
        const user = row.getValue("createdByUser") as any;
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.username || "Unknown"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "archivedAt",
      header: "Archived",
      cell: ({ row }: { row: any }) => (
        <div className="text-sm text-muted-foreground">
          {format(new Date(row.getValue("archivedAt")), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      accessorKey: "archiveReason",
      header: "Reason",
      cell: ({ row }: { row: any }) => (
        <div className="max-w-[200px] truncate text-sm">
          {row.getValue("archiveReason") || "No reason specified"}
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
              <Link href={`/documents/${document.id}/view`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => unarchiveMutation.mutate(document.id)}
              disabled={unarchiveMutation.isPending}
            >
              <ArchiveRestore className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Archive</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load archived documents. Please try again.
              </p>
              <Button onClick={() => refetch()}>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/documents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Document Archive</h1>
            <p className="text-muted-foreground">
              {totalDocuments} archived documents
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Archived Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search archived documents..."
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
          </div>
        </CardContent>
      </Card>

      {/* Archived Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archived Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={documents}
            loading={isLoading}
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

      {/* Archive Info */}
      <Card>
        <CardHeader>
          <CardTitle>Archive Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • Archived documents are preserved but no longer appear in active document lists
            </p>
            <p className="text-sm text-muted-foreground">
              • You can restore archived documents using the restore button
            </p>
            <p className="text-sm text-muted-foreground">
              • Archived documents can still be viewed and searched
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}