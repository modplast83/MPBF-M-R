import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AIAssistantWidget } from "./ai-assistant-widget";
import { ProductionInsightsWidget } from "./production-insights-widget";
import { WorkflowSuggestionCarousel } from "./workflow-suggestion-carousel";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Bot,
  BarChart3,
  Wrench,
  CheckCircle,
  TrendingUp,
  Lightbulb,
  Zap,
  RefreshCw,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAssistantDashboardProps {
  className?: string;
}

export function AIAssistantDashboard({ className }: AIAssistantDashboardProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("chat");
  const [assistantMinimized, setAssistantMinimized] = useState(false);

  // Fetch AI-powered suggestions for different modules
  const { data: qualityRecommendations, refetch: refetchQuality } = useQuery({
    queryKey: ['/api/ai/quality-recommendations'],
    queryFn: async () => {
      const response = await fetch('/api/ai/quality-recommendations');
      if (!response.ok) throw new Error('Failed to fetch quality recommendations');
      return response.json();
    },
    enabled: activeTab === "insights",
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: scheduleOptimizations, refetch: refetchSchedule } = useQuery({
    queryKey: ['/api/ai/optimize-schedule'],
    queryFn: async () => {
      const response = await fetch('/api/ai/optimize-schedule');
      if (!response.ok) throw new Error('Failed to fetch schedule optimizations');
      return response.json();
    },
    enabled: activeTab === "insights",
    staleTime: 10 * 60 * 1000,
  });

  const { data: maintenancePredictions, refetch: refetchMaintenance } = useQuery({
    queryKey: ['/api/ai/predictive-maintenance'],
    queryFn: async () => {
      const response = await fetch('/api/ai/predictive-maintenance');
      if (!response.ok) throw new Error('Failed to fetch maintenance predictions');
      return response.json();
    },
    enabled: activeTab === "insights",
    staleTime: 15 * 60 * 1000,
  });

  const handleRefreshAll = () => {
    refetchQuality();
    refetchSchedule();
    refetchMaintenance();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <TrendingUp className="h-4 w-4" />;
      case 'action': return <Zap className="h-4 w-4" />;
      case 'insight': return <Lightbulb className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className={cn("w-full space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t("ai_assistant.title")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("ai_assistant.subtitle")}
          </p>
        </div>
        <Button onClick={handleRefreshAll} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("ai_assistant.common.refresh_all")}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            {t("ai_assistant.tabs.chat")}
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t("ai_assistant.tabs.insights")}
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            {t("ai_assistant.tabs.automation")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <AIAssistantWidget 
                minimized={assistantMinimized}
                onToggleMinimize={() => setAssistantMinimized(!assistantMinimized)}
                className="mx-auto max-w-4xl h-[600px]"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductionInsightsWidget />
            
            {/* Quality Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Quality Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {qualityRecommendations?.recommendations ? (
                  <div className="space-y-3">
                    {qualityRecommendations.recommendations.map((rec: any, index: number) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg border",
                          getPriorityColor(rec.priority || 'low')
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {getSuggestionIcon(rec.type)}
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{rec.title}</h4>
                            <p className="text-xs mt-1">{rec.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {rec.priority || 'low'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No quality recommendations available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Schedule Optimizations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Schedule Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scheduleOptimizations?.optimizations ? (
                  <div className="space-y-3">
                    {scheduleOptimizations.optimizations.map((opt: any, index: number) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg border",
                          getPriorityColor(opt.priority || 'medium')
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {getSuggestionIcon(opt.type)}
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{opt.title}</h4>
                            <p className="text-xs mt-1">{opt.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {opt.priority || 'medium'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No optimization suggestions available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Predictive Maintenance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  Predictive Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {maintenancePredictions?.suggestions ? (
                  <div className="space-y-3">
                    {maintenancePredictions.suggestions.map((pred: any, index: number) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg border",
                          getPriorityColor(pred.priority || 'medium')
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {getSuggestionIcon(pred.type)}
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{pred.title}</h4>
                            <p className="text-xs mt-1">{pred.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {pred.priority || 'medium'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No maintenance predictions available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          {/* Interactive Workflow Suggestion Carousel */}
          <WorkflowSuggestionCarousel 
            className="mb-8"
            maxVisibleItems={3}
            autoRotate={true}
            rotationInterval={10000}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Auto-Quality Checks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Automatically schedule quality checks based on production patterns
                </p>
                <Button className="w-full">Enable Auto-Checks</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  AI-powered production scheduling optimization
                </p>
                <Button className="w-full">Activate Smart Scheduling</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Predictive Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Get notified before issues occur with predictive analytics
                </p>
                <Button className="w-full">Configure Alerts</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}