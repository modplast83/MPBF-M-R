import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Lightbulb, 
  Sparkles, 
  FileText, 
  Calendar, 
  Tag, 
  TrendingUp,
  Brain,
  Clock,
  Target
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth-v2";
import { cn } from "@/lib/utils";

interface DocumentSuggestion {
  templateType: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  tags: string[];
  reasoning: string;
  confidence: number;
}

interface AISuggestionsProps {
  onSelectSuggestion: (suggestion: DocumentSuggestion) => void;
  className?: string;
}

export function AISuggestions({ onSelectSuggestion, className }: AISuggestionsProps) {
  const { user } = useAuth();
  
  const { data: suggestions, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/documents/ai/suggestions'],
    queryFn: async () => {
      const response = await fetch('/api/documents/ai/suggestions?limit=5');
      if (!response.ok) {
        throw new Error('Failed to fetch AI suggestions');
      }
      return response.json();
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    high: "bg-orange-100 text-orange-800 border-orange-200",
    urgent: "bg-red-100 text-red-800 border-red-200"
  };

  const confidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'instruction': return <FileText className="h-4 w-4" />;
      case 'announcement': return <TrendingUp className="h-4 w-4" />;
      case 'agreement': return <Target className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-48" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Failed to load AI suggestions. Please try again.
              <Button 
                variant="link" 
                className="p-0 h-auto ml-2"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              No personalized suggestions available yet.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Create a few documents to get AI-powered suggestions based on your patterns.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Suggestions
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI-Powered Suggestions
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Personalized
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion: DocumentSuggestion, index: number) => (
          <Card key={index} className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getDocumentTypeIcon(suggestion.templateType)}
                  <h3 className="font-semibold text-base">{suggestion.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", priorityColors[suggestion.priority])}
                  >
                    {suggestion.priority}
                  </Badge>
                  <span className={cn("text-xs font-medium", confidenceColor(suggestion.confidence))}>
                    {Math.round(suggestion.confidence * 100)}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {suggestion.content.substring(0, 120)}...
              </p>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground capitalize">
                    {suggestion.templateType.replace('_', ' ')}
                  </span>
                </div>
                {suggestion.category && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {suggestion.category}
                    </span>
                  </div>
                )}
              </div>

              {suggestion.tags && suggestion.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {suggestion.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {suggestion.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{suggestion.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="bg-purple-50 p-3 rounded-md mb-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-purple-800 mb-1">
                      Why this suggestion?
                    </p>
                    <p className="text-xs text-purple-700 line-clamp-2">
                      {suggestion.reasoning}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Based on your recent activity</span>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => onSelectSuggestion(suggestion)}
                  className="h-8"
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <div className="text-center pt-4">
          <Button variant="outline" onClick={() => refetch()}>
            <Sparkles className="h-4 w-4 mr-2" />
            Refresh Suggestions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}