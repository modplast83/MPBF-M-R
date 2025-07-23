import { useState, useEffect, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth-v2";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Settings,
  Plus,
  Eye,
  EyeOff,
  GripVertical,
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
  ShoppingCart,
  Users,
  Cog,
  Zap,
  LayoutDashboard,
  Factory,
  FileCheck,
  Boxes,
  TrendingDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Import existing dashboard components
import { QualityMetricsWidget } from "./quality-metrics-widget";
import { ProductionChart } from "./production-chart";
import { RecentOrders } from "./recent-orders";
import { QuickActions } from "./quick-actions";
import { DashboardAnalyticsWidget } from "./dashboard-analytics-widget";

interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  visible: boolean;
  position: number;
  size: "small" | "medium" | "large";
  category: string;
  config?: any;
}

interface WidgetTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  defaultSize: "small" | "medium" | "large";
  component: React.ComponentType<any>;
}

const WIDGET_TEMPLATES: WidgetTemplate[] = [
  {
    id: "stats-overview",
    type: "stats-overview",
    name: "Statistics Overview",
    description: "Key performance metrics and KPIs",
    icon: <BarChart3 className="h-5 w-5" />,
    category: "analytics",
    defaultSize: "large",
    component: StatsOverviewWidget,
  },
  {
    id: "recent-orders",
    type: "recent-orders",
    name: "Recent Orders",
    description: "Latest customer orders and their status",
    icon: <ShoppingCart className="h-5 w-5" />,
    category: "orders",
    defaultSize: "large",
    component: RecentOrdersWidget,
  },
  {
    id: "quality-metrics",
    type: "quality-metrics",
    name: "Quality Control",
    description: "Quality metrics and failure rates",
    icon: <FileCheck className="h-5 w-5" />,
    category: "quality",
    defaultSize: "medium",
    component: QualityMetricsWidget,
  },
  {
    id: "production-chart",
    type: "production-chart",
    name: "Production Analytics",
    description: "Visual production performance data",
    icon: <TrendingUp className="h-5 w-5" />,
    category: "production",
    defaultSize: "large",
    component: ProductionChartWidget,
  },
  {
    id: "quick-actions",
    type: "quick-actions",
    name: "Quick Actions",
    description: "Frequently used shortcuts and actions",
    icon: <Zap className="h-5 w-5" />,
    category: "productivity",
    defaultSize: "medium",
    component: QuickActions,
  },
  {
    id: "notifications",
    type: "notifications",
    name: "System Notifications",
    description: "Recent alerts and system messages",
    icon: <FileText className="h-5 w-5" />,
    category: "system",
    defaultSize: "medium",
    component: NotificationsWidget,
  },
  {
    id: "machine-status",
    type: "machine-status", 
    name: "Machine Status",
    description: "Real-time machine operational status",
    icon: <Factory className="h-5 w-5" />,
    category: "production",
    defaultSize: "medium",
    component: MachineStatusWidget,
  },
  {
    id: "pending-tasks",
    type: "pending-tasks",
    name: "Pending Tasks",
    description: "Outstanding tasks and assignments",
    icon: <Clock className="h-5 w-5" />,
    category: "productivity",
    defaultSize: "small",
    component: PendingTasksWidget,
  },
  {
    id: "performance-analytics",
    type: "performance-analytics",
    name: "Performance Analytics",
    description: "Detailed performance metrics and KPI tracking",
    icon: <Target className="h-5 w-5" />,
    category: "analytics",
    defaultSize: "large",
    component: DashboardAnalyticsWidget,
  },
];

// Widget size configuration
const WIDGET_SIZE_CLASSES = {
  small: "col-span-1 row-span-1",
  medium: "col-span-2 row-span-1", 
  large: "col-span-2 row-span-2",
};

// Enhanced Dashboard Component
export function EnhancedCustomizableDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showAddWidgetDialog, setShowAddWidgetDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load widgets from localStorage
  useEffect(() => {
    const savedWidgets = localStorage.getItem("customizable-dashboard-widgets");
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    } else {
      // Initialize with default widgets
      setWidgets(getDefaultWidgets());
    }
  }, []);

  // Save widgets to localStorage
  const saveWidgets = useCallback((newWidgets: DashboardWidget[]) => {
    localStorage.setItem("customizable-dashboard-widgets", JSON.stringify(newWidgets));
    setWidgets(newWidgets);
    setHasUnsavedChanges(false);
    toast({
      title: "Dashboard Updated",
      description: "Your dashboard layout has been saved successfully.",
    });
  }, [toast]);

  // Get default widget configuration
  function getDefaultWidgets(): DashboardWidget[] {
    return [
      {
        id: "stats-overview",
        type: "stats-overview",
        title: "Statistics Overview",
        visible: true,
        position: 0,
        size: "large",
        category: "analytics",
      },
      {
        id: "recent-orders",
        type: "recent-orders", 
        title: "Recent Orders",
        visible: true,
        position: 1,
        size: "large",
        category: "orders",
      },
      {
        id: "production-chart",
        type: "production-chart",
        title: "Production Analytics",
        visible: true,
        position: 2,
        size: "large",
        category: "production",
      },
      {
        id: "quick-actions",
        type: "quick-actions",
        title: "Quick Actions", 
        visible: true,
        position: 3,
        size: "medium",
        category: "productivity",
      },
    ];
  }

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newWidgets = Array.from(widgets);
    const [reorderedItem] = newWidgets.splice(result.source.index, 1);
    newWidgets.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      position: index,
    }));

    setWidgets(updatedWidgets);
    setHasUnsavedChanges(true);
  };

  // Toggle widget visibility
  const toggleWidgetVisibility = (widgetId: string) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId
        ? { ...widget, visible: !widget.visible }
        : widget
    );
    setWidgets(updatedWidgets);
    setHasUnsavedChanges(true);
  };

  // Add new widget
  const addWidget = (templateId: string) => {
    const template = WIDGET_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    const newWidget: DashboardWidget = {
      id: `${templateId}-${Date.now()}`,
      type: template.type,
      title: template.name,
      visible: true,
      position: widgets.length,
      size: template.defaultSize,
      category: template.category,
    };

    setWidgets([...widgets, newWidget]);
    setHasUnsavedChanges(true);
    setShowAddWidgetDialog(false);
    
    toast({
      title: "Widget Added",
      description: `${template.name} has been added to your dashboard.`,
    });
  };

  // Remove widget
  const removeWidget = (widgetId: string) => {
    const updatedWidgets = widgets.filter(w => w.id !== widgetId);
    setWidgets(updatedWidgets);
    setHasUnsavedChanges(true);
  };

  // Reset to default layout
  const resetToDefault = () => {
    setWidgets(getDefaultWidgets());
    setHasUnsavedChanges(true);
    toast({
      title: "Layout Reset",
      description: "Dashboard has been reset to default layout.",
    });
  };

  // Filter widgets by visibility
  const visibleWidgets = widgets.filter(widget => widget.visible);
  const categories = ["all", "analytics", "orders", "production", "quality", "productivity", "system"];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t("dashboard.customizable_dashboard")}
          </h2>
          <p className="text-muted-foreground text-lg">
            Personalize your workspace with drag-and-drop widgets and real-time analytics
          </p>
          {user && (
            <p className="text-sm text-muted-foreground">
              Welcome back, <span className="font-medium text-primary">{user.firstName || user.username}</span>
            </p>
          )}
        </div>
        
        {/* Dashboard Controls */}
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Badge variant="secondary" className="animate-pulse">
              Unsaved Changes
            </Badge>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddWidgetDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Widget
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {isCustomizing ? "Done" : "Customize"}
          </Button>

          {hasUnsavedChanges && (
            <Button
              onClick={() => saveWidgets(widgets)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Layout
            </Button>
          )}
        </div>
      </div>

      {/* Customization Mode Notice */}
      {isCustomizing && (
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary animate-spin" style={{animationDuration: '3s'}} />
              </div>
              <div>
                <span className="font-semibold text-primary text-lg">Customization Mode Active</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">Live editing enabled</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GripVertical className="h-4 w-4" />
                <span>Drag to reorder</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>Toggle visibility</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Plus className="h-4 w-4" />
                <span>Add new widgets</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard" isDropDisabled={!isCustomizing}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid gap-6 ${
                isMobile
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              {visibleWidgets.map((widget, index) => (
                <Draggable
                  key={widget.id}
                  draggableId={widget.id}
                  index={index}
                  isDragDisabled={!isCustomizing}
                >
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${WIDGET_SIZE_CLASSES[widget.size]} ${
                        snapshot.isDragging ? "shadow-2xl rotate-2 scale-105 border-primary/50" : ""
                      } ${isCustomizing ? "ring-2 ring-primary/30 shadow-md hover:shadow-lg" : "hover:shadow-md"} transition-all duration-300 bg-gradient-to-br from-background to-muted/20`}
                    >
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                          <CardTitle className="text-base font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
                            {widget.title}
                          </CardTitle>
                        </div>
                        
                        {isCustomizing && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleWidgetVisibility(widget.id)}
                              className="h-8 w-8 p-0"
                            >
                              {widget.visible ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeWidget(widget.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted"
                            >
                              <GripVertical className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <WidgetRenderer widget={widget} />
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Widget Dialog */}
      <Dialog open={showAddWidgetDialog} onOpenChange={setShowAddWidgetDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Add Widget to Dashboard</DialogTitle>
            <DialogDescription>
              Choose from available widgets to add to your dashboard
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="production">Production</TabsTrigger>
              <TabsTrigger value="productivity">Productivity</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WIDGET_TEMPLATES
                  .filter(template => 
                    selectedCategory === "all" || template.category === selectedCategory
                  )
                  .map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:bg-muted/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {template.icon}
                            <div>
                              <CardTitle className="text-sm">{template.name}</CardTitle>
                              <p className="text-xs text-muted-foreground">
                                {template.description}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addWidget(template.id)}
                            disabled={widgets.some(w => w.type === template.type)}
                          >
                            {widgets.some(w => w.type === template.type) ? "Added" : "Add"}
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Widget Renderer Component
function WidgetRenderer({ widget }: { widget: DashboardWidget }) {
  const template = WIDGET_TEMPLATES.find(t => t.type === widget.type);
  
  if (!template) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Widget not found
      </div>
    );
  }

  const WidgetComponent = template.component;
  return <WidgetComponent config={widget.config} />;
}

// Enhanced Widget Components
function StatsOverviewWidget() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard-stats"],
    queryFn: () => apiRequest("GET", "/api/dashboard-stats"),
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center p-4 bg-muted/50 rounded-lg animate-pulse">
            <div className="h-8 w-8 bg-muted rounded mx-auto mb-2"></div>
            <div className="h-6 bg-muted rounded mb-1"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const safeStats = {
    totalOrders: Number(stats?.totalOrders) || 0,
    completedOrders: Number(stats?.completedOrders) || 0,
    pendingOrders: Number(stats?.pendingOrders) || 0,
    qualityIssues: Number(stats?.qualityIssues) || 0,
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
        <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-blue-600">{safeStats.totalOrders}</div>
        <div className="text-sm text-blue-600">Total Orders</div>
      </div>
      <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
        <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-green-600">{safeStats.completedOrders}</div>
        <div className="text-sm text-green-600">Completed</div>
      </div>
      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
        <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-yellow-600">{safeStats.pendingOrders}</div>
        <div className="text-sm text-yellow-600">Pending</div>
      </div>
      <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
        <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-red-600">{safeStats.qualityIssues}</div>
        <div className="text-sm text-red-600">Quality Issues</div>
      </div>
    </div>
  );
}

function RecentOrdersWidget() {
  return (
    <div className="space-y-2">
      <RecentOrders />
    </div>
  );
}

function ProductionChartWidget() {
  return (
    <div className="h-64">
      <ProductionChart />
    </div>
  );
}

function NotificationsWidget() {
  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    queryFn: () => apiRequest("GET", "/api/notifications"),
    staleTime: 60000,
  });

  return (
    <div className="space-y-3">
      {notifications && Array.isArray(notifications) && notifications.length > 0 ? (
        notifications.slice(0, 3).map((notification: any, index: number) => (
          <div key={index} className="p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium">
              {notification.message || "System notification"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {notification.createdAt
                ? new Date(notification.createdAt).toLocaleDateString()
                : "Recent"}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">No notifications</p>
        </div>
      )}
    </div>
  );
}

function MachineStatusWidget() {
  const { data: machines } = useQuery({
    queryKey: ["/api/machines"],
    queryFn: () => apiRequest("GET", "/api/machines"),
    staleTime: 30000,
  });

  if (!machines || !Array.isArray(machines)) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Factory className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm">No machine data</p>
      </div>
    );
  }

  const activeMachines = machines.filter((m: any) => m.isActive).length;
  const totalMachines = machines.length;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-green-600">
          {activeMachines}/{totalMachines}
        </div>
        <p className="text-sm text-muted-foreground">Active Machines</p>
      </div>
      
      <div className="space-y-2">
        {machines.slice(0, 3).map((machine: any, index: number) => (
          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
            <span className="text-sm font-medium truncate">{machine.name}</span>
            <Badge variant={machine.isActive ? "default" : "secondary"}>
              {machine.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function PendingTasksWidget() {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-600">5</div>
        <p className="text-sm text-muted-foreground">Pending Tasks</p>
      </div>
      
      <div className="space-y-2">
        <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded text-xs">
          Quality inspection overdue
        </div>
        <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded text-xs">
          Material order approval
        </div>
        <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-xs">
          Production report review
        </div>
      </div>
    </div>
  );
}

export default EnhancedCustomizableDashboard;