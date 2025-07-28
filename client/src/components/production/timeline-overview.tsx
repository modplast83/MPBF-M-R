import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Progress component implementation
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div 
      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Clock, AlertTriangle } from "lucide-react";

interface Roll {
  id: string;
  currentStage: string;
  status: string;
  createdAt: string;
  printedAt?: string;
  cutAt?: string;
  wasteQty?: number;
}

interface TimelineOverviewProps {
  rolls: Roll[];
}

export function TimelineOverview({ rolls }: TimelineOverviewProps) {
  // Calculate stage statistics
  const stageStats = {
    extrusion: rolls.filter(r => r.currentStage === 'extrusion').length,
    printing: rolls.filter(r => r.currentStage === 'printing').length,
    cutting: rolls.filter(r => r.currentStage === 'cutting').length,
    completed: rolls.filter(r => r.status === 'completed').length,
  };

  // Calculate average processing time
  const completedRolls = rolls.filter(r => r.cutAt);
  const avgProcessingTime = completedRolls.length > 0 
    ? Math.round(completedRolls.reduce((sum, roll) => {
        const startTime = new Date(roll.createdAt).getTime();
        const endTime = new Date(roll.cutAt!).getTime();
        return sum + (endTime - startTime) / (1000 * 60 * 60 * 24);
      }, 0) / completedRolls.length)
    : 0;

  // Calculate bottleneck analysis
  const bottlenecks = {
    extrusion: rolls.filter(r => r.currentStage === 'extrusion' && 
      new Date().getTime() - new Date(r.createdAt).getTime() > 24 * 60 * 60 * 1000).length,
    printing: rolls.filter(r => r.currentStage === 'printing' && r.printedAt &&
      new Date().getTime() - new Date(r.printedAt).getTime() > 24 * 60 * 60 * 1000).length,
    cutting: rolls.filter(r => r.currentStage === 'cutting' && 
      new Date().getTime() - new Date(r.createdAt).getTime() > 48 * 60 * 60 * 1000).length,
  };

  const totalBottlenecks = Object.values(bottlenecks).reduce((sum, count) => sum + count, 0);

  // Calculate completion rate
  const completionRate = rolls.length > 0 ? (stageStats.completed / rolls.length) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Stage Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Stage Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Extrusion</span>
            <Badge className="bg-green-100 text-green-800 text-xs">
              {stageStats.extrusion}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Printing</span>
            <Badge className="bg-red-100 text-red-800 text-xs">
              {stageStats.printing}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Cutting</span>
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
              {stageStats.cutting}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Completed</span>
            <Badge className="bg-gray-100 text-gray-800 text-xs">
              {stageStats.completed}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Completion Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {completionRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">
              {stageStats.completed} of {rolls.length} rolls
            </div>
          </div>
          <Progress value={completionRate} className="h-2" />
        </CardContent>
      </Card>

      {/* Average Processing Time */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Avg. Processing Time
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {avgProcessingTime}
          </div>
          <div className="text-xs text-gray-600">
            days to complete
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Based on {completedRolls.length} completed rolls
          </div>
        </CardContent>
      </Card>

      {/* Bottleneck Alert */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Bottleneck Alert
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-center">
            <div className={`text-2xl font-bold ${totalBottlenecks > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {totalBottlenecks}
            </div>
            <div className="text-xs text-gray-600">
              rolls delayed
            </div>
          </div>
          {totalBottlenecks > 0 && (
            <div className="space-y-1">
              {bottlenecks.extrusion > 0 && (
                <div className="flex justify-between text-xs">
                  <span>Extrusion</span>
                  <span className="text-red-600">{bottlenecks.extrusion}</span>
                </div>
              )}
              {bottlenecks.printing > 0 && (
                <div className="flex justify-between text-xs">
                  <span>Printing</span>
                  <span className="text-red-600">{bottlenecks.printing}</span>
                </div>
              )}
              {bottlenecks.cutting > 0 && (
                <div className="flex justify-between text-xs">
                  <span>Cutting</span>
                  <span className="text-red-600">{bottlenecks.cutting}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}