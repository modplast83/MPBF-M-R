import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  BarChart3,
  Activity,
  Wrench,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductionAnalysis {
  bottlenecks: Array<{
    location: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    suggestion: string;
  }>;
  efficiency: {
    overall: number;
    bySection: Record<string, number>;
  };
  predictions: {
    nextBottleneck: string;
    recommendedAction: string;
    timeframe: string;
  };
}

interface ProductionInsightsWidgetProps {
  className?: string;
  timeframe?: string;
}

export function ProductionInsightsWidget({ 
  className, 
  timeframe = '7d' 
}: ProductionInsightsWidgetProps) {
  const { t } = useTranslation();
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);

  const { data: analysis, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/ai/production-insights', selectedTimeframe],
    queryFn: async (): Promise<ProductionAnalysis> => {
      const response = await fetch(`/api/ai/production-insights?timeframe=${selectedTimeframe}`);
      if (!response.ok) throw new Error('Failed to fetch production insights');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 85) return 'text-green-600';
    if (efficiency >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyIcon = (efficiency: number) => {
    if (efficiency >= 85) return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (efficiency >= 70) return <Activity className="h-5 w-5 text-yellow-600" />;
    return <TrendingDown className="h-5 w-5 text-red-600" />;
  };

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-2 w-32" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-28" />
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="pt-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t("ai_assistant.insights.failed_to_load")}
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("ai_assistant.common.retry")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {t("ai_assistant.insights.production_insights")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="7d">{t("ai_assistant.insights.last_7_days")}</option>
              <option value="30d">{t("ai_assistant.insights.last_30_days")}</option>
            </select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Efficiency */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{t("ai_assistant.insights.overall_efficiency")}</h3>
            <div className="flex items-center gap-2">
              {getEfficiencyIcon(analysis?.efficiency?.overall || 0)}
              <span className={cn("text-lg font-bold", getEfficiencyColor(analysis?.efficiency?.overall || 0))}>
                {analysis?.efficiency?.overall || 0}%
              </span>
            </div>
          </div>
          
          <Progress 
            value={analysis?.efficiency?.overall || 0} 
            className="h-3"
          />
          
          {/* Section Efficiency */}
          {analysis?.efficiency?.bySection && Object.keys(analysis.efficiency.bySection).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">{t("ai_assistant.insights.efficiency_by_section")}</h4>
              {Object.entries(analysis.efficiency.bySection).map(([section, efficiency]) => (
                <div key={section} className="flex items-center justify-between text-sm">
                  <span className="flex-1">{section}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={efficiency as number} className="w-20 h-2" />
                    <span className={cn("w-12 text-right", getEfficiencyColor(efficiency as number))}>
                      {efficiency}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottlenecks */}
        {analysis?.bottlenecks && analysis.bottlenecks.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {t("ai_assistant.insights.bottlenecks_detected")}
            </h3>
            <div className="space-y-3">
              {analysis.bottlenecks.map((bottleneck, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border",
                    getSeverityColor(bottleneck.severity)
                  )}
                >
                  <div className="flex items-start gap-2">
                    {getSeverityIcon(bottleneck.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{bottleneck.location}</h4>
                        <Badge variant="outline" className="text-xs">
                          {bottleneck.severity}
                        </Badge>
                      </div>
                      <p className="text-xs mb-2">{bottleneck.description}</p>
                      <div className="flex items-start gap-1">
                        <Zap className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-medium">{bottleneck.suggestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Predictions */}
        {analysis?.predictions && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t("ai_assistant.insights.predictions")}
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      {t("ai_assistant.insights.next_bottleneck")}
                    </p>
                    <p className="text-xs text-blue-700">
                      {analysis.predictions.nextBottleneck}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {t("ai_assistant.insights.timeframe")}: {analysis.predictions.timeframe}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 mt-3">
                  <Wrench className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      {t("ai_assistant.insights.recommended_action")}
                    </p>
                    <p className="text-xs text-blue-700">
                      {analysis.predictions.recommendedAction}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No data state */}
        {(!analysis?.bottlenecks || analysis.bottlenecks.length === 0) &&
         (!analysis?.efficiency?.overall || analysis.efficiency.overall === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No production data available</p>
            <p className="text-xs">Start production to see insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}