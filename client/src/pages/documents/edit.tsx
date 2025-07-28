import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { API_ENDPOINTS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Save, 
  AlertCircle,
  Tag,
  X
} from "lucide-react";
import { Link } from "wouter";

const documentTypes = [
  { value: "instruction", label: "Instruction" },
  { value: "obligation", label: "Obligation" },
  { value: "announcement", label: "Announcement" },
  { value: "general_letter", label: "General Letter" },
  { value: "agreement", label: "Agreement" },
  { value: "contract", label: "Contract" },
  { value: "request", label: "Request" },
  { value: "disclaimer", label: "Disclaimer" },
];

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const formSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  priority: z.string().min(1, "Priority is required"),
  status: z.string().min(1, "Status is required"),
  effectiveDate: z.string().optional(),
  expiryDate: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof formSchema>;

export default function DocumentEdit() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "",
      title: "",
      content: "",
      priority: "medium",
      status: "draft",
      effectiveDate: "",
      expiryDate: "",
      category: "",
      tags: [],
    },
  });

  // Fetch document data
  const {
    data: document,
    isLoading,
    error,
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

  // Populate form when document data is loaded
  useEffect(() => {
    if (document) {
      form.setValue("documentType", document.documentType);
      form.setValue("title", document.title);
      form.setValue("content", document.content);
      form.setValue("priority", document.priority);
      form.setValue("status", document.status);
      form.setValue("category", document.category || "");
      form.setValue("effectiveDate", document.effectiveDate ? new Date(document.effectiveDate).toISOString().split('T')[0] : "");
      form.setValue("expiryDate", document.expiryDate ? new Date(document.expiryDate).toISOString().split('T')[0] : "");
      
      if (document.tags) {
        setTags(document.tags);
      }
    }
  }, [document, form]);

  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(`${API_ENDPOINTS.DOCUMENTS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          tags: tags,
          effectiveDate: data.effectiveDate ? new Date(data.effectiveDate).toISOString() : null,
          expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : null,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update document");
      }
      
      return response.json();
    },
    onSuccess: (updatedDocument) => {
      toast({
        title: "Document updated",
        description: "The document has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.DOCUMENTS] });
      queryClient.invalidateQueries({ queryKey: [`${API_ENDPOINTS.DOCUMENTS}/${id}`] });
      navigate(`/documents/${updatedDocument.id}/view`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    updateDocumentMutation.mutate(data);
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
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
                Unable to load the document for editing. Please try again.
              </p>
              <Button asChild>
                <Link href="/documents">
                  Back to Documents
                </Link>
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

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href={`/documents/${id}/view`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Document</h1>
            <p className="text-muted-foreground font-mono">
              {document?.documentNumber}
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="documentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Document Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select document type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {documentTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {priorities.map((priority) => (
                                <SelectItem key={priority.value} value={priority.value}>
                                  {priority.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter document title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter document content"
                            rows={12}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="effectiveDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Effective Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-2">
                    <Button 
                      type="submit" 
                      disabled={updateDocumentMutation.isPending}
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateDocumentMutation.isPending ? "Updating..." : "Update Document"}
                    </Button>
                    <Button type="button" variant="outline" asChild className="w-full">
                      <Link href={`/documents/${id}/view`}>
                        Cancel
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}