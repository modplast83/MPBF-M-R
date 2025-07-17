import React from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { API_ENDPOINTS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Edit, 
  Archive, 
  Eye,
  User,
  Calendar,
  FileText,
  AlertCircle,
  Download,
  Share2,
  MessageSquare,
  Clock
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth-v2";

export default function DocumentView() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: document,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [`${API_ENDPOINTS.DOCUMENTS}/${id}`],
    queryFn: async () => {
      const response = await fetch(`${API_ENDPOINTS.DOCUMENTS}/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }
      return response.json();
    },
  });

  // Record view when document is loaded
  const recordViewMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(API_ENDPOINTS.DOCUMENT_VIEWS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: parseInt(id),
          deviceType: "desktop",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to record view");
      }
      return response.json();
    },
    onSuccess: () => {
      // Refetch document to update view count
      refetch();
    },
  });

  // Archive document mutation
  const archiveMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_ENDPOINTS.DOCUMENTS}/${id}/archive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Manual archive from document view" }),
      });
      if (!response.ok) {
        throw new Error("Failed to archive document");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Document archived",
        description: "The document has been successfully archived.",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to archive document. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Record view on document load
  React.useEffect(() => {
    if (document && user) {
      recordViewMutation.mutate();
    }
  }, [document, user]);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Document</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load the document. Please try again.
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full" />
              <p className="text-muted-foreground">Loading document...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusVariants = {
    draft: "secondary",
    active: "default",
    archived: "outline",
  };

  const priorityVariants = {
    low: "secondary",
    medium: "default",
    high: "destructive",
    urgent: "destructive",
  };

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
            <h1 className="text-3xl font-bold">{document.title}</h1>
            <p className="text-muted-foreground font-mono">
              {document.documentNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/documents/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          {!document.isArchived && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => archiveMutation.mutate()}
              disabled={archiveMutation.isPending}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          )}
        </div>
      </div>

      {/* Document Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Document Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Type</span>
              </div>
              <p className="text-sm">
                {document.documentType.charAt(0).toUpperCase() + document.documentType.slice(1)}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={statusVariants[document.status as keyof typeof statusVariants] as any}
                >
                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </Badge>
                <Badge 
                  variant={priorityVariants[document.priority as keyof typeof priorityVariants] as any}
                >
                  {document.priority.charAt(0).toUpperCase() + document.priority.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Views</span>
              </div>
              <p className="text-sm">{document.viewCount}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Created By</span>
              </div>
              <p className="text-sm">
                {document.createdByUser?.firstName && document.createdByUser?.lastName
                  ? `${document.createdByUser.firstName} ${document.createdByUser.lastName}`
                  : document.createdByUser?.username || "Unknown"}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Created</span>
              </div>
              <p className="text-sm">
                {format(new Date(document.createdAt), "PPP")}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last Updated</span>
              </div>
              <p className="text-sm">
                {format(new Date(document.updatedAt), "PPP")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Content */}
      <Card>
        <CardHeader>
          <CardTitle>Document Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: document.content }}
          />
        </CardContent>
      </Card>

      {/* Additional Information */}
      {(document.effectiveDate || document.expiryDate || document.tags?.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {document.effectiveDate && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Effective Date</span>
                  </div>
                  <p className="text-sm">
                    {format(new Date(document.effectiveDate), "PPP")}
                  </p>
                </div>
              )}
              {document.expiryDate && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Expiry Date</span>
                  </div>
                  <p className="text-sm">
                    {format(new Date(document.expiryDate), "PPP")}
                  </p>
                </div>
              )}
              {document.tags && document.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {document.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Comments feature coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}