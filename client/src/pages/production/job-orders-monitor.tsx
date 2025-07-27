import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  RefreshCw,
  Package,
  Factory,
  Users,
  Layers,
  Hash,
  Weight,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Scissors,
  Printer,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Timer,
} from "lucide-react";
import type {
  JobOrder,
  Order,
  Customer,
  CustomerProduct,
  Item,
  MasterBatch,
  Roll,
} from "shared/schema";

interface JobOrderWithDetails extends JobOrder {
  order?: Order;
  customer?: Customer;
  customerProduct?: CustomerProduct;
  item?: Item;
  masterBatch?: MasterBatch;
  rolls?: Roll[];
  extrusionQty?: number;
  printingQty?: number;
  cuttingQty?: number;
  remainingQty?: number;
  completionPercentage?: number;
  currentStage?: string;
  estimatedCompletion?: Date;
}

interface StageQuantities {
  extrusion: number;
  printing: number;
  cutting: number;
  completed: number;
  remaining: number;
}

// Comprehensive Statistics Component
const ProductionStats = ({ jobOrders }: { jobOrders: JobOrderWithDetails[] }) => {
  const { t } = useTranslation();
  
  const stats = useMemo(() => {
    const totalOrders = jobOrders.length;
    const totalQuantity = jobOrders.reduce((sum, jo) => sum + jo.quantity, 0);
    const completedQuantity = jobOrders.reduce((sum, jo) => sum + (jo.cuttingQty || 0), 0);
    const inProgressQuantity = jobOrders.reduce((sum, jo) => sum + (jo.remainingQty || 0), 0);
    
    const stageBreakdown = jobOrders.reduce((acc, jo) => {
      acc.extrusion += jo.extrusionQty || 0;
      acc.printing += jo.printingQty || 0;
      acc.cutting += jo.cuttingQty || 0;
      acc.completed += jo.cuttingQty || 0;
      acc.remaining += jo.remainingQty || 0;
      return acc;
    }, { extrusion: 0, printing: 0, cutting: 0, completed: 0, remaining: 0 });
    
    const completionRate = totalQuantity > 0 ? (completedQuantity / totalQuantity) * 100 : 0;
    
    return {
      totalOrders,
      totalQuantity,
      completedQuantity,
      inProgressQuantity,
      completionRate,
      stageBreakdown,
    };
  }, [jobOrders]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Quantity</p>
              <p className="text-2xl font-bold">{stats.totalQuantity.toLocaleString()} kg</p>
            </div>
            <Weight className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{stats.completedQuantity.toLocaleString()} kg</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
          <Progress value={stats.completionRate} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

// Stage-specific Job Order Display Component
const StageJobOrderTable = ({ 
  jobOrders, 
  stage, 
  searchTerm, 
  customerFilter 
}: { 
  jobOrders: JobOrderWithDetails[]; 
  stage: string;
  searchTerm: string;
  customerFilter: string;
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const filteredOrders = useMemo(() => {
    let filtered = jobOrders.filter(jo => {
      if (stage === 'all') return true;
      return jo.currentStage === stage;
    });

    if (searchTerm) {
      filtered = filtered.filter(jo =>
        jo.orderId.toString().includes(searchTerm) ||
        jo.id.toString().includes(searchTerm) ||
        jo.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (customerFilter && customerFilter !== 'all') {
      filtered = filtered.filter(jo =>
        jo.customer?.name.toLowerCase().includes(customerFilter.toLowerCase())
      );
    }

    return filtered;
  }, [jobOrders, stage, searchTerm, customerFilter]);

  const getStageIcon = (currentStage: string) => {
    switch (currentStage) {
      case 'extrusion': return <Zap className="h-4 w-4 text-green-600" />;
      case 'printing': return <Printer className="h-4 w-4 text-red-600" />;
      case 'cutting': return <Scissors className="h-4 w-4 text-yellow-600" />;
      default: return <Factory className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStageColor = (currentStage: string) => {
    switch (currentStage) {
      case 'extrusion': return 'bg-green-100 text-green-800 border-green-200';
      case 'printing': return 'bg-red-100 text-red-800 border-red-200';
      case 'cutting': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {filteredOrders.map((jobOrder) => (
          <Card key={jobOrder.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold">#{jobOrder.orderId}</span>
                  <Badge variant="outline" className="text-xs">JO-{jobOrder.id}</Badge>
                </div>
                <Badge className={`${getStageColor(jobOrder.currentStage || '')} border`}>
                  {getStageIcon(jobOrder.currentStage || '')}
                  <span className="ml-1 capitalize">{jobOrder.currentStage}</span>
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{jobOrder.customer?.name || 'Unknown'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Factory className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{jobOrder.item?.name || 'Unknown'}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-gray-500">Total Quantity</p>
                    <p className="font-semibold">{jobOrder.quantity.toLocaleString()} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Remaining</p>
                    <p className="font-semibold text-red-600">{(jobOrder.remainingQty || 0).toLocaleString()} kg</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{(jobOrder.completionPercentage || 0).toFixed(1)}%</span>
                  </div>
                  <Progress value={jobOrder.completionPercentage || 0} className="h-2" />
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <div className="text-center">
                    <p className="text-gray-500">Extrusion</p>
                    <p className="font-semibold text-green-600">{(jobOrder.extrusionQty || 0).toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Printing</p>
                    <p className="font-semibold text-red-600">{(jobOrder.printingQty || 0).toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Cutting</p>
                    <p className="font-semibold text-yellow-600">{(jobOrder.cuttingQty || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No job orders found for this stage</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>JO ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead className="text-right">Total Qty</TableHead>
            <TableHead className="text-right">Extrusion</TableHead>
            <TableHead className="text-right">Printing</TableHead>
            <TableHead className="text-right">Cutting</TableHead>
            <TableHead className="text-right">Remaining</TableHead>
            <TableHead className="text-center">Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((jobOrder) => (
            <TableRow key={jobOrder.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">#{jobOrder.orderId}</TableCell>
              <TableCell>
                <Badge variant="outline">JO-{jobOrder.id}</Badge>
              </TableCell>
              <TableCell>{jobOrder.customer?.name || 'Unknown'}</TableCell>
              <TableCell>{jobOrder.item?.name || 'Unknown'}</TableCell>
              <TableCell>
                <Badge className={`${getStageColor(jobOrder.currentStage || '')} border`}>
                  {getStageIcon(jobOrder.currentStage || '')}
                  <span className="ml-1 capitalize">{jobOrder.currentStage}</span>
                </Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {jobOrder.quantity.toLocaleString()} kg
              </TableCell>
              <TableCell className="text-right text-green-600 font-medium">
                {(jobOrder.extrusionQty || 0).toLocaleString()} kg
              </TableCell>
              <TableCell className="text-right text-red-600 font-medium">
                {(jobOrder.printingQty || 0).toLocaleString()} kg
              </TableCell>
              <TableCell className="text-right text-yellow-600 font-medium">
                {(jobOrder.cuttingQty || 0).toLocaleString()} kg
              </TableCell>
              <TableCell className="text-right text-orange-600 font-semibold">
                {(jobOrder.remainingQty || 0).toLocaleString()} kg
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center gap-2">
                  <Progress value={jobOrder.completionPercentage || 0} className="w-16 h-2" />
                  <span className="text-xs text-gray-500 min-w-[40px]">
                    {(jobOrder.completionPercentage || 0).toFixed(1)}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {filteredOrders.length === 0 && (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No job orders found for this stage</p>
        </div>
      )}
    </div>
  );
};

export default function JobOrdersMonitorPage() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();

  const [searchTerm, setSearchTerm] = useState("");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch required data
  const { data: jobOrders = [], isLoading: jobOrdersLoading } = useQuery<JobOrder[]>({
    queryKey: ["/api/job-orders"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: customerProducts = [] } = useQuery<CustomerProduct[]>({
    queryKey: ["/api/customer-products"],
  });

  const { data: items = [] } = useQuery<Item[]>({
    queryKey: ["/api/items"],
  });

  const { data: masterBatches = [] } = useQuery<MasterBatch[]>({
    queryKey: ["/api/master-batches"],
  });

  // Fetch rolls for each stage
  const { data: extrusionRolls = [] } = useQuery<Roll[]>({
    queryKey: ["/api/rolls/stage/extrusion"],
  });

  const { data: printingRolls = [] } = useQuery<Roll[]>({
    queryKey: ["/api/rolls/stage/printing"],
  });

  const { data: cuttingRolls = [] } = useQuery<Roll[]>({
    queryKey: ["/api/rolls/stage/cutting"],
  });

  // Process job orders with quantity calculations
  const processedJobOrders = useMemo((): JobOrderWithDetails[] => {
    return jobOrders
      .map((jo): JobOrderWithDetails => {
        const order = orders.find((o) => o.id === jo.orderId);
        const customerProduct = customerProducts.find(
          (cp) => cp.id === jo.customerProductId,
        );
        const customer = customers.find(
          (c) => c.id === (jo.customerId || customerProduct?.customerId),
        );
        const item = items.find((i) => i.id === customerProduct?.itemId);
        const masterBatch = masterBatches.find(
          (mb) => mb.id === customerProduct?.masterBatchId,
        );

        // Calculate quantities from rolls
        const jobRolls = [
          ...extrusionRolls.filter(r => r.jobOrderId === jo.id),
          ...printingRolls.filter(r => r.jobOrderId === jo.id),
          ...cuttingRolls.filter(r => r.jobOrderId === jo.id),
        ];

        const extrusionQty = extrusionRolls
          .filter(r => r.jobOrderId === jo.id)
          .reduce((sum, r) => sum + (r.extrudingQty || 0), 0);

        const printingQty = printingRolls
          .filter(r => r.jobOrderId === jo.id)
          .reduce((sum, r) => sum + (r.printingQty || 0), 0);

        const cuttingQty = cuttingRolls
          .filter(r => r.jobOrderId === jo.id)
          .reduce((sum, r) => sum + (r.cuttingQty || 0), 0);

        const totalProcessed = Math.max(extrusionQty, printingQty, cuttingQty);
        const remainingQty = Math.max(0, jo.quantity - cuttingQty);
        const completionPercentage = jo.quantity > 0 ? (cuttingQty / jo.quantity) * 100 : 0;

        // Determine current stage based on quantities
        let currentStage = 'extrusion';
        if (cuttingQty > 0) currentStage = 'cutting';
        else if (printingQty > 0) currentStage = 'printing';
        else if (extrusionQty > 0) currentStage = 'extrusion';

        return {
          ...jo,
          order,
          customer,
          customerProduct,
          item,
          masterBatch,
          rolls: jobRolls,
          extrusionQty,
          printingQty,
          cuttingQty,
          remainingQty,
          completionPercentage,
          currentStage,
        };
      })
      .filter((jo) => jo.order?.status === "processing");
  }, [
    jobOrders,
    orders,
    customers,
    customerProducts,
    items,
    masterBatches,
    extrusionRolls,
    printingRolls,
    cuttingRolls,
  ]);

  // Get unique customers for filter
  const uniqueCustomers = useMemo(() => {
    const customerNames = processedJobOrders
      .map((jo) => jo.customer?.name)
      .filter(Boolean)
      .filter((name, index, arr) => arr.indexOf(name) === index);
    return customerNames.sort();
  }, [processedJobOrders]);

  if (jobOrdersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="mt-2 text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Job Orders Monitor
            </h1>
            <p className="text-muted-foreground">
              Real-time monitoring of job order quantities across production stages
            </p>
          </div>
          <Button variant="outline" size="sm" className="w-fit">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <ProductionStats jobOrders={processedJobOrders} />

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Orders</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Order #, JO ID, or Customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Customer Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer</label>
              <Select value={customerFilter} onValueChange={setCustomerFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {uniqueCustomers.map((customerName) => (
                    <SelectItem key={customerName} value={customerName!}>
                      {customerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Production Stage Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Production Stages
          </CardTitle>
          <CardDescription>
            Monitor job orders by production stage with detailed quantity tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                All Orders
              </TabsTrigger>
              <TabsTrigger value="extrusion" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Extrusion
              </TabsTrigger>
              <TabsTrigger value="printing" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Printing
              </TabsTrigger>
              <TabsTrigger value="cutting" className="flex items-center gap-2">
                <Scissors className="h-4 w-4" />
                Cutting
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <StageJobOrderTable
                jobOrders={processedJobOrders}
                stage="all"
                searchTerm={searchTerm}
                customerFilter={customerFilter}
              />
            </TabsContent>

            <TabsContent value="extrusion" className="mt-6">
              <StageJobOrderTable
                jobOrders={processedJobOrders}
                stage="extrusion"
                searchTerm={searchTerm}
                customerFilter={customerFilter}
              />
            </TabsContent>

            <TabsContent value="printing" className="mt-6">
              <StageJobOrderTable
                jobOrders={processedJobOrders}
                stage="printing"
                searchTerm={searchTerm}
                customerFilter={customerFilter}
              />
            </TabsContent>

            <TabsContent value="cutting" className="mt-6">
              <StageJobOrderTable
                jobOrders={processedJobOrders}
                stage="cutting"
                searchTerm={searchTerm}
                customerFilter={customerFilter}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}