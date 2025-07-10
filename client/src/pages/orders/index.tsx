import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { API_ENDPOINTS } from "@/lib/constants";
import { formatDateString } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import { useIsMobile } from "@/hooks/use-mobile";
import { Order, Customer } from "@shared/schema";
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  MoreHorizontal,
  Package,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Pause,
  FileText,
  User,
  Download,
  RefreshCw,
  Trash2,
  BarChart3,
  ChevronRight,
  ArrowUp,
  ArrowDown
} from "lucide-react";

// Enhanced Status Badge Component with icons
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { 
      label: "Pending", 
      color: "bg-amber-50 text-amber-700 border-amber-200", 
      icon: <Clock className="h-3 w-3" />,
    },
    processing: { 
      label: "For Production", 
      color: "bg-blue-50 text-blue-700 border-blue-200", 
      icon: <Package className="h-3 w-3" />,
    },
    completed: { 
      label: "Completed", 
      color: "bg-emerald-50 text-emerald-700 border-emerald-200", 
      icon: <CheckCircle className="h-3 w-3" />,
    },
    cancelled: { 
      label: "Cancelled", 
      color: "bg-red-50 text-red-700 border-red-200", 
      icon: <XCircle className="h-3 w-3" />,
    },
    hold: { 
      label: "On Hold", 
      color: "bg-orange-50 text-orange-700 border-orange-200", 
      icon: <Pause className="h-3 w-3" />,
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    color: "bg-gray-50 text-gray-700 border-gray-200",
    icon: <AlertCircle className="h-3 w-3" />,
  };

  return (
    <Badge 
      variant="secondary" 
      className={`${config.color} text-xs font-medium border inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};

// Professional Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color = "blue" 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  trend?: { value: string; positive: boolean }; 
  color?: "blue" | "green" | "amber" | "red" | "purple" 
}) => {
  const colorConfig = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600"
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend.positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {trend.value}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full bg-gradient-to-r ${colorConfig[color]}`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Order Card Component
const OrderCard = ({ 
  order, 
  customer, 
  onStatusChange, 
  onDelete, 
  onSelect, 
  isSelected 
}: { 
  order: Order; 
  customer: Customer | undefined; 
  onStatusChange: (order: Order, status: string) => void; 
  onDelete: (order: Order) => void; 
  onSelect: (orderId: number) => void; 
  isSelected: boolean; 
}) => {
  const { t } = useTranslation();
  
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white hover:bg-gray-50/50">
      <CardContent className="p-0">
        <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(order.id)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">#{order.id}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDateString(order.date)}
                  </p>
                </div>
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">{customer?.name || 'Unknown Customer'}</p>
              {customer?.nameAr && (
                <p className="text-sm text-gray-500" dir="rtl">{customer.nameAr}</p>
              )}
            </div>
          </div>
          
          {order.note && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-600 flex-1">{order.note}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <Link href={`/orders/${order.id}`}>
              <Button variant="outline" size="sm" className="gap-2 hover:bg-blue-50 hover:text-blue-600">
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            </Link>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onStatusChange(order, "pending")}>
                    <Clock className="h-4 w-4 mr-2" />
                    Set to Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(order, "processing")}>
                    <Package className="h-4 w-4 mr-2" />
                    Set to Processing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(order, "completed")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Set to Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(order, "hold")}>
                    <Pause className="h-4 w-4 mr-2" />
                    Put on Hold
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(order)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Quick Filter Button Component
const QuickFilterButton = ({ 
  label, 
  count, 
  isActive, 
  onClick 
}: { 
  label: string; 
  count: number; 
  isActive: boolean; 
  onClick: () => void; 
}) => (
  <Button
    variant={isActive ? "default" : "outline"}
    size="sm"
    onClick={onClick}
    className={`gap-2 ${isActive ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-50'}`}
  >
    {label}
    <Badge variant="secondary" className="ml-1 bg-white/20 text-current">
      {count}
    </Badge>
  </Button>
);

export default function OrdersIndex() {
  const queryClient = useQueryClient();
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();

  // Fetch orders and customers
  const { data: orders, isLoading, refetch } = useQuery<Order[]>({
    queryKey: [API_ENDPOINTS.ORDERS],
  });

  const { data: customers } = useQuery<Customer[]>({
    queryKey: [API_ENDPOINTS.CUSTOMERS],
  });

  // Helper function to get customer by ID
  const getCustomerById = (customerId: string) => {
    return customers?.find(c => c.id === customerId);
  };

  // Filter and sort orders
  const filteredOrders = orders
    ?.filter((order) => {
      // Status filter
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const customer = getCustomerById(order.customerId);
        const searchLower = searchQuery.toLowerCase();
        return (
          order.id.toString().includes(searchLower) ||
          customer?.name.toLowerCase().includes(searchLower) ||
          customer?.nameAr?.toLowerCase().includes(searchLower) ||
          order.note?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    })
    ?.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case "date":
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
          break;
        case "id":
          aVal = a.id;
          bVal = b.id;
          break;
        case "customer":
          aVal = getCustomerById(a.customerId)?.name || "";
          bVal = getCustomerById(b.customerId)?.name || "";
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          aVal = a.id;
          bVal = b.id;
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Calculate statistics
  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.status === "pending").length || 0,
    processing: orders?.filter(o => o.status === "processing").length || 0,
    completed: orders?.filter(o => o.status === "completed").length || 0,
    cancelled: orders?.filter(o => o.status === "cancelled").length || 0,
    hold: orders?.filter(o => o.status === "hold").length || 0,
  };

  // Status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      let statusLabel = variables.status;
      if (variables.status === "processing") statusLabel = "For Production";
      if (variables.status === "hold") statusLabel = "On Hold";

      toast({
        title: "Order Status Updated",
        description: `Order #${variables.id} status changed to ${statusLabel}`,
      });

      queryClient.setQueryData([API_ENDPOINTS.ORDERS], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((order: any) =>
          order.id === variables.id
            ? { ...order, status: variables.status }
            : order,
        );
      });
    },
    onError: (error: any) => {
      console.error("Status update error:", error);
      const errorMessage = error?.message || "Failed to update order status";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (order: Order, newStatus: string) => {
    updateStatusMutation.mutate({ id: order.id, status: newStatus });
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to delete order (${response.status})`,
        );
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ORDERS] });
      const message = data?.message || "Order deleted successfully";
      toast({
        title: "Order Deleted",
        description: message,
      });
      setDeletingOrder(null);
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
      const errorMessage = error?.message || "Failed to delete order";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleDeleteOrder = (order: Order) => {
    deleteMutation.mutate(order.id);
  };

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders?.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders?.map(order => order.id) || []);
    }
  };

  const handleBulkDelete = () => {
    // Implementation for bulk delete
    setShowBulkDeleteDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-7 w-7 text-blue-600" />
            Order Management
          </h1>
          <p className="text-gray-600 mt-1">Manage and track all your orders</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Link href="/orders/new">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              New Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard 
          title="Total Orders" 
          value={stats.total} 
          icon={<ShoppingCart className="h-5 w-5" />}
          color="blue"
        />
        <StatsCard 
          title="Pending" 
          value={stats.pending} 
          icon={<Clock className="h-5 w-5" />}
          color="amber"
        />
        <StatsCard 
          title="Processing" 
          value={stats.processing} 
          icon={<Package className="h-5 w-5" />}
          color="blue"
        />
        <StatsCard 
          title="Completed" 
          value={stats.completed} 
          icon={<CheckCircle className="h-5 w-5" />}
          color="green"
        />
        <StatsCard 
          title="On Hold" 
          value={stats.hold} 
          icon={<Pause className="h-5 w-5" />}
          color="red"
        />
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders by ID, customer, or note..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="id">Order ID</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="gap-2"
              >
                {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                {sortOrder === "asc" ? "Asc" : "Desc"}
              </Button>
            </div>
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <QuickFilterButton
              label="All"
              count={stats.total}
              isActive={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
            />
            <QuickFilterButton
              label="Pending"
              count={stats.pending}
              isActive={statusFilter === "pending"}
              onClick={() => setStatusFilter("pending")}
            />
            <QuickFilterButton
              label="Processing"
              count={stats.processing}
              isActive={statusFilter === "processing"}
              onClick={() => setStatusFilter("processing")}
            />
            <QuickFilterButton
              label="Completed"
              count={stats.completed}
              isActive={statusFilter === "completed"}
              onClick={() => setStatusFilter("completed")}
            />
            <QuickFilterButton
              label="On Hold"
              count={stats.hold}
              isActive={statusFilter === "hold"}
              onClick={() => setStatusFilter("hold")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === filteredOrders?.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                />
                <span className="text-blue-700 font-medium">
                  {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrders([])}
                >
                  Clear Selection
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Grid */}
      <div className="space-y-4">
        {!filteredOrders || filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || statusFilter !== "all" 
                    ? "No orders match your current filters" 
                    : "Get started by creating your first order"}
                </p>
                <Link href="/orders/new">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Order
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                customer={getCustomerById(order.customerId)}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteOrder}
                onSelect={handleSelectOrder}
                isSelected={selectedOrders.includes(order.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingOrder} onOpenChange={() => setDeletingOrder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete order #{deletingOrder?.id}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingOrder && handleDeleteOrder(deletingOrder)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Orders</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedOrders.length} selected orders? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // Implement bulk delete logic here
                setShowBulkDeleteDialog(false);
                setSelectedOrders([]);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Orders
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}