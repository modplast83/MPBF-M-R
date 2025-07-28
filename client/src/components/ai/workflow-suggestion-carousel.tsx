import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth-v2";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  TrendingUp,
  Zap,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Settings,
  Users,
  Package,
  Calendar,
  Shield,
  Wrench,
  Target,
  Brain,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'production' | 'quality' | 'maintenance' | 'efficiency' | 'planning' | 'safety';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  steps: string[];
  actionUrl?: string;
  benefits: string[];
  requiredPermissions?: string[];
  contextRelevance: number; // 0-100 score based on current context
  completionRate?: number; // If workflow is partially completed
  isRecommended?: boolean;
}

interface WorkflowSuggestionCarouselProps {
  className?: string;
  maxVisibleItems?: number;
  autoRotate?: boolean;
  rotationInterval?: number;
}

export function WorkflowSuggestionCarousel({
  className,
  maxVisibleItems = 3,
  autoRotate = true,
  rotationInterval = 8000
}: WorkflowSuggestionCarouselProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [location] = useLocation();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<WorkflowSuggestion | null>(null);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch contextual workflow suggestions
  const { data: suggestions = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/ai/workflow-suggestions', location, user?.id],
    queryFn: async (): Promise<WorkflowSuggestion[]> => {
      const response = await fetch('/api/ai/workflow-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: {
            currentPage: location,
            userId: user?.id,
            userRole: user?.isAdmin ? 'admin' : 'user',
            timestamp: new Date().toISOString()
          }
        })
      });
      
      if (!response.ok) {
        // Fallback to static suggestions if API fails
        return generateFallbackSuggestions();
      }
      
      const data = await response.json();
      return data.suggestions || generateFallbackSuggestions();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });

  // Generate fallback suggestions based on current context
  const generateFallbackSuggestions = (): WorkflowSuggestion[] => {
    const currentPageSuggestions: WorkflowSuggestion[] = [];
    
    // Page-specific suggestions
    if (location.includes('/orders')) {
      currentPageSuggestions.push({
        id: 'optimize-order-flow',
        title: t('ai_assistant.workflows.optimize_order_flow.title'),
        description: t('ai_assistant.workflows.optimize_order_flow.description'),
        category: 'efficiency',
        priority: 'medium',
        estimatedTime: '15 mins',
        difficulty: 'medium',
        steps: [
          t('ai_assistant.workflows.optimize_order_flow.step1'),
          t('ai_assistant.workflows.optimize_order_flow.step2'),
          t('ai_assistant.workflows.optimize_order_flow.step3')
        ],
        benefits: [t('ai_assistant.workflows.optimize_order_flow.benefit1')],
        contextRelevance: 95,
        isRecommended: true
      });
    }

    if (location.includes('/quality')) {
      currentPageSuggestions.push({
        id: 'quality-improvement',
        title: t('ai_assistant.workflows.quality_improvement.title'),
        description: t('ai_assistant.workflows.quality_improvement.description'),
        category: 'quality',
        priority: 'high',
        estimatedTime: '25 mins',
        difficulty: 'medium',
        steps: [
          t('ai_assistant.workflows.quality_improvement.step1'),
          t('ai_assistant.workflows.quality_improvement.step2')
        ],
        benefits: [t('ai_assistant.workflows.quality_improvement.benefit1')],
        contextRelevance: 90
      });
    }

    // General workflow suggestions
    const generalSuggestions: WorkflowSuggestion[] = [
      {
        id: 'daily-production-check',
        title: t('ai_assistant.workflows.daily_production_check.title'),
        description: t('ai_assistant.workflows.daily_production_check.description'),
        category: 'production',
        priority: 'medium',
        estimatedTime: '10 mins',
        difficulty: 'easy',
        steps: [
          t('ai_assistant.workflows.daily_production_check.step1'),
          t('ai_assistant.workflows.daily_production_check.step2')
        ],
        benefits: [t('ai_assistant.workflows.daily_production_check.benefit1')],
        contextRelevance: 75
      },
      {
        id: 'preventive-maintenance',
        title: t('ai_assistant.workflows.preventive_maintenance.title'),
        description: t('ai_assistant.workflows.preventive_maintenance.description'),
        category: 'maintenance',
        priority: 'high',
        estimatedTime: '30 mins',
        difficulty: 'advanced',
        steps: [
          t('ai_assistant.workflows.preventive_maintenance.step1'),
          t('ai_assistant.workflows.preventive_maintenance.step2')
        ],
        benefits: [t('ai_assistant.workflows.preventive_maintenance.benefit1')],
        contextRelevance: 80
      }
    ];

    return [...currentPageSuggestions, ...generalSuggestions]
      .sort((a, b) => b.contextRelevance - a.contextRelevance)
      .slice(0, 6);
  };

  // Auto-rotation logic
  useEffect(() => {
    if (autoRotate && !isHovered && suggestions.length > maxVisibleItems) {
      autoRotateRef.current = setInterval(() => {
        setCurrentIndex(prev => 
          prev + maxVisibleItems >= suggestions.length ? 0 : prev + 1
        );
      }, rotationInterval);
    }

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [autoRotate, isHovered, suggestions.length, maxVisibleItems, rotationInterval]);

  const nextSlide = () => {
    setCurrentIndex(prev => 
      prev + maxVisibleItems >= suggestions.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prev => 
      prev === 0 ? Math.max(0, suggestions.length - maxVisibleItems) : prev - 1
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'production': return <BarChart3 className="h-4 w-4" />;
      case 'quality': return <Shield className="h-4 w-4" />;
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      case 'efficiency': return <TrendingUp className="h-4 w-4" />;
      case 'planning': return <Calendar className="h-4 w-4" />;
      case 'safety': return <AlertTriangle className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSuggestionClick = (suggestion: WorkflowSuggestion) => {
    if (suggestion.actionUrl) {
      window.location.href = suggestion.actionUrl;
    } else {
      setSelectedSuggestion(suggestion);
    }
  };

  const visibleSuggestions = suggestions.slice(currentIndex, currentIndex + maxVisibleItems);

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              {t('ai_assistant.workflows.loading')}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">
            {t('ai_assistant.workflows.title')}
          </h3>
          <Badge variant="outline" className="ml-2">
            {suggestions.length} {t('ai_assistant.workflows.suggestions')}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
          
          {suggestions.length > maxVisibleItems && (
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={currentIndex + maxVisibleItems >= suggestions.length}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Carousel */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="flex transition-transform duration-300 ease-in-out space-x-4"
          style={{ transform: `translateX(-${currentIndex * (100 / maxVisibleItems)}%)` }}
        >
          {suggestions.map((suggestion) => (
            <Card
              key={suggestion.id}
              className={cn(
                "flex-shrink-0 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
                `w-1/${maxVisibleItems}`,
                suggestion.isRecommended && "ring-2 ring-blue-500 ring-opacity-50"
              )}
              style={{ minWidth: `${100 / maxVisibleItems - 2}%` }}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(suggestion.category)}
                    <Badge 
                      className={cn("text-xs", getPriorityColor(suggestion.priority))}
                    >
                      {t(`ai_assistant.workflows.priority.${suggestion.priority}`)}
                    </Badge>
                  </div>
                  
                  {suggestion.isRecommended && (
                    <Badge variant="secondary" className="text-xs">
                      <Target className="h-3 w-3 mr-1" />
                      {t('ai_assistant.workflows.recommended')}
                    </Badge>
                  )}
                </div>

                {/* Title & Description */}
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">
                    {suggestion.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {suggestion.description}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>{suggestion.estimatedTime}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getDifficultyColor(suggestion.difficulty))}
                  >
                    {t(`ai_assistant.workflows.difficulty.${suggestion.difficulty}`)}
                  </Badge>
                </div>

                {/* Progress Bar (if applicable) */}
                {suggestion.completionRate !== undefined && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>{t('ai_assistant.workflows.progress')}</span>
                      <span>{suggestion.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${suggestion.completionRate}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button 
                  size="sm" 
                  className="w-full h-8 text-xs"
                  variant={suggestion.isRecommended ? "default" : "outline"}
                >
                  <Play className="h-3 w-3 mr-1" />
                  {t('ai_assistant.workflows.start_workflow')}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {suggestions.length > maxVisibleItems && (
        <div className="flex justify-center mt-4 space-x-1">
          {Array.from({ 
            length: Math.ceil(suggestions.length / maxVisibleItems) 
          }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                Math.floor(currentIndex / maxVisibleItems) === index
                  ? "bg-blue-600 w-4"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              onClick={() => setCurrentIndex(index * maxVisibleItems)}
            />
          ))}
        </div>
      )}

      {/* Detailed Workflow Modal would go here */}
      {selectedSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{selectedSuggestion.title}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSuggestion(null)}
                >
                  ×
                </Button>
              </div>
              
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  <p className="text-muted-foreground">{selectedSuggestion.description}</p>
                  
                  <div>
                    <h4 className="font-medium mb-2">
                      {t('ai_assistant.workflows.steps')}
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      {selectedSuggestion.steps.map((step, index) => (
                        <li key={index} className="text-muted-foreground">{step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">
                      {t('ai_assistant.workflows.benefits')}
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {selectedSuggestion.benefits.map((benefit, index) => (
                        <li key={index} className="text-muted-foreground">{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="flex space-x-2 mt-4">
                <Button className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  {t('ai_assistant.workflows.start_workflow')}
                </Button>
                <Button variant="outline" onClick={() => setSelectedSuggestion(null)}>
                  {t('ai_assistant.workflows.close')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}