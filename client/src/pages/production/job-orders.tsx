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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckSquare,
  Square,
  Package,
  Factory,
  Users,
  Layers,
  Hash,
  Grid3x3,
  Ruler,
  Weight,
  RefreshCw,
} from "lucide-react";
import type {
  JobOrder,
  Order,
  Customer,
  CustomerProduct,
  Item,
  MasterBatch,
} from "shared/schema";

type SortField = "orderId" | "id" | "customerName" | "productName" | "quantity";
type SortDirection = "asc" | "desc";

interface JobOrderWithDetails extends JobOrder {
  order?: Order;
  customer?: Customer;
  customerProduct?: CustomerProduct;
  item?: Item;
  masterBatch?: MasterBatch;
}

// Mobile-optimized Job Order Card Component
const JobOrderCard = ({ 
  jobOrder, 
  onSelect, 
  isSelected 
}: { 
  jobOrder: JobOrderWithDetails; 
  onSelect: (id: number) => void; 
  isSelected: boolean; 
}) => {
  const { t } = useTranslation();
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white hover:bg-gray-50/50">
      <CardContent className="p-0">
        <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onSelect(jobOrder.id)}
                className="flex-shrink-0"
              />
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="h-3 w-3 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">#{jobOrder.orderId}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Grid3x3 className="h-3 w-3 text-gray-500" />
                    <Badge variant="outline" className="text-xs">JO-{jobOrder.id}</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Badge variant="default" className="bg-blue-600 text-white">
                {t("job_orders.for_production")}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="p-3 sm:p-4 space-y-3">
          {/* Customer */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-medium text-sm sm:text-base truncate">
                {jobOrder.customer?.name || t("common.unknown")}
              </p>
            </div>
          </div>
          
          {/* Product */}
          <div className="flex items-center gap-2">
            <Factory className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 text-sm sm:text-base truncate">
                {jobOrder.item?.name || t("common.unknown")}
              </p>
            </div>
          </div>
          
          {/* Size and Material Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Size</p>
                <p className="text-sm font-medium truncate">
                  {jobOrder.customerProduct?.sizeCaption || "-"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Material</p>
                <p className="text-sm font-medium truncate">
                  {jobOrder.customerProduct?.rawMaterial || "-"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Batch and Quantity Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Batch</p>
                <Badge variant="secondary" className="text-xs">
                  {jobOrder.masterBatch?.name || "-"}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Weight className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Quantity</p>
                <p className="text-sm font-bold text-blue-600">
                  {jobOrder.quantity.toLocaleString()} kg
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function JobOrdersPage() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();

  const [searchTerm, setSearchTerm] = useState("");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [materialFilter, setMaterialFilter] = useState("all");
  const [masterbatchFilter, setMasterbatchFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("orderId");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedJobOrders, setSelectedJobOrders] = useState<Set<number>>(
    new Set(),
  );

  // Fetch required data
  const { data: jobOrders = [], isLoading: jobOrdersLoading } = useQuery<
    JobOrder[]
  >({
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

  // Filter job orders for "For Production" status orders only
  const productionJobOrders = useMemo(() => {
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

        return {
          ...jo,
          order,
          customer,
          customerProduct,
          item,
          masterBatch,
        };
      })
      .filter((jo) => jo.order?.status === "processing");
  }, [jobOrders, orders, customers, customerProducts, items, masterBatches]);

  // Apply filters and sorting
  const filteredAndSortedJobOrders = useMemo(() => {
    let filtered = productionJobOrders;

    // Apply search filter (Order No)
    if (searchTerm) {
      filtered = filtered.filter(
        (jo) =>
          jo.orderId.toString().includes(searchTerm.toLowerCase()) ||
          jo.id.toString().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply customer filter
    if (customerFilter && customerFilter !== "all") {
      filtered = filtered.filter((jo) =>
        jo.customer?.name.toLowerCase().includes(customerFilter.toLowerCase()),
      );
    }

    // Apply material filter
    if (materialFilter && materialFilter !== "all") {
      filtered = filtered.filter(
        (jo) =>
          jo.customerProduct?.rawMaterial?.toLowerCase() ===
          materialFilter.toLowerCase(),
      );
    }

    // Apply masterbatch filter
    if (masterbatchFilter && masterbatchFilter !== "all") {
      filtered = filtered.filter(
        (jo) =>
          jo.masterBatch?.name?.toLowerCase() ===
          masterbatchFilter.toLowerCase(),
      );
    }

    // Apply product filter
    if (productFilter && productFilter !== "all") {
      filtered = filtered.filter(
        (jo) => jo.item?.name?.toLowerCase() === productFilter.toLowerCase(),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "orderId":
          aValue = a.orderId;
          bValue = b.orderId;
          break;
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;
        case "customerName":
          aValue = a.customer?.name || "";
          bValue = b.customer?.name || "";
          break;
        case "productName":
          aValue = a.item?.name || "";
          bValue = b.item?.name || "";
          break;
        case "quantity":
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        default:
          aValue = a.orderId;
          bValue = b.orderId;
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [
    productionJobOrders,
    searchTerm,
    customerFilter,
    materialFilter,
    masterbatchFilter,
    productFilter,
    sortField,
    sortDirection,
  ]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle selection
  const handleSelectAll = () => {
    if (selectedJobOrders.size === filteredAndSortedJobOrders.length) {
      setSelectedJobOrders(new Set());
    } else {
      setSelectedJobOrders(
        new Set(filteredAndSortedJobOrders.map((jo) => jo.id)),
      );
    }
  };

  const handleSelectJobOrder = (jobOrderId: number) => {
    const newSelected = new Set(selectedJobOrders);
    if (newSelected.has(jobOrderId)) {
      newSelected.delete(jobOrderId);
    } else {
      newSelected.add(jobOrderId);
    }
    setSelectedJobOrders(newSelected);
  };

  // Get unique values for filters
  const uniqueCustomers = useMemo(() => {
    const customerNames = productionJobOrders
      .map((jo) => jo.customer?.name)
      .filter(Boolean)
      .filter((name, index, arr) => arr.indexOf(name) === index);
    return customerNames.sort();
  }, [productionJobOrders]);

  const uniqueMaterials = useMemo(() => {
    const materialNames = productionJobOrders
      .map((jo) => jo.customerProduct?.rawMaterial)
      .filter(Boolean)
      .filter((name, index, arr) => arr.indexOf(name) === index);
    return materialNames.sort();
  }, [productionJobOrders]);

  const uniqueMasterBatches = useMemo(() => {
    const mbNames = productionJobOrders
      .map((jo) => jo.masterBatch?.name)
      .filter(Boolean)
      .filter((name, index, arr) => arr.indexOf(name) === index);
    return mbNames.sort();
  }, [productionJobOrders]);

  const uniqueProducts = useMemo(() => {
    const productNames = productionJobOrders
      .map((jo) => jo.item?.name)
      .filter(Boolean)
      .filter((name, index, arr) => arr.indexOf(name) === index);
    return productNames.sort();
  }, [productionJobOrders]);

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 data-[state=open]:bg-accent pl-[0px] pr-[0px]"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

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
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              {t("job_orders.title")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t(
                "job_orders.description",
                "Manage job orders for production scheduling and tracking",
              )}
            </p>
          </div>

          {selectedJobOrders.size > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 justify-center">
                {selectedJobOrders.size} {t("common.selected")}
              </Badge>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                {t("common.actions")}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filters - Mobile Optimized */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            {t("common.filters")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Row */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("orders.order_no")}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("common.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Customer Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("setup.customers.name")}
              </label>
              <Select value={customerFilter} onValueChange={setCustomerFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t("common.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  {uniqueCustomers.map((customer) => (
                    <SelectItem key={customer} value={customer || "unknown"}>
                      {customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Materials Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("orders.material")}
              </label>
              <Select value={materialFilter} onValueChange={setMaterialFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t("common.all")}>
                    {materialFilter === "all"
                      ? t("common.all")
                      : materialFilter}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  {uniqueMaterials.map((material) => (
                    <SelectItem key={material} value={material || "unknown"}>
                      {material}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Master Batch Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("common.batch")}</label>
              <Select
                value={masterbatchFilter}
                onValueChange={setMasterbatchFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("common.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  {uniqueMasterBatches.map((mb) => (
                    <SelectItem key={mb} value={mb || "unknown"}>
                      {mb}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Product Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("orders.product")}
              </label>
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t("common.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  {uniqueProducts.map((product) => (
                    <SelectItem key={product} value={product || "unknown"}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm ||
            customerFilter !== "all" ||
            materialFilter !== "all" ||
            masterbatchFilter !== "all" ||
            productFilter !== "all") && (
            <div className="flex justify-center sm:justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setCustomerFilter("all");
                  setMaterialFilter("all");
                  setMasterbatchFilter("all");
                  setProductFilter("all");
                }}
                className="w-full sm:w-auto"
              >
                {t("common.clear_filters")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Orders Display */}
      <div className="space-y-4">
        {/* Header with selection controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">
                {t("job_orders.for_production")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedJobOrders.length} {t("common.total_records")}
              </p>
            </div>
          </div>
          
          {/* Select All Controls */}
          {filteredAndSortedJobOrders.length > 0 && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Checkbox
                checked={
                  selectedJobOrders.size === filteredAndSortedJobOrders.length &&
                  filteredAndSortedJobOrders.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <label className="text-sm font-medium cursor-pointer" onClick={handleSelectAll}>
                {t("common.select_all")}
              </label>
            </div>
          )}
        </div>
        
        {/* Job Orders Grid */}
        {filteredAndSortedJobOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 sm:py-16">
              <div className="text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t("job_orders.no_production_orders")}
                </h3>
                <p className="text-gray-600">
                  {t("job_orders.no_production_orders_description", "No job orders found for production")}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {/* Desktop Table - Hidden on mobile */}
            <div className="hidden lg:block">
              <Card>
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={
                                selectedJobOrders.size ===
                                  filteredAndSortedJobOrders.length &&
                                filteredAndSortedJobOrders.length > 0
                              }
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                          <TableHead className="pl-[0px] pr-[0px]">
                            <SortButton field="orderId">
                              {t("orders.order_id")}
                            </SortButton>
                          </TableHead>
                          <TableHead>
                            <SortButton field="id">{t("job_orders.jo_id")}</SortButton>
                          </TableHead>
                          <TableHead>
                            <SortButton field="customerName">
                              {t("setup.customers.name")}
                            </SortButton>
                          </TableHead>
                          <TableHead>
                            <SortButton field="productName">
                              {t("orders.product")}
                            </SortButton>
                          </TableHead>
                          <TableHead>{t("orders.size")}</TableHead>
                          <TableHead>{t("orders.material")}</TableHead>
                          <TableHead>{t("common.batch")}</TableHead>
                          <TableHead>
                            <SortButton field="quantity">
                              {t("job_orders.jo_qty")}
                            </SortButton>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAndSortedJobOrders.map((jobOrder) => (
                          <TableRow key={jobOrder.id} className="hover:bg-muted/50">
                            <TableCell>
                              <Checkbox
                                checked={selectedJobOrders.has(jobOrder.id)}
                                onCheckedChange={() =>
                                  handleSelectJobOrder(jobOrder.id)
                                }
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              #{jobOrder.orderId}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">JO-{jobOrder.id}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {jobOrder.customer?.name || t("common.unknown")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Factory className="h-4 w-4 text-muted-foreground" />
                                {jobOrder.item?.name || t("common.unknown")}
                              </div>
                            </TableCell>
                            <TableCell>
                              {jobOrder.customerProduct?.sizeCaption || "-"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                {jobOrder.customerProduct?.rawMaterial || "-"}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary">
                                {jobOrder.masterBatch?.name || "-"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {jobOrder.quantity.toLocaleString()} kg
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Mobile Cards - Hidden on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-3 sm:gap-4">
              {filteredAndSortedJobOrders.map((jobOrder) => (
                <JobOrderCard
                  key={jobOrder.id}
                  jobOrder={jobOrder}
                  onSelect={handleSelectJobOrder}
                  isSelected={selectedJobOrders.has(jobOrder.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
