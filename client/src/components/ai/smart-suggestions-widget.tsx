import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Lightbulb,
  TrendingUp,
  Zap,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Brain,
  Target,
  Wrench,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartSuggestion {
  type: 'navigation' | 'action' | 'insight' | 'optimization';
  title: string;
  description: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  module?: string;
}

interface SmartSuggestionsWidgetProps {
  className?: string;
  module?: string;
  contextData?: any;
}

export function SmartSuggestionsWidget({ 
  className, 
  module,
  contextData 
}: SmartSuggestionsWidgetProps) {
  const [location] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suggestions, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/ai/module-suggestions', module || location, contextData],
    queryFn: async () => {
      const response = await fetch('/api/ai/module-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: module || getCurrentModuleFromPath(location),
          data: contextData || {},
          currentPath: location
        })
      });
      
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      return response.json();
    },
    enabled: !!module || !!location,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });

  // Action mutation for executing suggestions
  const actionMutation = useMutation({
    mutationFn: async (suggestion: SmartSuggestion) => {
      if (suggestion.actionUrl) {
        window.location.href = suggestion.actionUrl;
        return;
      }
      
      // Handle specific action types
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Execute suggestion: ${suggestion.title}`,
          context: {
            module: module || getCurrentModuleFromPath(location),
            currentPath: location,
            suggestionData: suggestion
          }
        })
      });
      
      if (!response.ok) throw new Error('Failed to execute suggestion');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Suggestion Executed",
        description: "The AI suggestion has been processed successfully."
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/ai/'] });
    },
    onError: (error) => {
      toast({
        title: "Execution Failed",
        description: "Failed to execute the suggestion. Please try again.",
        variant: "destructive"
      });
    }
  });

  function getCurrentModuleFromPath(path: string): string {
    if (path.startsWith('/production')) return 'production';
    if (path.startsWith('/quality')) return 'quality';
    if (path.startsWith('/maintenance')) return 'maintenance';
    if (path.startsWith('/orders')) return 'orders';
    if (path.startsWith('/warehouse')) return 'warehouse';
    if (path.startsWith('/hr')) return 'hr';
    if (path.startsWith('/documents')) return 'documents';
    return 'dashboard';
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'navigation': return <ArrowRight className="h-4 w-4" />;
      case 'action': return <Zap className="h-4 w-4" />;
      case 'insight': return <Lightbulb className="h-4 w-4" />;
      case 'optimization': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800 hover:bg-red-100';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800 hover:bg-yellow-100';
      case 'low': return 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100';
      default: return 'border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Target className="h-3 w-3 text-red-600" />;
      case 'medium': return <Wrench className="h-3 w-3 text-yellow-600" />;
      case 'low': return <Sparkles className="h-3 w-3 text-blue-600" />;
      default: return <CheckCircle className="h-3 w-3 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || !suggestions?.suggestions) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="pt-6">
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              No smart suggestions available at the moment.
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            Smart Suggestions
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {suggestions.suggestions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No suggestions available</p>
            <p className="text-xs">Start working to get AI-powered insights</p>
          </div>
        ) : (
          suggestions.suggestions.map((suggestion: SmartSuggestion, index: number) => (
            <button
              key={index}
              onClick={() => actionMutation.mutate(suggestion)}
              disabled={actionMutation.isPending}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all duration-200",
                getPriorityColor(suggestion.priority),
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                actionMutation.isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getSuggestionIcon(suggestion.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-sm leading-tight">
                      {suggestion.title}
                    </h4>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {getPriorityIcon(suggestion.priority)}
                      <Badge variant="outline" className="text-xs">
                        {suggestion.priority}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs opacity-85 leading-relaxed">
                    {suggestion.description}
                  </p>
                  {suggestion.module && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.module}
                      </Badge>
                    </div>
                  )}
                </div>
                {suggestion.actionUrl && (
                  <ArrowRight className="h-4 w-4 flex-shrink-0 mt-0.5 opacity-60" />
                )}
              </div>
            </button>
          ))
        )}
      </CardContent>
    </Card>
  );
}