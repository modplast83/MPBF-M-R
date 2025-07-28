import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  TrendingUp,
  TrendingDown, 
  Target,
  Activity,
  BarChart3,
  PieChart,
} from "lucide-react";

interface AnalyticsData {
  efficiency: number;
  outputRate: number;
  qualityScore: number;
  targetEfficiency: number;
  targetOutput: number;
  targetQuality: number;
}

export function DashboardAnalyticsWidget() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/dashboard-stats"],
    queryFn: () => apiRequest("GET", "/api/dashboard-stats"),
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-2 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      label: "Production Efficiency",
      value: analytics?.efficiency || 0,
      target: 90,
      icon: Target,
      color: analytics?.efficiency >= 90 ? "text-green-600" : analytics?.efficiency >= 75 ? "text-yellow-600" : "text-red-600",
      bgColor: analytics?.efficiency >= 90 ? "bg-green-50 dark:bg-green-950/20" : analytics?.efficiency >= 75 ? "bg-yellow-50 dark:bg-yellow-950/20" : "bg-red-50 dark:bg-red-950/20",
    },
    {
      label: "Output Rate",
      value: analytics?.outputRate || 0,
      target: 95,
      icon: Activity,
      color: analytics?.outputRate >= 95 ? "text-green-600" : analytics?.outputRate >= 80 ? "text-yellow-600" : "text-red-600",
      bgColor: analytics?.outputRate >= 95 ? "bg-green-50 dark:bg-green-950/20" : analytics?.outputRate >= 80 ? "bg-yellow-50 dark:bg-yellow-950/20" : "bg-red-50 dark:bg-red-950/20",
    },
    {
      label: "Quality Score",
      value: analytics?.qualityScore || 0,
      target: 98,
      icon: PieChart,
      color: analytics?.qualityScore >= 98 ? "text-green-600" : analytics?.qualityScore >= 90 ? "text-yellow-600" : "text-red-600",
      bgColor: analytics?.qualityScore >= 98 ? "bg-green-50 dark:bg-green-950/20" : analytics?.qualityScore >= 90 ? "bg-yellow-50 dark:bg-yellow-950/20" : "bg-red-50 dark:bg-red-950/20",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const isAboveTarget = metric.value >= metric.target;
            
            return (
              <div key={index} className={`p-4 rounded-lg ${metric.bgColor}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                    <span className="font-medium text-sm">{metric.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${metric.color}`}>
                      {metric.value}%
                    </span>
                    {isAboveTarget ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
                
                <Progress 
                  value={metric.value} 
                  className="h-2 mb-2"
                />
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Target: {metric.target}%</span>
                  <Badge 
                    variant={isAboveTarget ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {isAboveTarget ? "On Track" : "Below Target"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}