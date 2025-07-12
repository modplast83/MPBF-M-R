import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Calculator, Eye, Printer, Factory, FlaskConical, Users, Package, Beaker, CheckCircle, AlertCircle, Filter, Search, BarChart3, Layers, Hash, Weight, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { generatePrintDocument } from "@/components/common/print-header";

interface JobOrder {
  id: number;
  orderId: number;
  quantity: number;
  status: string;
  customerId?: string;
  customerProductId: number;
}

interface AbaFormula {
  id: number;
  name: string;
  description?: string;
  aToB: number;
  abRatio: string;
  materials: any[];
}

interface JoMix {
  id: number;
  mixNumber: string;
  totalQuantity: number;
  screwType: string;
  status: string;
  formulaName: string;
  createdAt: string;
  items: any[];
  materials: any[];
}

interface JoMixData {
  abaFormulaId: number;
  jobOrderIds: number[];
  jobOrderQuantities: number[];
}

export default function JoMixPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedJobOrders, setSelectedJobOrders] = useState<Set<number>>(
    new Set(),
  );
  const [selectedFormula, setSelectedFormula] = useState<number | null>(null);
  const [jobOrderQuantities, setJobOrderQuantities] = useState<
    Record<number, number>
  >({});
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingMix, setViewingMix] = useState<JoMix | null>(null);

  // Table filtering and sorting state
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterCustomer, setFilterCustomer] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMaterial, setFilterMaterial] = useState<string>("all");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch JO mixes
  const { data: joMixes = [], isLoading: loadingMixes } = useQuery<JoMix[]>({
    queryKey: ["/api/jo-mixes"],
  });

  // Fetch job orders
  const { data: jobOrders = [], isLoading: loadingJobOrders } = useQuery<
    JobOrder[]
  >({
    queryKey: ["/api/job-orders"],
  });

  // Fetch ABA formulas
  const { data: abaFormulas = [], isLoading: loadingFormulas } = useQuery<
    AbaFormula[]
  >({
    queryKey: ["/api/aba-formulas"],
  });

  // Fetch additional data for enhanced display
  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { data: customerProducts = [] } = useQuery({
    queryKey: ["/api/customer-products"],
  });

  const { data: items = [] } = useQuery({
    queryKey: ["/api/items"],
  });

  const { data: masterBatches = [] } = useQuery({
    queryKey: ["/api/master-batches"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Create JO mix mutation
  const createJoMixMutation = useMutation({
    mutationFn: async (data: JoMixData) => {
      return apiRequest("POST", "/api/jo-mixes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jo-mixes"] });
      toast({
        title: "Success",
        description: "JO Mix created successfully",
      });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create JO Mix",
        variant: "destructive",
      });
    },
  });

  // Update mix status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PUT", `/api/jo-mixes/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jo-mixes"] });
      toast({
        title: "Success",
        description: "Mix status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update mix status",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedJobOrders(new Set());
    setSelectedFormula(null);
    setJobOrderQuantities({});
  };

  const handleJobOrderSelection = (jobOrderId: number, checked: boolean) => {
    const newSelected = new Set(selectedJobOrders);
    if (checked) {
      newSelected.add(jobOrderId);
      // Set default quantity to job order quantity
      const jobOrder = jobOrders.find((jo) => jo.id === jobOrderId);
      if (jobOrder) {
        setJobOrderQuantities((prev) => ({
          ...prev,
          [jobOrderId]: jobOrder.quantity,
        }));
      }
    } else {
      newSelected.delete(jobOrderId);
      setJobOrderQuantities((prev) => {
        const updated = { ...prev };
        delete updated[jobOrderId];
        return updated;
      });
    }
    setSelectedJobOrders(newSelected);
  };

  const handleQuantityChange = (jobOrderId: number, quantity: number) => {
    setJobOrderQuantities((prev) => ({
      ...prev,
      [jobOrderId]: quantity,
    }));
  };

  const handleCreateMix = () => {
    if (!selectedFormula) {
      toast({
        title: "Error",
        description: "Please select an ABA formula",
        variant: "destructive",
      });
      return;
    }

    if (selectedJobOrders.size === 0) {
      toast({
        title: "Error",
        description: "Please select at least one job order",
        variant: "destructive",
      });
      return;
    }

    const jobOrderIds = Array.from(selectedJobOrders);
    const quantities = jobOrderIds.map((id) => jobOrderQuantities[id] || 0);

    if (quantities.some((q) => q <= 0)) {
      toast({
        title: "Error",
        description: "All quantities must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    createJoMixMutation.mutate({
      abaFormulaId: selectedFormula,
      jobOrderIds,
      jobOrderQuantities: quantities,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "in_progress":
        return <Badge variant="default">In Progress</Badge>;
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Completed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handlePrintMix = (mix: JoMix) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>JO Mix Report - ${mix.mixNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .print-header { 
              display: flex; 
              align-items: center; 
              justify-content: space-between; 
              margin-bottom: 30px; 
              padding-bottom: 20px; 
              border-bottom: 3px solid #065f46; 
            }
            .company-logo { 
              width: 80px; 
              height: 80px; 
              object-fit: contain; 
            }
            .company-info { 
              text-align: center; 
              flex: 1; 
            }
            .company-name-en { 
              font-size: 24px; 
              font-weight: bold; 
              color: #065f46; 
              margin: 0; 
            }
            .company-name-ar { 
              font-size: 18px; 
              color: #059669; 
              margin: 5px 0 0 0; 
              font-family: 'Arial', sans-serif; 
            }
            .report-title { 
              font-size: 20px; 
              color: #065f46; 
              margin: 15px 0 0 0; 
              font-weight: bold; 
            }
            .section { margin-bottom: 25px; }
            .section h3 { 
              background: linear-gradient(135deg, #065f46, #059669); 
              color: white; 
              padding: 12px; 
              margin: 0 0 15px 0; 
              border-radius: 5px; 
              font-size: 16px; 
            }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
            th { 
              background: linear-gradient(135deg, #f0fdf4, #ecfdf5); 
              font-weight: bold; 
              color: #065f46; 
            }
            tr:nth-child(even) { background-color: #f9fafb; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .info-item { 
              display: flex; 
              justify-content: space-between; 
              padding: 8px 0; 
              border-bottom: 1px solid #e5e7eb; 
            }
            .info-label { font-weight: bold; color: #065f46; }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              padding-top: 20px; 
              border-top: 2px solid #065f46; 
              font-size: 12px; 
              color: #6b7280; 
            }
            @media print { 
              body { margin: 0; } 
              .print-header { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <img src="/assets/company-logo.png" alt="Company Logo" class="company-logo" />
            <div class="company-info">
              <h1 class="company-name-en">Modern Plastic Bag Factory</h1>
              <h2 class="company-name-ar">مصنع أكياس البلاستيك الحديث</h2>
              <h3 class="report-title">JO Mix Production Report</h3>
            </div>
            <div style="width: 80px;"></div>
          </div>
          
          <div class="section">
            <h3>Mix Information</h3>
            <div class="info-grid">
              <div>
                <div class="info-item">
                  <span class="info-label">Mix Number:</span>
                  <span>${mix.mixNumber}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Total Quantity:</span>
                  <span>${mix.totalQuantity} kg</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Screw Type:</span>
                  <span>${mix.screwType}</span>
                </div>
              </div>
              <div>
                <div class="info-item">
                  <span class="info-label">Formula:</span>
                  <span>${mix.formulaName}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Status:</span>
                  <span>${mix.status.toUpperCase()}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Created:</span>
                  <span>${new Date(mix.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          ${
            mix.items && mix.items.length > 0
              ? `
          <div class="section">
            <h3>Job Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Job Order ID</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${mix.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.jobOrderId}</td>
                    <td>${item.quantity} kg</td>
                    <td>${item.status || "Pending"}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          `
              : ""
          }

          ${
            mix.materials && mix.materials.length > 0
              ? `
          <div class="section">
            <h3>Material Composition</h3>
            <table>
              <thead>
                <tr>
                  <th>Material Name</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                ${mix.materials
                  .map(
                    (material) => `
                  <tr>
                    <td>${material.materialName || "Unknown Material"}</td>
                    <td>${material.materialType || "N/A"}</td>
                    <td>${material.quantity}</td>
                    <td>${material.materialUnit || "kg"}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          `
              : ""
          }

          <div class="footer">
            <p><strong>Modern Plastic Bag Factory</strong> | مصنع أكياس البلاستيك الحديث</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>JO Mix Production Report - Mix Number: ${mix.mixNumber}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Transform job orders with additional data for display
  const enrichedJobOrders = jobOrders
    .filter((jo) => jo.status === "pending" || jo.status === "in_progress")
    .map((jo) => {
      // Find customer product information first
      const customerProduct = customerProducts?.find(
        (cp) => cp.id === jo.customerProductId,
      );

      // Find customer information using customer ID from customer product
      const customerId = jo.customerId || customerProduct?.customerId;
      const customer = customers?.find((c) => c.id === customerId);
      const customerName =
        customer?.name || customer?.nameAr || "Unknown Customer";

      // Find item information
      const item = customerProduct
        ? items?.find((i) => i.id === customerProduct.itemId)
        : null;

      // Find master batch information
      const masterBatch = customerProduct
        ? masterBatches?.find((mb) => mb.id === customerProduct.masterBatchId)
        : null;

      // Find category information for raw material
      const category = customerProduct
        ? categories?.find((cat) => cat.id === customerProduct.categoryId)
        : null;

      // Create size caption from customer product dimensions
      const sizeCaption =
        customerProduct?.sizeCaption ||
        (customerProduct?.width &&
        customerProduct?.leftF &&
        customerProduct?.rightF
          ? `${customerProduct.leftF}+${customerProduct.rightF}+${customerProduct.width}`
          : "N/A");

      return {
        ...jo,
        customerName,
        itemName: item?.name || "N/A",
        size: sizeCaption,
        masterBatch: masterBatch?.name || "N/A",
        rawMaterial: category?.name || "N/A",
      };
    });

  // Get unique values for filter options
  const uniqueCustomers = [
    ...new Set(enrichedJobOrders.map((jo) => jo.customerName).filter(Boolean)),
  ];
  const uniqueStatuses = [...new Set(enrichedJobOrders.map((jo) => jo.status))];
  const uniqueMaterials = [
    ...new Set(enrichedJobOrders.map((jo) => jo.rawMaterial).filter(Boolean)),
  ];

  // Apply filters and sorting
  const pendingJobOrders = enrichedJobOrders
    .filter((jo) => {
      // Apply filters
      if (
        filterCustomer !== "all" &&
        !jo.customerName.toLowerCase().includes(filterCustomer.toLowerCase())
      )
        return false;
      if (filterStatus !== "all" && jo.status !== filterStatus) return false;
      if (
        filterMaterial !== "all" &&
        !jo.rawMaterial.toLowerCase().includes(filterMaterial.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;
        case "orderId":
          aValue = a.orderId;
          bValue = b.orderId;
          break;
        case "customerName":
          aValue = a.customerName;
          bValue = b.customerName;
          break;
        case "masterBatch":
          aValue = a.masterBatch;
          bValue = b.masterBatch;
          break;
        case "rawMaterial":
          aValue = a.rawMaterial;
          bValue = b.rawMaterial;
          break;
        case "itemName":
          aValue = a.itemName;
          bValue = b.itemName;
          break;
        case "size":
          aValue = a.size;
          bValue = b.size;
          break;
        case "quantity":
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
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

  if (loadingMixes || loadingJobOrders || loadingFormulas) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">JO Mix</h1>
          <p className="text-muted-foreground">
            Create ABA mixing for job orders using predefined formulas
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              <FlaskConical className="h-5 w-5 mr-2" />
              Create JO Mix
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Beaker className="h-6 w-6 text-blue-600" />
                  </div>
                  Create New JO Mix
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                  Select job orders and ABA formula to create optimized material mixing batches for production.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-8">
              {/* Formula Selection Section */}
              <Card className="border-2 border-blue-100 bg-blue-50/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                    <FlaskConical className="h-5 w-5" />
                    ABA Formula Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Label htmlFor="formula" className="text-sm font-semibold text-gray-700">
                      Select Formula *
                    </Label>
                    <Select
                      value={selectedFormula?.toString() || ""}
                      onValueChange={(value) => setSelectedFormula(parseInt(value))}
                    >
                      <SelectTrigger className="h-12 bg-white border-2 border-blue-200 hover:border-blue-300 transition-colors">
                        <SelectValue placeholder="Choose an ABA formula for mixing..." />
                      </SelectTrigger>
                      <SelectContent>
                        {abaFormulas.map((formula) => (
                          <SelectItem
                            key={formula.id}
                            value={formula.id.toString()}
                            className="py-3"
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">{formula.name}</span>
                              <Badge variant="outline" className="ml-2">
                                A:B = {parseFloat(formula.abRatio.split(":")[0]).toFixed(2)}:
                                {parseFloat(formula.abRatio.split(":")[1]).toFixed(2)}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Job Orders Selection Section */}
              <Card className="border-2 border-green-100 bg-green-50/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                    <Factory className="h-5 w-5" />
                    Job Orders Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Enhanced Filters */}
                  <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <h4 className="font-medium text-gray-700">Filter Job Orders</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Customer
                        </Label>
                        <Select value={filterCustomer} onValueChange={setFilterCustomer}>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="All Customers" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Customers</SelectItem>
                            {uniqueCustomers.map((customer) => (
                              <SelectItem key={customer} value={customer}>
                                {customer}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Raw Material
                        </Label>
                        <Select value={filterMaterial} onValueChange={setFilterMaterial}>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="All Materials" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Materials</SelectItem>
                            {uniqueMaterials.map((material) => (
                              <SelectItem key={material} value={material}>
                                {material}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Status
                        </Label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="All Statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {uniqueStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Quick Filter Presets */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium text-blue-800">Quick Filters</h4>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFilterCustomer("all");
                            setFilterMaterial("all");
                            setFilterStatus("all");
                          }}
                          className="text-xs px-3 py-1.5 bg-white hover:bg-gray-50 border-gray-300"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          All Available
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFilterCustomer("all");
                            setFilterMaterial("Roll Trash Bag");
                            setFilterStatus("all");
                          }}
                          className="text-xs px-3 py-1.5 bg-green-50 hover:bg-green-100 border-green-300 text-green-700"
                        >
                          <Package className="h-3 w-3 mr-1" />
                          Trash Bags Only
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFilterCustomer("all");
                            setFilterMaterial("T-Shirt Bag");
                            setFilterStatus("all");
                          }}
                          className="text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700"
                        >
                          <Layers className="h-3 w-3 mr-1" />
                          T-Shirts Only
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFilterCustomer("all");
                            setFilterMaterial("all");
                            setFilterStatus("pending");
                          }}
                          className="text-xs px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 border-yellow-300 text-yellow-700"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending Only
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFilterCustomer("all");
                            setFilterMaterial("all");
                            setFilterStatus("all");
                            setSortField("quantity");
                            setSortDirection("desc");
                          }}
                          className="text-xs px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border-orange-300 text-orange-700"
                        >
                          <Weight className="h-3 w-3 mr-1" />
                          High Volume
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFilterCustomer("all");
                            setFilterMaterial("all");
                            setFilterStatus("all");
                            setSortField("orderId");
                            setSortDirection("desc");
                          }}
                          className="text-xs px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border-purple-300 text-purple-700"
                        >
                          <Hash className="h-3 w-3 mr-1" />
                          Latest Orders
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Job Orders Table */}
                  <div className="border rounded-lg bg-white shadow-sm">
                    <div className="p-4 border-b bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-700">Available Job Orders</span>
                        </div>
                        <Badge variant="outline" className="bg-white">
                          {pendingJobOrders.length} orders
                        </Badge>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader className="sticky top-0 bg-white shadow-sm">
                          <TableRow>
                            <TableHead className="w-12 text-center">
                              <Checkbox
                                checked={selectedJobOrders.size === pendingJobOrders.length && pendingJobOrders.length > 0}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    const newSelected = new Set(pendingJobOrders.map(jo => jo.id));
                                    setSelectedJobOrders(newSelected);
                                    const newQuantities = {};
                                    pendingJobOrders.forEach(jo => {
                                      newQuantities[jo.id] = jo.quantity;
                                    });
                                    setJobOrderQuantities(newQuantities);
                                  } else {
                                    setSelectedJobOrders(new Set());
                                    setJobOrderQuantities({});
                                  }
                                }}
                              />
                            </TableHead>
                            <TableHead className="text-center cursor-pointer hover:bg-gray-50" onClick={() => handleSort("id")}>
                              <div className="flex items-center justify-center gap-1">
                                <Hash className="h-4 w-4" />
                                JO # {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                              </div>
                            </TableHead>
                            <TableHead className="text-center cursor-pointer hover:bg-gray-50" onClick={() => handleSort("orderId")}>
                              <div className="flex items-center justify-center gap-1">
                                <Hash className="h-4 w-4" />
                                Order # {sortField === "orderId" && (sortDirection === "asc" ? "↑" : "↓")}
                              </div>
                            </TableHead>
                            <TableHead className="text-center cursor-pointer hover:bg-gray-50" onClick={() => handleSort("customerName")}>
                              <div className="flex items-center justify-center gap-1">
                                <Users className="h-4 w-4" />
                                Customer {sortField === "customerName" && (sortDirection === "asc" ? "↑" : "↓")}
                              </div>
                            </TableHead>
                            <TableHead className="text-center cursor-pointer hover:bg-gray-50" onClick={() => handleSort("masterBatch")}>
                              <div className="flex items-center justify-center gap-1">
                                <Beaker className="h-4 w-4" />
                                Master Batch {sortField === "masterBatch" && (sortDirection === "asc" ? "↑" : "↓")}
                              </div>
                            </TableHead>
                            <TableHead className="text-center cursor-pointer hover:bg-gray-50" onClick={() => handleSort("rawMaterial")}>
                              <div className="flex items-center justify-center gap-1">
                                <Package className="h-4 w-4" />
                                Raw Material {sortField === "rawMaterial" && (sortDirection === "asc" ? "↑" : "↓")}
                              </div>
                            </TableHead>
                            <TableHead className="text-center cursor-pointer hover:bg-gray-50" onClick={() => handleSort("itemName")}>
                              <div className="flex items-center justify-center gap-1">
                                <Factory className="h-4 w-4" />
                                Material {sortField === "itemName" && (sortDirection === "asc" ? "↑" : "↓")}
                              </div>
                            </TableHead>
                            <TableHead className="text-center cursor-pointer hover:bg-gray-50" onClick={() => handleSort("size")}>
                              <div className="flex items-center justify-center gap-1">
                                <Layers className="h-4 w-4" />
                                Size {sortField === "size" && (sortDirection === "asc" ? "↑" : "↓")}
                              </div>
                            </TableHead>
                            <TableHead className="text-center cursor-pointer hover:bg-gray-50" onClick={() => handleSort("quantity")}>
                              <div className="flex items-center justify-center gap-1">
                                <Weight className="h-4 w-4" />
                                Original Qty (kg) {sortField === "quantity" && (sortDirection === "asc" ? "↑" : "↓")}
                              </div>
                            </TableHead>
                            <TableHead className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Zap className="h-4 w-4" />
                                Mix Qty (kg)
                              </div>
                            </TableHead>
                            <TableHead className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                Status
                              </div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingJobOrders.map((jobOrder) => (
                            <TableRow key={jobOrder.id} className={`hover:bg-gray-50 transition-colors ${selectedJobOrders.has(jobOrder.id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}>
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={selectedJobOrders.has(jobOrder.id)}
                                  onCheckedChange={(checked) =>
                                    handleJobOrderSelection(
                                      jobOrder.id,
                                      checked as boolean,
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell className="text-center font-medium">
                                <Badge variant="outline">JO #{jobOrder.id}</Badge>
                              </TableCell>
                              <TableCell className="text-center font-medium">
                                #{jobOrder.orderId}
                              </TableCell>
                              <TableCell className="text-center">
                                {jobOrder.customerName || "N/A"}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="secondary">
                                  {jobOrder.masterBatch || "N/A"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                {jobOrder.rawMaterial || "N/A"}
                              </TableCell>
                              <TableCell className="text-center">
                                {jobOrder.itemName || "N/A"}
                              </TableCell>
                              <TableCell className="text-center">
                                {jobOrder.size || "N/A"}
                              </TableCell>
                              <TableCell className="text-center font-medium">
                                {jobOrder.quantity.toLocaleString()} kg
                              </TableCell>
                              <TableCell className="text-center">
                                {selectedJobOrders.has(jobOrder.id) ? (
                                  <Input
                                    type="number"
                                    value={jobOrderQuantities[jobOrder.id] || ""}
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        jobOrder.id,
                                        parseFloat(e.target.value) || 0,
                                      )
                                    }
                                    className="w-20 text-center bg-white border-2 border-blue-200 focus:border-blue-400"
                                    min="0"
                                    step="0.1"
                                    placeholder="0"
                                  />
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {getStatusBadge(jobOrder.status)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mix Preview Section */}
              {selectedJobOrders.size > 0 && selectedFormula && (
                <Card className="border-2 border-purple-100 bg-purple-50/30">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                      <BarChart3 className="h-5 w-5" />
                      Mix Preview & Calculations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const formula = abaFormulas.find(f => f.id === selectedFormula);
                      const totalQuantity = Array.from(selectedJobOrders).reduce(
                        (sum, id) => sum + (jobOrderQuantities[id] || 0),
                        0,
                      );
                      if (formula) {
                        const [aRatio, bRatio] = formula.abRatio.split(":").map(Number);
                        const totalRatio = aRatio + bRatio;
                        const aQuantity = (totalQuantity * aRatio) / totalRatio;
                        const bQuantity = (totalQuantity * bRatio) / totalRatio;
                        const aMixes = Math.ceil(aQuantity / 600);
                        const bMixes = Math.ceil(bQuantity / 600);

                        return (
                          <div className="bg-white p-6 rounded-lg border border-purple-200 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 text-purple-800">
                                  <FlaskConical className="h-5 w-5" />
                                  <h4 className="font-semibold">Formula Details</h4>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Formula:</span>
                                    <span className="font-medium">{formula.name}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">A:B Ratio:</span>
                                    <Badge variant="outline" className="bg-purple-50">
                                      {parseFloat(formula.abRatio.split(":")[0]).toFixed(2)}:
                                      {parseFloat(formula.abRatio.split(":")[1]).toFixed(2)}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Total Quantity:</span>
                                    <span className="font-semibold text-purple-600">
                                      {totalQuantity.toLocaleString()} kg
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 text-purple-800">
                                  <Zap className="h-5 w-5" />
                                  <h4 className="font-semibold">Mix Breakdown</h4>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">A Screw Total:</span>
                                    <span className="font-medium">
                                      {aQuantity.toLocaleString()} kg ({aMixes} mix{aMixes !== 1 ? 'es' : ''})
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">B Screw Total:</span>
                                    <span className="font-medium">
                                      {bQuantity.toLocaleString()} kg ({bMixes} mix{bMixes !== 1 ? 'es' : ''})
                                    </span>
                                  </div>
                                  <div className="flex justify-between pt-2 border-t">
                                    <span className="text-gray-600 font-medium">Total Mixes:</span>
                                    <Badge className="bg-purple-600">
                                      {aMixes + bMixes} mixes
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="px-8"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateMix}
                  disabled={
                    createJoMixMutation.isPending ||
                    selectedJobOrders.size === 0 ||
                    !selectedFormula
                  }
                  className="px-8 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {createJoMixMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Create Mix
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* JO Mixes Table */}
      <Card>
        <CardHeader>
          <CardTitle>JO Mixes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Mix Number</TableHead>
                  <TableHead className="text-center">Formula</TableHead>
                  <TableHead className="text-center">Screw Type</TableHead>
                  <TableHead className="text-center">Quantity (kg)</TableHead>
                  <TableHead className="text-center">Percent%</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Created</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {joMixes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Calculator className="h-8 w-8" />
                        <p>No JO mixes created yet</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  joMixes.map((mix) => {
                    // Calculate total quantity for all mixes to determine percentage
                    const totalAllMixes = joMixes.reduce(
                      (sum, m) => sum + m.totalQuantity,
                      0,
                    );
                    const percentage =
                      totalAllMixes > 0
                        ? ((mix.totalQuantity / totalAllMixes) * 100).toFixed(1)
                        : "0.0";

                    return (
                      <TableRow key={mix.id}>
                        <TableCell className="font-medium text-center">
                          {mix.mixNumber}
                        </TableCell>
                        <TableCell className="text-center">
                          {mix.formulaName}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              mix.screwType === "A" ? "default" : "secondary"
                            }
                          >
                            Screw {mix.screwType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {mix.totalQuantity.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          {percentage}%
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(mix.status)}
                        </TableCell>
                        <TableCell className="text-center">
                          {new Date(mix.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setViewingMix(mix);
                                setIsViewDialogOpen(true);
                              }}
                              title="View Mix Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrintMix(mix)}
                              title="Print Mix Report"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                            {mix.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateStatusMutation.mutate({
                                    id: mix.id,
                                    status: "in_progress",
                                  })
                                }
                              >
                                Start
                              </Button>
                            )}
                            {mix.status === "in_progress" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateStatusMutation.mutate({
                                    id: mix.id,
                                    status: "completed",
                                  })
                                }
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Mix Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mix Details - {viewingMix?.mixNumber}</DialogTitle>
            <DialogDescription>
              View detailed information about this JO mix including job orders
              and material composition.
            </DialogDescription>
          </DialogHeader>

          {viewingMix && (
            <div className="space-y-6">
              {/* Mix Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Formula</Label>
                  <p className="font-medium">{viewingMix.formulaName}</p>
                </div>
                <div>
                  <Label>Screw Type</Label>
                  <p className="font-medium">Screw {viewingMix.screwType}</p>
                </div>
                <div>
                  <Label>Total Quantity</Label>
                  <p className="font-medium">
                    {viewingMix.totalQuantity.toLocaleString()} kg
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>{getStatusBadge(viewingMix.status)}</div>
                </div>
              </div>

              <Separator />

              {/* Job Orders */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Job Orders</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>JO #</TableHead>
                      <TableHead>Quantity (kg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewingMix.items.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>JO #{item.jobOrderNumber}</TableCell>
                        <TableCell>{item.quantity.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Separator />

              {/* Materials */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Materials Required
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Percent%</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewingMix.materials.map((material: any) => {
                      // Get percentage from backend data
                      const percentage = material.percentage
                        ? material.percentage.toFixed(1)
                        : "0.0";

                      return (
                        <TableRow key={material.id}>
                          <TableCell className="font-medium">
                            {material.materialName}
                          </TableCell>
                          <TableCell>{material.materialType}</TableCell>
                          <TableCell>{percentage}%</TableCell>
                          <TableCell>
                            {material.quantity.toLocaleString()}
                          </TableCell>
                          <TableCell>{material.materialUnit}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
