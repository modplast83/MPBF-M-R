import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { API_ENDPOINTS } from "@/lib/constants";
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Edit,
  AlertCircle,
  ArrowLeft,
  FileType
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function DocumentTemplates() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: templates,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [API_ENDPOINTS.DOCUMENT_TEMPLATES],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.DOCUMENT_TEMPLATES);
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      return response.json();
    },
  });

  const filteredTemplates = templates?.filter((template: any) =>
    template.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const columns = [
    {
      accessorKey: "templateName" as keyof typeof filteredTemplates[0],
      header: "Template Name",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <FileType className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.templateName}</span>
        </div>
      ),
    },
    {
      accessorKey: "documentType" as keyof typeof filteredTemplates[0],
      header: "Document Type",
      cell: (row: any) => (
        <Badge variant="secondary">
          {row.documentType}
        </Badge>
      ),
    },
    {
      accessorKey: "description" as keyof typeof filteredTemplates[0],
      header: "Description",
      cell: (row: any) => (
        <div className="max-w-[300px] truncate">
          {row.description || "No description"}
        </div>
      ),
    },
    {
      accessorKey: "isDefault" as keyof typeof filteredTemplates[0],
      header: "Default",
      cell: (row: any) => (
        row.isDefault ? (
          <Badge variant="default">Default</Badge>
        ) : null
      ),
    },
    {
      accessorKey: "createdAt" as keyof typeof filteredTemplates[0],
      header: "Created",
      cell: (row: any) => (
        <div className="text-sm text-muted-foreground">
          {format(new Date(row.createdAt), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row: any) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // TODO: Implement template preview
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // TODO: Implement template edit
              }}
            >
              <Edit className="h-4 w-4" />
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
              <h3 className="text-lg font-semibold mb-2">Error Loading Templates</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load document templates. Please try again.
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
            <h1 className="text-3xl font-bold">Document Templates</h1>
            <p className="text-muted-foreground">
              Manage document templates for faster document creation
            </p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredTemplates}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}