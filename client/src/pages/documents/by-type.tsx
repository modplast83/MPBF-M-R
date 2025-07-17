import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { API_ENDPOINTS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Archive,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

const documentTypeLabels = {
  "instruction": "Instructions",
  "obligation": "Obligations", 
  "announcement": "Announcements",
  "general_letter": "General Letters",
  "agreement": "Agreements",
  "contract": "Contracts",
  "request": "Requests",
  "disclaimer": "Disclaimers",
};

export default function DocumentsByType() {
  const { type } = useParams<{ type: string }>();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
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
        documentType: type,
        search: searchTerm,
        page: currentPage,
        limit: pageSize,
      },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("documentType", type);
      if (searchTerm) params.append("search", searchTerm);
      params.append("page", currentPage.toString());
      params.append("limit", pageSize.toString());

      const response = await fetch(`${API_ENDPOINTS.DOCUMENTS}?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      return response.json();
    },
  });

  const documents = documentsData?.documents || [];
  const totalDocuments = documentsData?.total || 0;
  const typeLabel = documentTypeLabels[type as keyof typeof documentTypeLabels] || type;

  const columns = [
    {
      accessorKey: "documentNumber",
      header: "Document #",
      cell: ({ row }: { row: any }) => (
        <div className="font-mono text-sm">{row.getValue("documentNumber")}</div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }: { row: any }) => (
        <div className="max-w-[400px] truncate">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.getValue("status") as string;
        const variants = {
          draft: "secondary",
          active: "default",
          archived: "outline",
        };
        return (
          <Badge variant={variants[status as keyof typeof variants] as any}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority", 
      cell: ({ row }: { row: any }) => {
        const priority = row.getValue("priority") as string;
        const variants = {
          low: "secondary",
          medium: "default",
          high: "destructive",
          urgent: "destructive",
        };
        return (
          <Badge variant={variants[priority as keyof typeof variants] as any}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
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
              <Link href={`/documents/${document.id}/view`}>
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
              <h3 className="text-lg font-semibold mb-2">Error Loading Documents</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load {typeLabel.toLowerCase()}. Please try again.
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
            <h1 className="text-3xl font-bold">{typeLabel}</h1>
            <p className="text-muted-foreground">
              {totalDocuments} {typeLabel.toLowerCase()} found
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/documents/new?type=${type}`}>
            <Plus className="h-4 w-4 mr-2" />
            New {typeLabel.slice(0, -1)}
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search {typeLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${typeLabel.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>{typeLabel} List</CardTitle>
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
    </div>
  );
}