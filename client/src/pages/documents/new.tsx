import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/documents/rich-text-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { API_ENDPOINTS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth-v2";
import { 
  ArrowLeft, 
  Save, 
  FileText,
  Calendar,
  AlertCircle,
  Tag,
  X,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import { ContentSuggestions } from "@/components/documents/content-suggestions";

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
  status: z.string().default("draft"),
  effectiveDate: z.string().optional(),
  expiryDate: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof formSchema>;

export default function DocumentNew() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Get document type from URL params if specified
  const urlParams = new URLSearchParams(window.location.search);
  const defaultType = urlParams.get('type') || '';
  const defaultTitle = urlParams.get('title') || '';
  const defaultContent = urlParams.get('content') || '';

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: defaultType,
      title: defaultTitle,
      content: defaultContent,
      priority: "medium",
      status: "draft",
      effectiveDate: "",
      expiryDate: "",
      category: "",
      tags: [],
    },
  });

  // Fetch templates for the selected document type
  const { data: templates } = useQuery({
    queryKey: [`${API_ENDPOINTS.DOCUMENT_TEMPLATES}`, form.watch("documentType")],
    queryFn: async () => {
      const documentType = form.getValues("documentType");
      if (!documentType) return [];
      
      const response = await fetch(`${API_ENDPOINTS.DOCUMENT_TEMPLATES}?documentType=${documentType}`);
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      return response.json();
    },
    enabled: !!form.watch("documentType"),
  });

  // Create document mutation
  const createDocumentMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(API_ENDPOINTS.DOCUMENTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          tags: tags,
          effectiveDate: data.effectiveDate || null,
          expiryDate: data.expiryDate || null,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create document");
      }
      
      return response.json();
    },
    onSuccess: (document) => {
      toast({
        title: "Document created",
        description: "The document has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.DOCUMENTS] });
      navigate(`/documents/${document.id}/view`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createDocumentMutation.mutate(data);
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

  const handleUseTemplate = (template: any) => {
    form.setValue("title", template.templateName);
    form.setValue("content", template.templateContent);
  };

  const handleSelectContent = (content: string) => {
    form.setValue("content", content);
  };

  const handleSelectTitle = (title: string) => {
    form.setValue("title", title);
  };

  const handleSelectTags = (aiTags: string[]) => {
    setTags(prev => [...prev, ...aiTags.filter(tag => !prev.includes(tag))]);
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
            <h1 className="text-3xl font-bold">New Document</h1>
            <p className="text-muted-foreground">
              Create a new document for your organization
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
                        <FormLabel>محتوى المستند | Document Content</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="ابدأ كتابة محتوى المستند هنا... يدعم العربية والإنجليزية مع التنسيق التلقائي"
                            minHeight="400px"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Templates */}
              {templates && templates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {templates.map((template: any) => (
                        <div key={template.id} className="border rounded-lg p-4">
                          <h4 className="font-semibold">{template.templateName}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {template.description}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleUseTemplate(template)}
                          >
                            Use Template
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
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

              {/* AI Content Suggestions */}
              {form.watch("documentType") && (
                <ContentSuggestions
                  documentType={form.watch("documentType")}
                  onSelectContent={handleSelectContent}
                  onSelectTitle={handleSelectTitle}
                  onSelectTags={handleSelectTags}
                />
              )}

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-2">
                    <Button 
                      type="submit" 
                      disabled={createDocumentMutation.isPending}
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {createDocumentMutation.isPending ? "Creating..." : "Create Document"}
                    </Button>
                    <Button type="button" variant="outline" asChild className="w-full">
                      <Link href="/documents">
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