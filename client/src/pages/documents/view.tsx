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
  Clock,
  Printer
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth-v2";

export default function DocumentView() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Parse ID and validate it
  const documentId = id ? parseInt(id, 10) : null;
  
  // Early return if no id or invalid id
  if (!id || isNaN(documentId!)) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Document not found</h2>
          <p>The document ID is missing from the URL.</p>
          <Link to="/documents" className="text-blue-500 hover:underline mt-4 inline-block">
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  const {
    data: document,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [`${API_ENDPOINTS.DOCUMENTS}/${documentId}`],
    queryFn: async () => {
      const response = await fetch(`${API_ENDPOINTS.DOCUMENTS}/${documentId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }
      return response.json();
    },
    enabled: !!documentId && !isNaN(documentId),
  });

  // Record view when document is loaded
  const recordViewMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(API_ENDPOINTS.DOCUMENT_VIEWS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: documentId!,
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
      const response = await fetch(`${API_ENDPOINTS.DOCUMENTS}/${documentId}/archive`, {
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

  // Print document function
  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Document Print - ${document.title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .print-header {
              text-align: center;
              border-bottom: 2px solid #065f46;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .company-logo {
              width: 80px;
              height: 80px;
              margin: 0 auto 10px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #065f46;
              margin: 10px 0;
            }
            .company-name-ar {
              font-size: 20px;
              color: #059669;
              direction: rtl;
            }
            .document-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              padding: 15px;
              background-color: #f0f9ff;
              border-radius: 8px;
            }
            .info-item {
              margin: 5px 0;
            }
            .info-label {
              font-weight: bold;
              color: #065f46;
            }
            .document-content {
              line-height: 1.6;
              margin: 20px 0;
            }
            .status-badge {
              background-color: #059669;
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
            }
            .priority-badge {
              background-color: #dc2626;
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
            }
            .print-footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <div class="company-logo">
              <div style="width: 80px; height: 80px; background-color: #065f46; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                <span style="color: white; font-weight: bold; font-size: 16px;">MPBF</span>
              </div>
            </div>
            <div class="company-name">MODERN PLASTIC BAG FACTORY</div>
            <div class="company-name-ar">مصنع أكياس البلاستيك الحديث</div>
          </div>
          
          <div class="document-info">
            <div>
              <div class="info-item">
                <span class="info-label">Document Number:</span> ${document.documentNumber}
              </div>
              <div class="info-item">
                <span class="info-label">Document Type:</span> ${document.documentType}
              </div>
              <div class="info-item">
                <span class="info-label">Version:</span> ${document.version}
              </div>
              <div class="info-item">
                <span class="info-label">Status:</span> 
                <span class="status-badge">${document.status}</span>
              </div>
            </div>
            <div>
              <div class="info-item">
                <span class="info-label">Priority:</span> 
                <span class="priority-badge">${document.priority}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Created:</span> ${format(new Date(document.createdAt), 'PPp')}
              </div>
              ${document.effectiveDate ? `
              <div class="info-item">
                <span class="info-label">Effective Date:</span> ${format(new Date(document.effectiveDate), 'PP')}
              </div>
              ` : ''}
              ${document.expiryDate ? `
              <div class="info-item">
                <span class="info-label">Expiry Date:</span> ${format(new Date(document.expiryDate), 'PP')}
              </div>
              ` : ''}
            </div>
          </div>
          
          <h1 style="color: #065f46; border-bottom: 2px solid #065f46; padding-bottom: 10px;">
            ${document.title}
          </h1>
          
          <div class="document-content">
            ${document.content.replace(/\n/g, '<br>')}
          </div>
          
          <div class="print-footer">
            <p>Generated on ${format(new Date(), 'PPp')} | Modern Plastic Bag Factory</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

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

  // Check if document exists before rendering
  if (!document) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2">Document not found</h3>
              <p className="text-muted-foreground mb-4">
                The document you are looking for does not exist.
              </p>
              <Button asChild>
                <Link to="/documents">Back to Documents</Link>
              </Button>
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
            <Link to="/documents">
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
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/documents/${documentId}/edit`}>
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
                {document.createdAt ? format(new Date(document.createdAt), "PPP") : "Unknown"}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last Updated</span>
              </div>
              <p className="text-sm">
                {document.updatedAt ? format(new Date(document.updatedAt), "PPP") : "Unknown"}
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
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">
            {document.content}
          </div>
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
                    {document.effectiveDate ? format(new Date(document.effectiveDate), "PPP") : "Unknown"}
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
                    {document.expiryDate ? format(new Date(document.expiryDate), "PPP") : "Unknown"}
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