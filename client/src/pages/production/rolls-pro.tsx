import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { API_ENDPOINTS } from "@/lib/constants";
import { Roll, JobOrder, Customer, CustomerProduct, Item, User } from "@shared/schema";
import { 
  Package, 
  Clock, 
  PlayCircle, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Filter,
  FileText,
  User as UserIcon,
  Calendar,
  Target,
  Layers
} from "lucide-react";

// Status configuration with colors and icons
const STATUS_CONFIG = {
  pending: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
    label: "Pending"
  },
  processing: {
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: PlayCircle,
    label: "Processing"
  },
  completed: {
    color: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircle,
    label: "Completed"
  },
  hold: {
    color: "bg-orange-100 text-orange-800 border-orange-300",
    icon: AlertCircle,
    label: "On Hold"
  }
};

// Stage configuration with colors and icons
const STAGE_CONFIG = {
  extrusion: {
    color: "bg-green-100 text-green-800 border-green-300",
    icon: Layers,
    label: "Extrusion"
  },
  printing: {
    color: "bg-red-100 text-red-800 border-red-300",
    icon: FileText,
    label: "Printing"
  },
  cutting: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Target,
    label: "Cutting"
  },
  completed: {
    color: "bg-gray-100 text-gray-800 border-gray-300",
    icon: CheckCircle,
    label: "Completed"
  }
};

interface RollCardProps {
  roll: Roll;
  jobOrder?: JobOrder;
  customer?: Customer;
  customerProduct?: CustomerProduct;
  item?: Item;
  users: User[];
}

function RollCard({ roll, jobOrder, customer, customerProduct, item, users }: RollCardProps) {
  // Helper function to get user name by ID
  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user?.firstName || userId;
  };
  const { t } = useTranslation();
  const statusConfig = STATUS_CONFIG[roll.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
  const stageConfig = STAGE_CONFIG[roll.currentStage as keyof typeof STAGE_CONFIG] || STAGE_CONFIG.extrusion;
  const StatusIcon = statusConfig.icon;
  const StageIcon = stageConfig.icon;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900">
              {customer?.name || `Customer ID: ${jobOrder?.customerId || customerProduct?.customerId || "Unknown"}`}
            </h3>
            {customer?.nameAr && (
              <p className="text-sm text-gray-600">{customer.nameAr}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Badge className={`${statusConfig.color} text-xs border inline-flex items-center gap-1`}>
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </Badge>
            <Badge className={`${stageConfig.color} text-xs border inline-flex items-center gap-1`}>
              <StageIcon className="h-3 w-3" />
              {stageConfig.label}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Roll #{roll.serialNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span>JO #{jobOrder?.id || roll.jobOrderId}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-500" />
              <span>Order #{jobOrder?.orderId}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <span className="font-medium">Product:</span>
              <p className="text-gray-600 text-xs">{item?.name || customerProduct?.itemId}</p>
            </div>
            <div>
              <span className="font-medium">Size:</span>
              <p className="text-gray-600 text-xs">{customerProduct?.sizeCaption || "N/A"}</p>
            </div>
            <div>
              <span className="font-medium">Quantity:</span>
              <p className="text-gray-600 text-xs">
                {roll.currentStage === "extrusion"
                  ? `${roll.extrudingQty || 0} Kg`
                  : roll.currentStage === "printing"
                  ? `${roll.printingQty || 0} Kg`
                  : `${roll.cuttingQty || 0} Kg`}
              </p>
            </div>
          </div>
        </div>

        {/* Operator information */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Operators
          </h4>
          <div className="space-y-1 text-xs text-gray-600">
            {roll.createdById && (
              <p>Extruded by: {getUserName(roll.createdById)}</p>
            )}
            {roll.printedById && (
              <p>Printed by: {getUserName(roll.printedById)}</p>
            )}
            {roll.cutById && (
              <p>Cut by: {getUserName(roll.cutById)}</p>
            )}
          </div>
        </div>

        {/* Timestamps */}
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Created: {new Date(roll.createdAt).toLocaleDateString()}</span>
          </div>
          {roll.wasteQty && roll.wasteQty > 0 && (
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span className="text-red-600">Waste: {roll.wasteQty}kg ({roll.wastePercentage}%)</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function RollsProPage() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch all rolls
  const { data: allRolls = [], isLoading } = useQuery<Roll[]>({
    queryKey: [API_ENDPOINTS.ROLLS],
  });

  // Fetch supporting data
  const { data: jobOrders = [] } = useQuery<JobOrder[]>({
    queryKey: [API_ENDPOINTS.JOB_ORDERS],
  });

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: [API_ENDPOINTS.CUSTOMERS],
  });

  const { data: customerProducts = [] } = useQuery<CustomerProduct[]>({
    queryKey: [API_ENDPOINTS.CUSTOMER_PRODUCTS],
  });

  const { data: items = [] } = useQuery<Item[]>({
    queryKey: [API_ENDPOINTS.ITEMS],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: [API_ENDPOINTS.USERS],
  });

  // Filter rolls based on search and filters
  const filteredRolls = allRolls.filter(roll => {
    const matchesSearch = searchTerm === "" || 
      roll.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roll.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roll.jobOrderId.toString().includes(searchTerm);

    const matchesStatus = statusFilter === "all" || roll.status === statusFilter;
    const matchesStage = stageFilter === "all" || roll.currentStage === stageFilter;
    const matchesTab = activeTab === "all" || roll.currentStage === activeTab;

    return matchesSearch && matchesStatus && matchesStage && matchesTab;
  });

  // Get enhanced data for rolls
  const enrichedRolls = filteredRolls.map(roll => {
    const jobOrder = jobOrders.find(jo => jo.id === roll.jobOrderId);
    const customerProduct = customerProducts.find(cp => cp.id === jobOrder?.customerProductId);
    
    // Try to find customer by different possible ID fields
    const customer = customers.find(c => 
      c.id === jobOrder?.customerId || 
      c.id === customerProduct?.customerId
    );
    const item = items.find(i => i.id === customerProduct?.itemId);
    const user = users.find(u => u.id === roll.createdById);

    // Debug: Log data structure for troubleshooting
    if (process.env.NODE_ENV === 'development' && !customer && jobOrder) {
      console.log('Missing customer for roll:', roll.id);
      console.log('JobOrder customerId:', jobOrder.customerId);
      console.log('CustomerProduct customerId:', customerProduct?.customerId);
    }

    return {
      roll,
      jobOrder,
      customer,
      customerProduct,
      item,
      user
    };
  });

  // Statistics
  const stats = {
    total: allRolls.length,
    pending: allRolls.filter(r => r.status === "pending").length,
    processing: allRolls.filter(r => r.status === "processing").length,
    completed: allRolls.filter(r => r.status === "completed").length,
    extrusion: allRolls.filter(r => r.currentStage === "extrusion").length,
    printing: allRolls.filter(r => r.currentStage === "printing").length,
    cutting: allRolls.filter(r => r.currentStage === "cutting").length,
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rolls Production</h1>
          <p className="text-gray-600">Monitor and track production rolls across workflow stages</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Rolls</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
            <div className="text-sm text-gray-600">Processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.extrusion}</div>
            <div className="text-sm text-gray-600">Extrusion</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.printing}</div>
            <div className="text-sm text-gray-600">Printing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.cutting}</div>
            <div className="text-sm text-gray-600">Cutting</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search rolls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="extrusion">Extrusion</SelectItem>
                <SelectItem value="printing">Printing</SelectItem>
                <SelectItem value="cutting">Cutting</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setStageFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for workflow stages */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b">
              <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
                <TabsTrigger 
                  value="all" 
                  className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-blue-500 data-[state=active]:bg-transparent"
                >
                  All ({stats.total})
                </TabsTrigger>
                <TabsTrigger 
                  value="extrusion"
                  className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-green-500 data-[state=active]:bg-transparent"
                >
                  Extrusion ({stats.extrusion})
                </TabsTrigger>
                <TabsTrigger 
                  value="printing"
                  className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-red-500 data-[state=active]:bg-transparent"
                >
                  Printing ({stats.printing})
                </TabsTrigger>
                <TabsTrigger 
                  value="cutting"
                  className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-yellow-500 data-[state=active]:bg-transparent"
                >
                  Cutting ({stats.cutting})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">All Rolls ({enrichedRolls.length})</h3>
                </div>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded mb-4"></div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : enrichedRolls.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {enrichedRolls.map(({ roll, jobOrder, customer, customerProduct, item, user }) => (
                      <RollCard
                        key={roll.id}
                        roll={roll}
                        jobOrder={jobOrder}
                        customer={customer}
                        customerProduct={customerProduct}
                        item={item}
                        users={users}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No rolls found matching your criteria</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="extrusion" className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Extrusion Stage ({enrichedRolls.length})</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enrichedRolls.map(({ roll, jobOrder, customer, customerProduct, item, user }) => (
                    <RollCard
                      key={roll.id}
                      roll={roll}
                      jobOrder={jobOrder}
                      customer={customer}
                      customerProduct={customerProduct}
                      item={item}
                      users={users}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="printing" className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Printing Stage ({enrichedRolls.length})</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enrichedRolls.map(({ roll, jobOrder, customer, customerProduct, item, user }) => (
                    <RollCard
                      key={roll.id}
                      roll={roll}
                      jobOrder={jobOrder}
                      customer={customer}
                      customerProduct={customerProduct}
                      item={item}
                      users={users}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cutting" className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Cutting Stage ({enrichedRolls.length})</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enrichedRolls.map(({ roll, jobOrder, customer, customerProduct, item, user }) => (
                    <RollCard
                      key={roll.id}
                      roll={roll}
                      jobOrder={jobOrder}
                      customer={customer}
                      customerProduct={customerProduct}
                      item={item}
                      users={users}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}