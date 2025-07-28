import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wand2, 
  Copy,
  Check,
  FileText,
  Tag,
  RefreshCw,
  Lightbulb
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ContentSuggestion {
  title: string;
  content: string;
  tags: string[];
}

interface ContentSuggestionsProps {
  documentType: string;
  onSelectContent: (content: string) => void;
  onSelectTitle: (title: string) => void;
  onSelectTags: (tags: string[]) => void;
  className?: string;
}

export function ContentSuggestions({ 
  documentType, 
  onSelectContent, 
  onSelectTitle, 
  onSelectTags, 
  className 
}: ContentSuggestionsProps) {
  const [userContext, setUserContext] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const generateSuggestionsMutation = useMutation({
    mutationFn: async (context: string) => {
      const response = await fetch('/api/documents/ai/content-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          documentType, 
          userContext: context 
        })
      });
      if (!response.ok) {
        throw new Error('Failed to generate content suggestions');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Content suggestions generated",
        description: "AI has created personalized content suggestions for you.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error generating suggestions",
        description: error instanceof Error ? error.message : "Failed to generate suggestions",
        variant: "destructive",
      });
    }
  });

  const handleCopyContent = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: "Content copied",
        description: "Content has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateSuggestions = () => {
    generateSuggestionsMutation.mutate(userContext);
  };

  const suggestions = generateSuggestionsMutation.data || [];

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-blue-600" />
          AI Content Suggestions
          <Badge variant="outline" className="ml-auto">
            {documentType.replace('_', ' ')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Context Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Context (Optional)
          </label>
          <Textarea
            placeholder="Provide additional context about what you want to write about..."
            value={userContext}
            onChange={(e) => setUserContext(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button 
            onClick={handleGenerateSuggestions}
            disabled={generateSuggestionsMutation.isPending}
            className="w-full"
          >
            {generateSuggestionsMutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Suggestions
              </>
            )}
          </Button>
        </div>

        {/* Loading State */}
        {generateSuggestionsMutation.isPending && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-8 w-32" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {generateSuggestionsMutation.error && (
          <Alert>
            <AlertDescription>
              {generateSuggestionsMutation.error instanceof Error 
                ? generateSuggestionsMutation.error.message 
                : 'Failed to generate content suggestions'}
            </AlertDescription>
          </Alert>
        )}

        {/* Suggestions Display */}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lightbulb className="h-4 w-4" />
              <span>AI generated {suggestions.length} suggestions based on your patterns</span>
            </div>
            
            {suggestions.map((suggestion: ContentSuggestion, index: number) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <h3 className="font-semibold text-base">{suggestion.title}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectTitle(suggestion.title)}
                    >
                      Use Title
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-gray-50 p-3 rounded-md mb-3">
                    <pre className="text-sm whitespace-pre-wrap font-sans text-gray-700">
                      {suggestion.content}
                    </pre>
                  </div>

                  {suggestion.tags && suggestion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="text-xs text-muted-foreground mr-2">Tags:</span>
                      {suggestion.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectContent(suggestion.content)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Use Content
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyContent(suggestion.content, index)}
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      {copiedIndex === index ? 'Copied' : 'Copy'}
                    </Button>
                    {suggestion.tags && suggestion.tags.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectTags(suggestion.tags)}
                      >
                        <Tag className="h-4 w-4 mr-1" />
                        Use Tags
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!generateSuggestionsMutation.isPending && 
         !generateSuggestionsMutation.error && 
         suggestions.length === 0 && (
          <div className="text-center py-8">
            <Wand2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              No content suggestions yet
            </p>
            <p className="text-sm text-muted-foreground">
              Click "Generate Suggestions" to get AI-powered content ideas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}