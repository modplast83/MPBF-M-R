import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth-v2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  Plus,
  Eye,
  EyeOff,
  Move,
  Trash2,
  LayoutGrid,
  Save,
  RotateCcw,
  BarChart3,
  TrendingUp,
  Package,
  AlertTriangle,
  Clock,
  Activity,
  Target,
  PieChart,
  FileText,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Import existing dashboard components
import { ActiveOrdersTable } from "./active-orders-table";
import { QualityMetricsWidget } from "./quality-metrics-widget";
import { ProductionChart } from "./production-chart";
import { RecentOrders } from "./recent-orders";
import { QuickActions } from "./quick-actions";

interface WidgetItem {
  id: string;
  type: string;
  title: string;
  visible: boolean;
  position: number;
  config?: any;
}

interface WidgetTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  component: React.ComponentType<any>;
}

const WIDGET_TEMPLATES: WidgetTemplate[] = [
  {
    id: "stats-overview",
    type: "stats-overview",
    name: "Statistics Overview",
    description: "Key performance metrics and statistics",
    icon: <BarChart3 className="h-5 w-5" />,
    category: "analytics",
    component: StatsOverviewWidget,
  },
  {
    id: "recent-orders",
    type: "recent-orders",
    name: "Recent Orders",
    description: "Latest customer orders and status",
    icon: <Package className="h-5 w-5" />,
    category: "orders",
    component: RecentOrdersWidget,
  },
  {
    id: "quality-metrics",
    type: "quality-metrics",
    name: "Quality Metrics",
    description: "Quality control statistics and trends",
    icon: <PieChart className="h-5 w-5" />,
    category: "quality",
    component: QualityMetricsWidget,
  },
  {
    id: "production-chart",
    type: "production-chart",
    name: "Production Chart",
    description: "Visual representation of production data",
    icon: <TrendingUp className="h-5 w-5" />,
    category: "production",
    component: ProductionChartWidget,
  },
  {
    id: "quick-actions",
    type: "quick-actions",
    name: "Quick Actions",
    description: "Frequently used actions and shortcuts",
    icon: <Settings className="h-5 w-5" />,
    category: "system",
    component: QuickActions,
  },
  {
    id: "notifications",
    type: "notifications",
    name: "Notifications",
    description: "System notifications and alerts",
    icon: <FileText className="h-5 w-5" />,
    category: "system",
    component: NotificationsWidget,
  },
];

// Widget Components
interface DashboardStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  qualityIssues: number;
}

function StatsOverviewWidget() {
  // Always call hooks at the top level
  const isMobile = useIsMobile();
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard-stats"],
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div>
        <h3 className={`font-semibold mb-3 ${isMobile ? "text-sm" : ""}`}>Statistics Overview</h3>
        <div className={`grid grid-cols-2 ${isMobile ? "gap-2" : "gap-3"}`}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`text-center ${isMobile ? "p-1.5" : "p-2"} bg-gray-50 rounded`}>
              <div className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} bg-gray-200 rounded mx-auto mb-1 animate-pulse`}></div>
              <div className={`${isMobile ? "h-5" : "h-6"} bg-gray-200 rounded mb-1 animate-pulse`}></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3 className={`font-semibold mb-3 ${isMobile ? "text-sm" : ""}`}>Statistics Overview</h3>
        <div className="text-center py-4 text-muted-foreground">
          Unable to load statistics
        </div>
      </div>
    );
  }

  // Ensure type safety with proper fallbacks
  const safeStats = {
    totalOrders: Number(stats?.totalOrders) || 0,
    completedOrders: Number(stats?.completedOrders) || 0,
    pendingOrders: Number(stats?.pendingOrders) || 0,
    qualityIssues: Number(stats?.qualityIssues) || 0,
  };

  return (
    <div>
      <h3 className={`font-semibold mb-3 ${isMobile ? "text-sm" : ""}`}>Statistics Overview</h3>
      <div className={`grid grid-cols-2 ${isMobile ? "gap-2" : "gap-3"}`}>
        <div className={`text-center ${isMobile ? "p-1.5" : "p-2"} bg-blue-50 rounded`}>
          <Package className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} text-blue-600 mx-auto mb-1`} />
          <div className={`${isMobile ? "text-lg" : "text-xl"} font-bold text-blue-600`}>
            {safeStats.totalOrders}
          </div>
          <div className="text-xs text-blue-600">{isMobile ? "Total" : "Total Orders"}</div>
        </div>
        <div className={`text-center ${isMobile ? "p-1.5" : "p-2"} bg-green-50 rounded`}>
          <TrendingUp className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} text-green-600 mx-auto mb-1`} />
          <div className={`${isMobile ? "text-lg" : "text-xl"} font-bold text-green-600`}>
            {safeStats.completedOrders}
          </div>
          <div className="text-xs text-green-600">Completed</div>
        </div>
        <div className={`text-center ${isMobile ? "p-1.5" : "p-2"} bg-yellow-50 rounded`}>
          <Clock className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} text-yellow-600 mx-auto mb-1`} />
          <div className={`${isMobile ? "text-lg" : "text-xl"} font-bold text-yellow-600`}>
            {safeStats.pendingOrders}
          </div>
          <div className="text-xs text-yellow-600">Pending</div>
        </div>
        <div className={`text-center ${isMobile ? "p-1.5" : "p-2"} bg-red-50 rounded`}>
          <AlertTriangle className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} text-red-600 mx-auto mb-1`} />
          <div className={`${isMobile ? "text-lg" : "text-xl"} font-bold text-red-600`}>
            {safeStats.qualityIssues}
          </div>
          <div className="text-xs text-red-600">{isMobile ? "Issues" : "Quality Issues"}</div>
        </div>
      </div>
    </div>
  );
}

function RecentOrdersWidget() {
  const isMobile = useIsMobile();
  
  return (
    <div>
      <h3 className={`font-semibold mb-3 ${isMobile ? "text-sm" : ""}`}>Recent Orders</h3>
      <div className={isMobile ? "text-sm" : ""}>
        <RecentOrders />
      </div>
    </div>
  );
}

function ProductionChartWidget() {
  const isMobile = useIsMobile();
  
  return (
    <div>
      <h3 className={`font-semibold mb-3 ${isMobile ? "text-sm" : ""}`}>Production Chart</h3>
      <div className={isMobile ? "h-48" : ""}>
        <ProductionChart />
      </div>
    </div>
  );
}

function NotificationsWidget() {
  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    staleTime: 60000,
  });
  const isMobile = useIsMobile();

  return (
    <div>
      <h3 className={`font-semibold mb-3 ${isMobile ? "text-sm" : ""}`}>Notifications</h3>
      {notifications &&
      Array.isArray(notifications) &&
      notifications.length > 0 ? (
        <div className={`space-y-2 ${isMobile ? "max-h-40 overflow-y-auto" : ""}`}>
          {notifications.slice(0, isMobile ? 3 : 5).map((notification: any, index: number) => (
            <div key={index} className={`${isMobile ? "p-1.5" : "p-2"} bg-gray-50 rounded`}>
              <div className={`${isMobile ? "text-xs" : "text-sm"}`}>
                {notification.message || "System notification"}
              </div>
              <div className="text-xs text-muted-foreground">
                {notification.createdAt
                  ? new Date(notification.createdAt).toLocaleDateString()
                  : "Recent"}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <div className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>
            No new notifications
          </div>
        </div>
      )}
    </div>
  );
}

export function CustomizableDashboardV2() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [widgets, setWidgets] = useState<WidgetItem[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Handle drag end with useCallback to prevent unnecessary re-renders
  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    setWidgets(currentWidgets => {
      const items = Array.from(currentWidgets);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      // Update positions
      const updatedWidgets = items.map((widget, index) => ({
        ...widget,
        position: index,
      }));

      return updatedWidgets;
    });
    
    setHasUnsavedChanges(true);
  }, []);

  // Load saved dashboard layout
  useEffect(() => {
    const savedLayout = localStorage.getItem(`dashboard-layout-${user?.id}`);
    if (savedLayout) {
      try {
        setWidgets(JSON.parse(savedLayout));
      } catch (error) {
        console.error("Error loading saved layout:", error);
        setWidgets(getDefaultWidgets());
      }
    } else {
      setWidgets(getDefaultWidgets());
    }
  }, [user?.id]);

  // Save layout to localStorage
  const saveLayout = () => {
    if (user?.id) {
      localStorage.setItem(
        `dashboard-layout-${user.id}`,
        JSON.stringify(widgets),
      );
      setHasUnsavedChanges(false);
      toast({ title: "Dashboard layout saved successfully" });
    }
  };

  // Add widget with useCallback optimization
  const addWidget = useCallback((templateId: string) => {
    const template = WIDGET_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    setWidgets(currentWidgets => {
      const newWidget: WidgetItem = {
        id: `${template.id}-${Date.now()}`,
        type: template.type,
        title: template.name,
        visible: true,
        position: currentWidgets.length,
        config: {},
      };

      return [...currentWidgets, newWidget];
    });
    
    setHasUnsavedChanges(true);
    setShowWidgetLibrary(false);
  }, []);

  // Remove widget with useCallback optimization
  const removeWidget = useCallback((widgetId: string) => {
    setWidgets(currentWidgets => currentWidgets.filter((w) => w.id !== widgetId));
    setHasUnsavedChanges(true);
  }, []);

  // Toggle widget visibility with useCallback optimization
  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setWidgets(currentWidgets =>
      currentWidgets.map((w) =>
        w.id === widgetId ? { ...w, visible: !w.visible } : w,
      ),
    );
    setHasUnsavedChanges(true);
  }, []);

  // Reset to default
  const resetToDefault = () => {
    setWidgets(getDefaultWidgets());
    setHasUnsavedChanges(true);
  };

  // Render widget component
  const renderWidget = (widget: WidgetItem) => {
    const template = WIDGET_TEMPLATES.find((t) => t.type === widget.type);
    if (!template) return <div>Unknown widget type: {widget.type}</div>;

    const WidgetComponent = template.component;
    return <WidgetComponent {...widget.config} />;
  };

  // Memoize visible widgets to prevent unnecessary recalculations
  const visibleWidgets = useMemo(() => 
    widgets.filter((w) => w.visible || isEditMode), 
    [widgets, isEditMode]
  );

  return (
    <div className="space-y-4">
      {/* Dashboard Controls - Mobile Optimized */}
      <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Customizable Dashboard</h2>
          {hasUnsavedChanges && (
            <Badge variant="secondary" className="text-xs">
              {isMobile ? "Unsaved" : "Unsaved changes"}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {isEditMode && (
            <>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "sm"}
                onClick={() => setShowWidgetLibrary(true)}
                className={isMobile ? "flex-shrink-0" : ""}
              >
                <Plus className="h-4 w-4" />
                {!isMobile && <span className="ml-1">Add Widget</span>}
              </Button>

              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "sm"} 
                onClick={resetToDefault}
                className={isMobile ? "flex-shrink-0" : ""}
              >
                <RotateCcw className="h-4 w-4" />
                {!isMobile && <span className="ml-1">Reset</span>}
              </Button>

              {hasUnsavedChanges && (
                <Button 
                  size={isMobile ? "sm" : "sm"} 
                  onClick={saveLayout}
                  className={isMobile ? "flex-shrink-0" : ""}
                >
                  <Save className="h-4 w-4" />
                  {!isMobile && <span className="ml-1">Save</span>}
                </Button>
              )}
            </>
          )}

          <Button
            variant={isEditMode ? "default" : "outline"}
            size={isMobile ? "sm" : "sm"}
            onClick={() => setIsEditMode(!isEditMode)}
            className={isMobile ? "flex-shrink-0" : ""}
          >
            <Settings className="h-4 w-4" />
            {!isMobile && <span className="ml-1">{isEditMode ? "Done" : "Customize"}</span>}
          </Button>
        </div>
      </div>

      {/* Dashboard Grid - Mobile Optimized */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard-widgets" direction="vertical">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid grid-cols-1 ${
                isMobile 
                  ? "gap-3" 
                  : "sm:grid-cols-2 lg:grid-cols-3 gap-4"
              } min-h-[400px] p-2 sm:p-4 rounded-lg border-2 border-dashed transition-colors ${
                snapshot.isDraggingOver
                  ? "border-primary bg-primary/5"
                  : isEditMode
                    ? "border-muted-foreground/30 bg-muted/20"
                    : "border-transparent"
              }`}
            >
              {visibleWidgets.map((widget, index) => (
                <Draggable
                  key={widget.id}
                  draggableId={widget.id}
                  index={index}
                  isDragDisabled={!isEditMode}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${
                        snapshot.isDragging ? "rotate-2 scale-105" : ""
                      } transition-transform`}
                    >
                      <Card
                        className={`relative ${
                          isEditMode ? "ring-2 ring-primary/20" : ""
                        } ${!widget.visible ? "opacity-50" : ""} ${
                          isMobile ? "min-h-[200px]" : ""
                        }`}
                      >
                        {isEditMode && (
                          <div className={`absolute top-2 right-2 z-10 flex ${
                            isMobile ? "flex-col gap-1" : "gap-1"
                          }`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`${isMobile ? "h-8 w-8" : "h-6 w-6"} p-0`}
                              onClick={() => toggleWidgetVisibility(widget.id)}
                            >
                              {widget.visible ? (
                                <Eye className={`${isMobile ? "h-4 w-4" : "h-3 w-3"}`} />
                              ) : (
                                <EyeOff className={`${isMobile ? "h-4 w-4" : "h-3 w-3"}`} />
                              )}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className={`${isMobile ? "h-8 w-8" : "h-6 w-6"} p-0`}
                              onClick={() => removeWidget(widget.id)}
                            >
                              <Trash2 className={`${isMobile ? "h-4 w-4" : "h-3 w-3"}`} />
                            </Button>

                            <div
                              {...provided.dragHandleProps}
                              className={`flex items-center justify-center ${
                                isMobile ? "h-8 w-8" : "h-6 w-6"
                              } cursor-move hover:bg-muted rounded`}
                            >
                              <Move className={`${isMobile ? "h-4 w-4" : "h-3 w-3"}`} />
                            </div>
                          </div>
                        )}

                        <CardContent className={`${isMobile ? "p-3" : "p-4"}`}>
                          {renderWidget(widget)}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {/* Empty state */}
              {isEditMode && visibleWidgets.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <LayoutGrid className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No widgets yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add widgets to customize your dashboard
                  </p>
                  <Button onClick={() => setShowWidgetLibrary(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Your First Widget
                  </Button>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Widget Library Modal */}
      {showWidgetLibrary && (
        <WidgetLibraryModal
          onAddWidget={addWidget}
          onClose={() => setShowWidgetLibrary(false)}
          existingWidgets={widgets}
        />
      )}
    </div>
  );
}

// Widget Library Modal
function WidgetLibraryModal({
  onAddWidget,
  onClose,
  existingWidgets,
}: {
  onAddWidget: (templateId: string) => void;
  onClose: () => void;
  existingWidgets: WidgetItem[];
}) {
  const categories = ["analytics", "production", "quality", "orders", "system"];
  const isMobile = useIsMobile();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={`${
        isMobile 
          ? "max-w-[95vw] max-h-[90vh] mx-2" 
          : "max-w-4xl max-h-[80vh]"
      } overflow-hidden`}>
        <DialogHeader>
          <DialogTitle className={isMobile ? "text-lg" : ""}>Widget Library</DialogTitle>
          <DialogDescription className={isMobile ? "text-sm" : ""}>
            Choose from available widgets to customize your dashboard
          </DialogDescription>
        </DialogHeader>

        <div className={`grid ${
          isMobile 
            ? "grid-cols-1 gap-3" 
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        } overflow-y-auto ${isMobile ? "max-h-[70vh]" : "max-h-[60vh]"} p-2`}>
          {WIDGET_TEMPLATES.map((template) => {
            const isAdded = existingWidgets.some(
              (w) => w.type === template.type,
            );

            return (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isAdded ? "opacity-50" : ""
                } ${isMobile ? "min-h-[80px]" : ""}`}
                onClick={() => !isAdded && onAddWidget(template.id)}
              >
                <CardHeader className={isMobile ? "pb-1 p-3" : "pb-2"}>
                  <div className={`flex items-center ${isMobile ? "flex-col space-y-2" : "justify-between"}`}>
                    <div className="flex items-center gap-2">
                      {template.icon}
                      <CardTitle className={isMobile ? "text-sm" : "text-sm"}>{template.name}</CardTitle>
                    </div>
                    <Badge variant="secondary" className={isMobile ? "text-xs" : ""}>{template.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className={isMobile ? "p-3 pt-0" : ""}>
                  <p className={`${isMobile ? "text-xs" : "text-xs"} text-muted-foreground mb-2`}>
                    {template.description}
                  </p>
                  {isAdded && (
                    <Badge variant="outline" className="text-xs">
                      Already added
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Default widgets configuration
function getDefaultWidgets(): WidgetItem[] {
  return [
    {
      id: "stats-overview-default",
      type: "stats-overview",
      title: "Statistics Overview",
      visible: true,
      position: 0,
      config: {},
    },
    {
      id: "recent-orders-default",
      type: "recent-orders",
      title: "Recent Orders",
      visible: true,
      position: 1,
      config: {},
    },
    {
      id: "quality-metrics-default",
      type: "quality-metrics",
      title: "Quality Metrics",
      visible: true,
      position: 2,
      config: {},
    },
  ];
}
