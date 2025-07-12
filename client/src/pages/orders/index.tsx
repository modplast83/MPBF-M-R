import { useState, useEffect, useMemo, useCallback } from "react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { API_ENDPOINTS } from "@/lib/constants";
import { formatDateString } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import { useIsMobile } from "@/hooks/use-mobile";
import { Order, Customer } from "@shared/schema";
import Fuse from "fuse.js";
import { ApiErrorHandler } from "@/utils/api-error-handler";
import { isValidNumber } from "@/utils/type-safety";
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
  ArrowDown,
  History,
  X,
  Sparkles,
  Target
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
      className="transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-secondary/80 bg-blue-50 text-blue-700 border-blue-200 text-xs border inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-center font-bold"
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
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend.positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {trend.value}
              </p>
            )}
          </div>
          <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-r ${colorConfig[color]} flex-shrink-0`}>
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
        <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(order.id)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0"
              />
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">#{order.id}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 font-bold">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{formatDateString(order.date)}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <StatusBadge status={order.status} />
            </div>
          </div>
        </div>
        
        <div className="p-3 sm:p-4 space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-bold text-sm sm:text-base truncate">{customer?.name || 'Unknown Customer'}</p>
              {customer?.nameAr && (
                <p className="font-extrabold text-base sm:text-lg text-[#000000] truncate" dir="rtl">{customer.nameAr}</p>
              )}
            </div>
          </div>
          
          {order.note && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 flex-1 line-clamp-2">{order.note}</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0 pt-3 border-t border-gray-100">
            <Link href={`/orders/${order.id}`} className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="gap-2 hover:bg-blue-50 hover:text-blue-600 w-full sm:w-auto">
                <Eye className="h-4 w-4" />
                <span className="sm:inline">View Details</span>
              </Button>
            </Link>
            
            <div className="flex items-center gap-2 justify-end">
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

// Quick Filter Button Component - Mobile Optimized
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
    className={`gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${isActive ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-50'}`}
  >
    <span className="truncate">{label}</span>
    <Badge variant="secondary" className="ml-1 bg-white/20 text-current text-xs px-1">
      {count}
    </Badge>
  </Button>
);

// Smart Search Component with fuzzy matching and recent searches
const SmartSearchBox = ({ 
  onSearch, 
  placeholder = "Search orders...", 
  recentSearches = [], 
  onRecentSearchSelect,
  searchSuggestions = []
}: {
  onSearch: (query: string) => void;
  placeholder?: string;
  recentSearches?: string[];
  onRecentSearchSelect?: (query: string) => void;
  searchSuggestions?: Array<{ text: string; type: 'order' | 'customer' | 'status' }>;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search functionality
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    setIsOpen(false);
  };

  const handleRecentSelect = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
    if (onRecentSearchSelect) {
      onRecentSearchSelect(query);
    }
    setIsOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
    setShowSuggestions(false);
  };

  // Filter suggestions based on current query
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return [];
    
    const fuse = new Fuse(searchSuggestions, {
      keys: ['text'],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true,
    });
    
    return fuse.search(searchQuery).slice(0, 5);
  }, [searchQuery, searchSuggestions]);

  return (
    <div className="relative flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <Sparkles className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command>
                <CommandList>
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <CommandGroup heading="Recent Searches">
                      {recentSearches.slice(0, 3).map((search, index) => (
                        <CommandItem
                          key={index}
                          onSelect={() => handleRecentSelect(search)}
                          className="cursor-pointer"
                        >
                          <History className="h-4 w-4 mr-2 text-gray-400" />
                          {search}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  
                  {/* Search Suggestions */}
                  {filteredSuggestions.length > 0 && (
                    <CommandGroup heading="Suggestions">
                      {filteredSuggestions.map((result, index) => (
                        <CommandItem
                          key={index}
                          onSelect={() => handleSuggestionSelect(result.item.text)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {result.item.type === 'order' && <Package className="h-4 w-4 text-blue-500" />}
                            {result.item.type === 'customer' && <User className="h-4 w-4 text-green-500" />}
                            {result.item.type === 'status' && <Target className="h-4 w-4 text-purple-500" />}
                            <span>{result.item.text}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  
                  {/* Empty State */}
                  {recentSearches.length === 0 && filteredSuggestions.length === 0 && (
                    <CommandEmpty>
                      <div className="text-center py-4">
                        <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Start typing to see suggestions</p>
                      </div>
                    </CommandEmpty>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

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
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('orders-recent-searches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    
    setRecentSearches(prev => {
      const updated = [query, ...prev.filter(s => s !== query)].slice(0, 5);
      localStorage.setItem('orders-recent-searches', JSON.stringify(updated));
      return updated;
    });
  }, []);

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

  // Create search suggestions from orders and customers
  const searchSuggestions = useMemo(() => {
    const suggestions: Array<{ text: string; type: 'order' | 'customer' | 'status' }> = [];
    
    // Add unique customer names
    const customerNames = new Set<string>();
    customers?.forEach(customer => {
      if (customer.name && !customerNames.has(customer.name)) {
        customerNames.add(customer.name);
        suggestions.push({ text: customer.name, type: 'customer' });
      }
      if (customer.nameAr && !customerNames.has(customer.nameAr)) {
        customerNames.add(customer.nameAr);
        suggestions.push({ text: customer.nameAr, type: 'customer' });
      }
    });
    
    // Add order IDs
    orders?.forEach(order => {
      suggestions.push({ text: `#${order.id}`, type: 'order' });
    });
    
    // Add status options
    ['pending', 'processing', 'completed', 'cancelled', 'hold'].forEach(status => {
      suggestions.push({ text: status, type: 'status' });
    });
    
    return suggestions;
  }, [orders, customers]);

  // Fuzzy search implementation
  const fuse = useMemo(() => {
    if (!orders || !customers) return null;
    
    const searchableData = orders.map(order => {
      const customer = getCustomerById(order.customerId);
      return {
        ...order,
        customerName: customer?.name || '',
        customerNameAr: customer?.nameAr || '',
        searchText: `${order.id} ${customer?.name || ''} ${customer?.nameAr || ''} ${order.note || ''} ${order.status}`
      };
    });
    
    return new Fuse(searchableData, {
      keys: [
        { name: 'id', weight: 0.3 },
        { name: 'customerName', weight: 0.25 },
        { name: 'customerNameAr', weight: 0.25 },
        { name: 'note', weight: 0.1 },
        { name: 'status', weight: 0.1 }
      ],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true
    });
  }, [orders, customers]);

  // Filter and sort orders with fuzzy search
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    let filtered = orders;
    
    // Apply fuzzy search if there's a search query
    if (searchQuery && fuse) {
      const results = fuse.search(searchQuery);
      filtered = results.map(result => {
        const { searchText, ...originalOrder } = result.item;
        return originalOrder as Order;
      });
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
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
  }, [orders, searchQuery, statusFilter, sortBy, sortOrder, fuse]);

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

  // Delete mutation with enhanced error handling
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      // Validate the order ID
      if (!id || !isValidNumber(id)) {
        throw new Error("Invalid order ID");
      }

      const response = await fetch(`${API_ENDPOINTS.ORDERS}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        // Use ApiErrorHandler for proper error handling
        ApiErrorHandler.handleError(
          data.message || `Failed to delete order (${response.status})`,
          response.status,
          data
        );
        throw new Error(
          data.message || `Failed to delete order (${response.status})`,
        );
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ORDERS] });
      const message = data?.message || t('orders.order_deleted_successfully');
      toast({
        title: t('orders.order_deleted'),
        description: message,
      });
      setDeletingOrder(null);
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
      const errorMessage = error?.message || t('orders.failed_to_delete_order');
      toast({
        title: t('orders.error'),
        description: errorMessage,
        variant: "destructive",
      });
      setDeletingOrder(null); // Reset state on error
    },
  });

  const handleDeleteOrder = (order: Order) => {
    setDeletingOrder(order);
  };

  const confirmDeleteOrder = () => {
    if (deletingOrder) {
      deleteMutation.mutate(deletingOrder.id);
    }
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
    setShowBulkDeleteDialog(true);
  };

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (orderIds: number[]) => {
      const results = await Promise.allSettled(
        orderIds.map(id => 
          fetch(`${API_ENDPOINTS.ORDERS}/${id}`, {
            method: "DELETE",
            credentials: "include",
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Failed to delete order ${id}`);
            }
            return response.json();
          })
        )
      );
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      return { successful, failed, total: orderIds.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ORDERS] });
      toast({
        title: t('orders.bulk_delete_completed'),
        description: t('orders.bulk_delete_success', { 
          successful: data.successful, 
          total: data.total 
        }),
      });
      setSelectedOrders([]);
      setShowBulkDeleteDialog(false);
    },
    onError: (error: any) => {
      console.error("Bulk delete error:", error);
      toast({
        title: t('orders.error'),
        description: t('orders.bulk_delete_error'),
        variant: "destructive",
      });
    },
  });

  const confirmBulkDelete = () => {
    if (selectedOrders.length > 0) {
      bulkDeleteMutation.mutate(selectedOrders);
    }
  };

  // Handle smart search
  const handleSmartSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }
  }, [saveRecentSearch]);

  const handleRecentSearchSelect = useCallback((query: string) => {
    setSearchQuery(query);
    // Move selected search to top of recent searches
    saveRecentSearch(query);
  }, [saveRecentSearch]);

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
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
              {t('orders.order_management')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">{t('orders.manage_track_orders')}</p>
          </div>
          
          {/* Mobile-first action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
                className="gap-2 flex-1 sm:flex-initial"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{t('common.refresh')}</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="gap-2 flex-1 sm:flex-initial"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{t('orders.export')}</span>
              </Button>
            </div>
            
            <Link href="/orders/new" className="w-full sm:w-auto">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                {t('orders.new_order')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards - Mobile Optimized */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
        <StatsCard 
          title={t('orders.total_orders')} 
          value={stats.total} 
          icon={<ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />}
          color="blue"
        />
        <StatsCard 
          title={t('orders.pending')} 
          value={stats.pending} 
          icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5" />}
          color="amber"
        />
        <StatsCard 
          title={t('orders.processing')} 
          value={stats.processing} 
          icon={<Package className="h-4 w-4 sm:h-5 sm:w-5" />}
          color="blue"
        />
        <StatsCard 
          title={t('orders.completed')} 
          value={stats.completed} 
          icon={<CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />}
          color="green"
        />
        <StatsCard 
          title={t('orders.on_hold')} 
          value={stats.hold} 
          icon={<Pause className="h-4 w-4 sm:h-5 sm:w-5" />}
          color="red"
        />
      </div>

      {/* Search and Filters - Mobile Optimized */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            {t('orders.search_filters')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="w-full">
            <SmartSearchBox
              onSearch={handleSmartSearch}
              placeholder={t('orders.search_by_id_customer')}
              recentSearches={recentSearches}
              onRecentSearchSelect={handleRecentSearchSelect}
              searchSuggestions={searchSuggestions}
            />
          </div>
          
          {/* Filters Row - Mobile Stack */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 flex-1">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder={t('orders.filter_by_status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('orders.all_status')}</SelectItem>
                  <SelectItem value="pending">{t('orders.pending')}</SelectItem>
                  <SelectItem value="processing">{t('orders.processing')}</SelectItem>
                  <SelectItem value="completed">{t('orders.completed')}</SelectItem>
                  <SelectItem value="hold">{t('orders.on_hold')}</SelectItem>
                  <SelectItem value="cancelled">{t('orders.cancelled')}</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder={t('orders.sort_by')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">{t('orders.date')}</SelectItem>
                  <SelectItem value="id">{t('orders.order_id')}</SelectItem>
                  <SelectItem value="customer">{t('orders.customer')}</SelectItem>
                  <SelectItem value="status">{t('orders.status')}</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="gap-2 flex-shrink-0"
              >
                {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                <span className="hidden sm:inline">{sortOrder === "asc" ? t('orders.asc') : t('orders.desc')}</span>
              </Button>
            </div>
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <QuickFilterButton
              label={t('orders.all')}
              count={stats.total}
              isActive={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
            />
            <QuickFilterButton
              label={t('orders.pending')}
              count={stats.pending}
              isActive={statusFilter === "pending"}
              onClick={() => setStatusFilter("pending")}
            />
            <QuickFilterButton
              label={t('orders.processing')}
              count={stats.processing}
              isActive={statusFilter === "processing"}
              onClick={() => setStatusFilter("processing")}
            />
            <QuickFilterButton
              label={t('orders.completed')}
              count={stats.completed}
              isActive={statusFilter === "completed"}
              onClick={() => setStatusFilter("completed")}
            />
            <QuickFilterButton
              label={t('orders.on_hold')}
              count={stats.hold}
              isActive={statusFilter === "hold"}
              onClick={() => setStatusFilter("hold")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions - Mobile Optimized */}
      {selectedOrders.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === filteredOrders?.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 flex-shrink-0"
                />
                <span className="text-blue-700 font-medium text-sm sm:text-base">
                  {selectedOrders.length} {selectedOrders.length !== 1 ? t('orders.orders') : t('orders.order')} {t('orders.selected')}
                </span>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrders([])}
                  className="flex-1 sm:flex-initial"
                >
                  {t('orders.clear_selection')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="gap-2 flex-1 sm:flex-initial"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('orders.delete_selected')}</span>
                  <span className="sm:hidden">Delete</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Grid - Mobile Optimized */}
      <div className="space-y-3 sm:space-y-4">
        {!filteredOrders || filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 sm:py-16 px-4">
              <div className="text-center">
                <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{t('orders.no_orders_found')}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  {searchQuery || statusFilter !== "all" 
                    ? t('orders.no_orders_match_filters') 
                    : t('orders.get_started_create_order')}
                </p>
                <Link href="/orders/new">
                  <Button className="gap-2 w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    {t('orders.create_order')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
            <AlertDialogTitle>{t('orders.delete_order')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('orders.confirm_delete_order', { id: deletingOrder?.id })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('orders.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteOrder}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('orders.delete_order')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('orders.delete_multiple_orders')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('orders.confirm_delete_multiple_orders', { count: selectedOrders.length })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('orders.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              disabled={bulkDeleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('orders.delete_orders')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}