import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, User, Calendar } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface Roll {
  id: string;
  serialNumber: string;
  currentStage: string;
  status: string;
  createdAt: string;
  printedAt?: string;
  cutAt?: string;
  createdById?: string;
  printedById?: string;
  cutById?: string;
  extrudingQty?: number;
  printingQty?: number;
  cuttingQty?: number;
}

interface User {
  id: string;
  firstName?: string;
  username: string;
}

interface RollTimelineProps {
  roll: Roll;
  users: User[];
}

interface TimelineStage {
  stage: string;
  label: string;
  timestamp?: string;
  userId?: string;
  quantity?: number;
  isCompleted: boolean;
  isCurrent: boolean;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function RollTimeline({ roll, users }: RollTimelineProps) {
  const { t } = useTranslation();

  // Helper function to get user name
  const getUserName = (userId?: string): string => {
    if (!userId) return 'Unknown';
    const user = users.find(u => u.id === userId);
    return user?.firstName || user?.username || userId;
  };

  // Helper function to format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Pending';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Define timeline stages
  const stages: TimelineStage[] = [
    {
      stage: 'extrusion',
      label: 'Extrusion',
      timestamp: roll.createdAt,
      userId: roll.createdById,
      quantity: roll.extrudingQty,
      isCompleted: true, // Always completed since roll exists
      isCurrent: roll.currentStage === 'extrusion',
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: CheckCircle
    },
    {
      stage: 'printing',
      label: 'Printing',
      timestamp: roll.printedAt,
      userId: roll.printedById,
      quantity: roll.printingQty,
      isCompleted: !!roll.printedAt,
      isCurrent: roll.currentStage === 'printing',
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: roll.printedAt ? CheckCircle : (roll.currentStage === 'printing' ? Clock : AlertCircle)
    },
    {
      stage: 'cutting',
      label: 'Cutting',
      timestamp: roll.cutAt,
      userId: roll.cutById,
      quantity: roll.cuttingQty,
      isCompleted: !!roll.cutAt,
      isCurrent: roll.currentStage === 'cutting',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: roll.cutAt ? CheckCircle : (roll.currentStage === 'cutting' ? Clock : AlertCircle)
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Roll Lifecycle Timeline - {roll.serialNumber}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const StageIcon = stage.icon;
            const isLast = index === stages.length - 1;
            
            return (
              <div key={stage.stage} className="relative">
                {/* Timeline line */}
                {!isLast && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-300 z-0"></div>
                )}
                
                {/* Stage content */}
                <div className="flex items-start gap-4">
                  {/* Stage icon */}
                  <div className={`
                    relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2
                    ${stage.isCompleted 
                      ? 'bg-green-100 border-green-300 text-green-600' 
                      : stage.isCurrent 
                      ? 'bg-blue-100 border-blue-300 text-blue-600' 
                      : 'bg-gray-100 border-gray-300 text-gray-400'}
                  `}>
                    <StageIcon className="h-6 w-6" />
                  </div>
                  
                  {/* Stage details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${stage.color} text-xs border`}>
                        {stage.label}
                      </Badge>
                      {stage.isCurrent && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                          Current Stage
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      {/* Timestamp */}
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className={stage.isCompleted ? 'text-gray-900' : 'text-gray-500'}>
                          {formatDate(stage.timestamp)}
                        </span>
                      </div>
                      
                      {/* Operator */}
                      {stage.userId && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">
                            {getUserName(stage.userId)}
                          </span>
                        </div>
                      )}
                      
                      {/* Quantity */}
                      {stage.quantity && stage.quantity > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Quantity:</span>
                          <span className="text-gray-700 font-medium">
                            {stage.quantity} kg
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Timeline Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-600">Total Duration:</span>
              <span className="ml-2 font-medium">
                {roll.cutAt 
                  ? `${Math.ceil((new Date(roll.cutAt).getTime() - new Date(roll.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days`
                  : 'In Progress'
                }
              </span>
            </div>
            <div>
              <span className="text-gray-600">Current Status:</span>
              <span className="ml-2 font-medium capitalize">
                {roll.status}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Stages Completed:</span>
              <span className="ml-2 font-medium">
                {stages.filter(s => s.isCompleted).length} / {stages.length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Total Waste:</span>
              <span className="ml-2 font-medium">
                {roll.wasteQty ? `${roll.wasteQty}kg (${roll.wastePercentage}%)` : 'No waste recorded'}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round((stages.filter(s => s.isCompleted).length / stages.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stages.filter(s => s.isCompleted).length / stages.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}