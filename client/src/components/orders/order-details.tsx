import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { StatusBadge } from "@/components/ui/status-badge";
import { API_ENDPOINTS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { formatDateString, calculateProgress } from "@/lib/utils";
import {
  Order,
  Customer,
  JobOrder,
  CustomerProduct,
  Roll,
  Item,
  MasterBatch,
} from "@shared/schema";
import { toast } from "@/hooks/use-toast";
import { JobOrderDialog } from "./job-order-dialog";
// @ts-ignore
import { useTranslation } from "react-i18next";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Printer, 
  UserPlus, 
  Package, 
  ArrowLeft,
  FileText,
  Download
} from "lucide-react";

interface OrderDetailsProps {
  orderId: number;
}

export function OrderDetails({ orderId }: OrderDetailsProps) {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  // @ts-ignore
  const { t } = useTranslation();
  const [rollDialogOpen, setRollDialogOpen] = useState(false);
  const [jobOrderDialogOpen, setJobOrderDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJobOrder, setSelectedJobOrder] = useState<JobOrder | null>(
    null,
  );
  const [rollQuantity, setRollQuantity] = useState(0);

  // Fetch order and related data
  const { data: order, isLoading: orderLoading } = useQuery<Order>({
    queryKey: [`${API_ENDPOINTS.ORDERS}/${orderId}`],
  });

  const { data: customer } = useQuery<Customer>({
    queryKey: [`${API_ENDPOINTS.CUSTOMERS}/${order?.customerId}`],
    enabled: !!order?.customerId,
  });

  const { data: jobOrders } = useQuery<JobOrder[]>({
    queryKey: [`${API_ENDPOINTS.ORDERS}/${orderId}/job-orders`],
    enabled: !!orderId,
  });

  const { data: customerProducts } = useQuery<CustomerProduct[]>({
    queryKey: [API_ENDPOINTS.CUSTOMER_PRODUCTS],
  });

  const { data: rolls } = useQuery<Roll[]>({
    queryKey: [API_ENDPOINTS.ROLLS],
  });

  // Fetch items to get their names
  const { data: items } = useQuery<Item[]>({
    queryKey: [API_ENDPOINTS.ITEMS],
  });

  // Fetch master batches to get their names
  const { data: masterBatches } = useQuery<MasterBatch[]>({
    queryKey: [API_ENDPOINTS.MASTER_BATCHES],
  });

  // Mutation to update order status
  const updateOrderMutation = useMutation({
    mutationFn: async (status: string) => {
      await apiRequest("PUT", `${API_ENDPOINTS.ORDERS}/${orderId}`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ORDERS] });
      queryClient.invalidateQueries({
        queryKey: [`${API_ENDPOINTS.ORDERS}/${orderId}`],
      });
      toast({
        title: "Order Updated",
        description: "Order status has been updated successfully.",
      });
    },
  });

  // Mutation to create a new job order
  const createJobOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", API_ENDPOINTS.JOB_ORDERS, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${API_ENDPOINTS.ORDERS}/${orderId}/job-orders`],
      });
      setJobOrderDialogOpen(false);
      setSelectedJobOrder(null);
      toast({
        title: "Job Order Created",
        description: "New job order has been created successfully.",
      });
    },
  });

  // Mutation to update a job order
  const updateJobOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!selectedJobOrder) return;
      await apiRequest(
        "PUT",
        `${API_ENDPOINTS.JOB_ORDERS}/${selectedJobOrder.id}`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${API_ENDPOINTS.ORDERS}/${orderId}/job-orders`],
      });
      setJobOrderDialogOpen(false);
      setSelectedJobOrder(null);
      toast({
        title: "Job Order Updated",
        description: "Job order has been updated successfully.",
      });
    },
  });

  // Mutation to delete a job order
  const deleteJobOrderMutation = useMutation({
    mutationFn: async () => {
      if (!selectedJobOrder) return;
      await apiRequest(
        "DELETE",
        `${API_ENDPOINTS.JOB_ORDERS}/${selectedJobOrder.id}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${API_ENDPOINTS.ORDERS}/${orderId}/job-orders`],
      });
      setDeleteDialogOpen(false);
      setSelectedJobOrder(null);
      toast({
        title: "Job Order Deleted",
        description: "Job order has been deleted successfully.",
      });
    },
  });

  // Mutation to create a new roll
  const createRollMutation = useMutation({
    mutationFn: async () => {
      if (!selectedJobOrder) return;

      // Send only the necessary data - id and serialNumber will be generated on server
      await apiRequest("POST", API_ENDPOINTS.ROLLS, {
        jobOrderId: selectedJobOrder.id,
        extrudingQty: rollQuantity,
        printingQty: rollQuantity, // Set printing quantity equal to extrusion quantity
        cuttingQty: 0,
        currentStage: "extrusion",
        status: "pending",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ROLLS] });
      setRollDialogOpen(false);
      setRollQuantity(0);
      toast({
        title: "Roll Created",
        description: "New roll has been created successfully.",
      });
    },
  });

  if (orderLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-8 bg-secondary-100 rounded w-1/3"></div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-40 bg-secondary-50 rounded"></div>
          <div className="h-80 bg-secondary-50 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <h3 className="text-xl font-medium text-secondary-800 mb-2">
            Order Not Found
          </h3>
          <p className="text-secondary-600 mb-6">
            The order you're looking for does not exist or has been deleted.
          </p>
          <Link href="/orders">
            <Button>Return to Orders</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Find customer product for a job order
  const getCustomerProduct = (jobOrder: JobOrder) => {
    return customerProducts?.find((cp) => cp.id === jobOrder.customerProductId);
  };

  // Calculate production progress
  const calculateOrderProgress = (stage: string) => {
    if (!jobOrders || jobOrders.length === 0)
      return { current: 0, total: 0, percentage: 0 };

    let currentQuantity = 0;
    let totalQuantity = 0;

    jobOrders.forEach((jobOrder) => {
      // Get rolls for this job order
      const jobOrderRolls =
        rolls?.filter((roll) => roll.jobOrderId === jobOrder.id) || [];

      // Add to total quantity
      totalQuantity += jobOrder.quantity;

      // Add to current quantity based on stage
      if (stage === "extrusion") {
        currentQuantity += jobOrderRolls.reduce(
          (sum, roll) => sum + (roll.extrudingQty || 0),
          0,
        );
      } else if (stage === "printing") {
        currentQuantity += jobOrderRolls.reduce(
          (sum, roll) => sum + (roll.printingQty || 0),
          0,
        );
      } else if (stage === "cutting") {
        currentQuantity += jobOrderRolls.reduce(
          (sum, roll) => sum + (roll.cuttingQty || 0),
          0,
        );
      }
    });

    const percentage = calculateProgress(currentQuantity, totalQuantity);

    return { current: currentQuantity, total: totalQuantity, percentage };
  };

  // Get rolls for this order
  const getOrderRolls = () => {
    if (!jobOrders || !rolls) return [];

    const orderJobOrderIds = jobOrders.map((jo) => jo.id);
    return rolls.filter((roll) => orderJobOrderIds.includes(roll.jobOrderId));
  };

  const extrusionProgress = calculateOrderProgress("extrusion");
  const printingProgress = calculateOrderProgress("printing");
  const cuttingProgress = calculateOrderProgress("cutting");
  const orderRolls = getOrderRolls();

  // Job Order handlers
  const handleAddJobOrder = () => {
    setSelectedJobOrder(null);
    setJobOrderDialogOpen(true);
  };

  const handleEditJobOrder = (jobOrder: JobOrder) => {
    setSelectedJobOrder(jobOrder);
    setJobOrderDialogOpen(true);
  };

  const handleDeleteJobOrder = (jobOrder: JobOrder) => {
    setSelectedJobOrder(jobOrder);
    setDeleteDialogOpen(true);
  };

  const handleJobOrderSubmit = (data: any) => {
    if (selectedJobOrder) {
      // Edit mode
      updateJobOrderMutation.mutate(data);
    } else {
      // Add mode
      createJobOrderMutation.mutate(data);
    }
  };

  const confirmDelete = () => {
    deleteJobOrderMutation.mutate();
  };

  // Roll handlers
  const handleOpenRollDialog = (jobOrder: JobOrder) => {
    setSelectedJobOrder(jobOrder);
    setRollDialogOpen(true);
  };

  const handleCreateRoll = () => {
    if (rollQuantity <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid quantity greater than zero.",
        variant: "destructive",
      });
      return;
    }

    createRollMutation.mutate();
  };

  // Handle print order functionality
  const handlePrintOrder = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast({
        title: "Print Error",
        description:
          "Unable to open print window. Please check your browser settings.",
        variant: "destructive",
      });
      return;
    }

    // Format job orders and products for printing
    const jobOrderRows =
      jobOrders
        ?.map((jobOrder, index) => {
          const product = getCustomerProduct(jobOrder);
          // Convert yes/no/checked to Y/N for printed
          const printedValue = product?.printed
            ? product.printed === "yes" || product.printed === "checked"
              ? "Y"
              : "N"
            : "N";

          // Get item name
          const item = items?.find((i) => i.id === product?.itemId);

          // Get master batch name
          const masterBatch = masterBatches?.find(
            (mb) => mb.id === product?.masterBatchId,
          );

          return `
        <tr>
          <td>${index + 1}</td>
          <td>${item?.name || "N/A"}</td>
          <td>${product?.sizeCaption || "N/A"}</td>
          <td>${product?.thickness || "N/A"}</td>
          <td>${product?.rawMaterial || "N/A"}</td>
          <td>${masterBatch?.name || "N/A"}</td>
          <td>${jobOrder.quantity}</td>
          <td>${printedValue}</td>
          <td>${product?.printingCylinder || "0"}</td>
          <td>${product?.cuttingLength || "0"}</td>
          <td>${product?.punching || "None"}</td>
          <td>${product?.lengthCm ? Math.round(product.lengthCm) : "0"}</td>
          <td>${product?.cuttingUnit || "Kg."}</td>
          <td>${product?.unitWeight || "1"}</td>
          <td>${product?.packing || "20K/Bag"}</td>
          <td>${product?.cover || "-"}</td>
        </tr>
      `;
        })
        .join("") || "";

    // Format rolls for printing
    const rollRows = orderRolls
      .map((roll) => {
        const jobOrder = jobOrders?.find((jo) => jo.id === roll.jobOrderId);
        const product = jobOrder ? getCustomerProduct(jobOrder) : null;
        const item = items?.find((i) => i.id === product?.itemId);

        return `
        <tr>
          <td>${roll.id}</td>
          <td>${item?.name || "N/A"}</td>
          <td>${roll.extrudingQty || 0}</td>
          <td>${roll.printingQty || 0}</td>
          <td>${roll.cuttingQty || 0}</td>
          <td>${roll.currentStage}</td>
          <td>${roll.status}</td>
        </tr>
      `;
      })
      .join("");

    // Create the print document HTML
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order #${order.id} - Modern Plastic Bag Factory</title>
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
          h1, h2, h3 {
            color: #065f46;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: center;
          }
          th {
            background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
            font-weight: bold;
            color: #065f46;
          }
          tr:nth-child(even) { background-color: #f9fafb; }
          .info-box {
            border: 2px solid #059669;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
          }
          .info-row {
            display: flex;
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            width: 150px;
            color: #065f46;
          }
          @media print {
            button { display: none; }
            .print-header { page-break-inside: avoid; }
          }
          .print-footer {
            margin-top: 40px;
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #065f46;
            font-size: 12px;
            color: #6b7280;
          }
          .print-button {
            background: #059669;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            cursor: pointer;
            margin-bottom: 20px;
            font-weight: bold;
          }
          .print-button:hover {
            background: #065f46;
          }
          .order-notes {
            color: #dc2626;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <button class="print-button" onclick="window.print(); window.close();">Print Order</button>
        
        <div class="print-header">
          <img src="/assets/company-logo.png" alt="Company Logo" class="company-logo" />
          <div class="company-info">
            <h1 class="company-name-en">Modern Plastic Bag Factory</h1>
            <h2 class="company-name-ar">مصنع أكياس البلاستيك الحديث</h2>
            <h3 class="report-title">Order Report #${order.id}</h3>
          </div>
          <div style="width: 80px;"></div>
        </div>
        
        <div class="info-box">
          <h3>Order Information</h3>
          <div class="info-row">
            <div class="info-label">Customer:</div>
            <div>${customer?.name}</div>
          </div>
          ${
            customer?.nameAr
              ? `
          <div class="info-row">
            <div class="info-label">Customer Ar:</div>
            <div>${customer.nameAr}</div>
          </div>`
              : ""
          }
          <div class="info-row">
            <div class="info-label">Date:</div>
            <div>${formatDateString(order.date)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Plate Drawer Code:</div>
            <div>${customer?.plateDrawerCode || "N/A"}</div>
          </div>
          ${
            order.note
              ? `
          <div class="info-row">
            <div class="info-label">Notes:</div>
            <div class="order-notes">${order.note}</div>
          </div>`
              : ""
          }
        </div>
        
        <h3>Order Products</h3>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Item Name</th>
              <th>Size</th>
              <th>Thick</th>
              <th>Mater</th>
              <th>Batch</th>
              <th>Qty</th>
              <th>Printed</th>
              <th>Cyle.</th>
              <th>Cut Length</th>
              <th>Punch</th>
              <th>Length</th>
              <th>Unit</th>
              <th>U/W(Kg)</th>
              <th>Packing</th>
              <th>Cover</th>
            </tr>
          </thead>
          <tbody>
            ${jobOrderRows}
          </tbody>
        </table>
        
        <h3>Roll Status</h3>
        <table>
          <thead>
            <tr>
              <th>Roll ID</th>
              <th>Product</th>
              <th>Extrusion Qty</th>
              <th>Printing Qty</th>
              <th>Cutting Qty</th>
              <th>Current Stage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rollRows.length > 0 ? rollRows : '<tr><td colspan="7" style="text-align: center;">No rolls created for this order yet</td></tr>'}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Write to the print window and trigger print
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    toast({
      title: "Print Ready",
      description: "Order print view has been prepared.",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Order Details #{order.id}</span>
            <StatusBadge status={order.status} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-secondary-50 p-4 rounded">
              <h4 className="font-medium text-secondary-700 mb-2">
                Order Information
              </h4>
              <div className="text-sm">
                <p className="flex justify-between py-1.5 border-b border-secondary-100">
                  <span className="text-secondary-500">Order ID:</span>
                  <span className="font-medium">{order.id}</span>
                </p>
                <p className="flex justify-between py-1.5 border-b border-secondary-100">
                  <span className="text-secondary-500">Customer:</span>
                  <span className="font-medium">{customer?.name}</span>
                </p>
                {customer?.nameAr && (
                  <p className="flex justify-between py-1.5 border-b border-secondary-100">
                    <span className="text-secondary-500">Customer Ar:</span>
                    <span className="font-medium">{customer.nameAr}</span>
                  </p>
                )}
                <p className="flex justify-between py-1.5 border-b border-secondary-100">
                  <span className="text-secondary-500">Date:</span>
                  <span className="font-medium">
                    {formatDateString(order.date)}
                  </span>
                </p>
                <p className="flex justify-between py-1.5 border-b border-secondary-100">
                  <span className="text-secondary-500">Plate Drawer Code:</span>
                  <span className="font-medium">
                    {customer?.plateDrawerCode || "N/A"}
                  </span>
                </p>
                <p className="flex justify-between py-1.5 border-b border-secondary-100">
                  <span className="text-secondary-500">Status:</span>
                  <StatusBadge status={order.status} />
                </p>
                {order.note && (
                  <div className="py-1.5">
                    <div className="text-secondary-500 mb-1">Notes:</div>
                    <div className="font-medium text-sm bg-secondary-100 p-2 rounded">
                      {order.note}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 bg-secondary-50 p-4 rounded">
              <h4 className="font-medium text-secondary-700 mb-2">
                Production Progress
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Extrusion: {extrusionProgress.percentage}%</span>
                    <span>
                      {extrusionProgress.current} / {extrusionProgress.total} Kg
                    </span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2.5">
                    <div
                      className="bg-primary-500 h-2.5 rounded-full"
                      style={{ width: `${extrusionProgress.percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Printing: {printingProgress.percentage}%</span>
                    <span>
                      {printingProgress.current} / {printingProgress.total} Kg
                    </span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2.5">
                    <div
                      className="bg-primary-500 h-2.5 rounded-full"
                      style={{ width: `${printingProgress.percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Cutting: {cuttingProgress.percentage}%</span>
                    <span>
                      {cuttingProgress.current} / {cuttingProgress.total} Kg
                    </span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2.5">
                    <div
                      className="bg-primary-500 h-2.5 rounded-full"
                      style={{ width: `${cuttingProgress.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SMS Messages */}
          {customer && order && (
            <div className="mt-8 mb-8">
              {/* SMS Management has been moved to the System Settings page */}
            </div>
          )}

          {/* Order Products */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-lg">Order Products</h4>
              <div className="flex gap-3">
                <Button 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-slate-700 hover:bg-slate-800 text-white border-slate-700 hover:border-slate-800 pt-[10px] pb-[10px] pl-[16px] pr-[16px]"
                  onClick={handleAddJobOrder}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Job Order
                </Button>
                <Button 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-slate-700 hover:bg-slate-800 text-white border-slate-700 hover:border-slate-800 pt-[10px] pb-[10px] pl-[16px] pr-[16px]"
                  onClick={handlePrintOrder}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Order
                </Button>
              </div>
            </div>

            {isMobile ? (
              // Mobile view - card layout
              <div className="space-y-4">
                {jobOrders && jobOrders.length > 0 ? (
                  jobOrders.map((jobOrder) => {
                    const product = getCustomerProduct(jobOrder);
                    const item = items?.find((i) => i.id === product?.itemId);
                    const masterBatch = masterBatches?.find(
                      (mb) => mb.id === product?.masterBatchId,
                    );

                    return (
                      <div
                        key={jobOrder.id}
                        className="bg-white border rounded-lg shadow-sm p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold">
                            {item?.name || "Unknown Item"}
                          </h4>
                          <div className="flex space-x-2">
                            <Button
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-slate-700 hover:bg-slate-800 text-white border-slate-700 hover:border-slate-800 h-10 w-10 p-0 rounded-full"
                              onClick={() => handleOpenRollDialog(jobOrder)}
                            >
                              <Package className="h-4 w-4" />
                            </Button>
                            <Button
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-slate-700 hover:bg-slate-800 text-white border-slate-700 hover:border-slate-800 h-10 w-10 p-0 rounded-full"
                              onClick={() => handleEditJobOrder(jobOrder)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 h-10 w-10 p-0 rounded-full"
                              onClick={() => handleDeleteJobOrder(jobOrder)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-secondary-500">Size:</p>
                            <p className="font-medium">
                              {product?.sizeCaption || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-secondary-500">Qty (Kg):</p>
                            <p className="font-medium">{jobOrder.quantity}</p>
                          </div>
                          <div>
                            <p className="text-secondary-500">Thickness:</p>
                            <p className="font-medium">
                              {product?.thickness || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-secondary-500">Material:</p>
                            <p className="font-medium">
                              {product?.rawMaterial || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-secondary-500">Batch:</p>
                            <p className="font-medium">
                              {masterBatch?.name || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-secondary-500">Printed:</p>
                            <p className="font-medium">
                              {product?.printed || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-secondary-500">
                              Cylinder (Inch):
                            </p>
                            <p className="font-medium">
                              {product?.printingCylinder || "0"}
                            </p>
                          </div>
                          <div>
                            <p className="text-secondary-500">
                              Cutting Length:
                            </p>
                            <p className="font-medium">
                              {product?.cuttingLength || "0"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white border rounded-lg p-6 text-center text-secondary-500">
                    No job orders found for this order. Click "Add Job Order" to
                    create one.
                  </div>
                )}
              </div>
            ) : (
              // Desktop view - table layout
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary-50 text-secondary-600 border-b border-secondary-100">
                    <tr>
                      <th className="py-3 px-4 text-center">{t("orders.product")}</th>
                      <th className="py-3 px-4 text-center">{t("orders.size")}</th>
                      <th className="py-3 px-4 text-center">{t("orders.thickness")}</th>
                      <th className="py-3 px-4 text-center">{t("orders.material")}</th>
                      <th className="py-3 px-4 text-center">{t("orders.batch")}</th>
                      <th className="py-3 px-4 text-center">{t("orders.qty_kg")}</th>
                      <th className="py-3 px-4 text-center">{t("orders.printed")}</th>
                      <th className="py-3 px-4 text-center">{t("orders.cylinder_inch")}</th>
                      <th className="py-3 px-4 text-center">{t("orders.cutting_length")}</th>
                      <th className="py-3 px-4 text-center">{t("orders.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="text-secondary-800">
                    {jobOrders?.map((jobOrder) => {
                      const product = getCustomerProduct(jobOrder);
                      // Get item name
                      const item = items?.find((i) => i.id === product?.itemId);
                      // Get master batch name
                      const masterBatch = masterBatches?.find(
                        (mb) => mb.id === product?.masterBatchId,
                      );

                      return (
                        <tr
                          key={jobOrder.id}
                          className="border-b border-secondary-100"
                        >
                          <td className="py-3 px-4 text-center">{item?.name || "N/A"}</td>
                          <td className="py-3 px-4 text-center">
                            {product?.sizeCaption || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {product?.thickness || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {product?.rawMaterial || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {masterBatch?.name || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {Math.round(jobOrder.quantity)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {product?.printed || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {product?.printingCylinder || "0"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {product?.cuttingLength || "0"}
                          </td>
                          <td className="py-3 px-4 text-center flex justify-center space-x-2">
                            <Button
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-slate-700 hover:bg-slate-800 text-white border-slate-700 hover:border-slate-800 h-10 w-10 p-0 ml-[8px] mr-[8px]"
                              onClick={() => handleOpenRollDialog(jobOrder)}
                            >
                              <Package className="h-4 w-4" />
                            </Button>
                            <Button
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-slate-700 hover:bg-slate-800 text-white border-slate-700 hover:border-slate-800 h-10 w-10 p-0 ml-[8px] mr-[8px]"
                              onClick={() => handleEditJobOrder(jobOrder)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 h-10 w-10 p-0 ml-[8px] mr-[8px]"
                              onClick={() => handleDeleteJobOrder(jobOrder)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    {(!jobOrders || jobOrders.length === 0) && (
                      <tr>
                        <td
                          colSpan={10}
                          className="py-4 text-center text-secondary-500"
                        >
                          No job orders found for this order. Click "Add Job
                          Order" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Rolls */}
          <div>
            <h4 className="font-medium text-lg mb-4">{t('rolls.roll_status')}</h4>

            {isMobile ? (
              // Mobile view - card layout
              <div className="space-y-4">
                {orderRolls.length > 0 ? (
                  orderRolls.map((roll) => {
                    const jobOrder = jobOrders?.find(
                      (jo) => jo.id === roll.jobOrderId,
                    );
                    const product = jobOrder
                      ? getCustomerProduct(jobOrder)
                      : null;
                    const item = items?.find((i) => i.id === product?.itemId);

                    return (
                      <div
                        key={roll.id}
                        className="bg-white border rounded-lg shadow-sm p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold">{roll.id}</h4>
                          <div className="flex items-center space-x-2">
                            <StatusBadge status={roll.status} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-secondary-500">{t('rolls.product')}:</p>
                            <p className="font-medium">{item?.name || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-secondary-500">{t('rolls.current_stage')}:</p>
                            <StatusBadge status={roll.currentStage} />
                          </div>
                          <div>
                            <p className="text-secondary-500">{t('rolls.extrusion_qty')}:</p>
                            <p className="font-medium">
                              {roll.extrudingQty || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-secondary-500">{t('rolls.printing_qty')}:</p>
                            <p className="font-medium">
                              {roll.printingQty || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-secondary-500">{t('rolls.cutting_qty')}:</p>
                            <p className="font-medium">
                              {roll.cuttingQty || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white border rounded-lg p-6 text-center text-secondary-500">
                    No rolls created for this order yet
                  </div>
                )}
              </div>
            ) : (
              // Desktop view - table layout
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary-50 text-secondary-600 border-b border-secondary-100">
                    <tr>
                      <th className="py-3 px-4 text-center">{t('rolls.roll_id')}</th>
                      <th className="py-3 px-4 text-center">{t('rolls.product')}</th>
                      <th className="py-3 px-4 text-center">{t('rolls.extrusion_qty')}</th>
                      <th className="py-3 px-4 text-center">{t('rolls.printing_qty')}</th>
                      <th className="py-3 px-4 text-center">{t('rolls.cutting_qty')}</th>
                      <th className="py-3 px-4 text-center">{t('rolls.current_stage')}</th>
                      <th className="py-3 px-4 text-center">{t('rolls.status')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-secondary-800">
                    {orderRolls.length > 0 ? (
                      orderRolls.map((roll) => {
                        const jobOrder = jobOrders?.find(
                          (jo) => jo.id === roll.jobOrderId,
                        );
                        const product = jobOrder
                          ? getCustomerProduct(jobOrder)
                          : null;
                        // Get item name
                        const item = items?.find(
                          (i) => i.id === product?.itemId,
                        );

                        return (
                          <tr
                            key={roll.id}
                            className="border-b border-secondary-100"
                          >
                            <td className="py-3 px-4">{roll.id}</td>
                            <td className="py-3 px-4">{item?.name || "N/A"}</td>
                            <td className="py-3 px-4">
                              {roll.extrudingQty || 0}
                            </td>
                            <td className="py-3 px-4">
                              {roll.printingQty || 0}
                            </td>
                            <td className="py-3 px-4">
                              {roll.cuttingQty || 0}
                            </td>
                            <td className="py-3 px-4">
                              <StatusBadge status={roll.currentStage} />
                            </td>
                            <td className="py-3 px-4">
                              <StatusBadge status={roll.status} />
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-6 text-center text-secondary-500"
                        >
                          No rolls created for this order yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter
          className={`${isMobile ? "flex-col space-y-3" : "flex justify-end space-x-3"}`}
        >
          {isMobile ? (
            <>
              <Button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-slate-700 hover:bg-slate-800 text-white border-slate-700 hover:border-slate-800 w-full justify-center pt-[12px] pb-[12px] pl-[20px] pr-[20px]"
                onClick={() => handlePrintOrder()}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Order
              </Button>
              <Button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 w-full justify-center pt-[12px] pb-[12px] pl-[20px] pr-[20px]"
                onClick={() => updateOrderMutation.mutate("completed")}
                disabled={
                  updateOrderMutation.isPending || order.status === "completed"
                }
              >
                <FileText className="h-4 w-4 mr-2" />
                Mark as Completed
              </Button>
              <Link href="/orders" className="w-full">
                <Button className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 w-full justify-center pt-[12px] pb-[12px] pl-[20px] pr-[20px]">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-slate-700 hover:bg-slate-800 text-white border-slate-700 hover:border-slate-800 pt-[10px] pb-[10px] pl-[20px] pr-[20px] ml-[15px] mr-[15px]"
                onClick={() => handlePrintOrder()}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Order
              </Button>
              <Button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 pt-[10px] pb-[10px] pl-[20px] pr-[20px] ml-[15px] mr-[15px]"
                onClick={() => updateOrderMutation.mutate("completed")}
                disabled={
                  updateOrderMutation.isPending || order.status === "completed"
                }
              >
                <FileText className="h-4 w-4 mr-2" />
                Mark as Completed
              </Button>
              <Link href="/orders">
                <Button className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 pt-[10px] pb-[10px] pl-[20px] pr-[20px] ml-[15px] mr-[15px]">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
            </>
          )}
        </CardFooter>
      </Card>

      {/* Add/Edit Job Order Dialog */}
      <JobOrderDialog
        open={jobOrderDialogOpen}
        onOpenChange={setJobOrderDialogOpen}
        onSubmit={handleJobOrderSubmit}
        jobOrder={selectedJobOrder}
        orderId={orderId}
      />

      {/* Delete Job Order Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Order</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the job order and all its associated
              rolls. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-200 hover:border-gray-300 pt-[10px] pb-[10px] pl-[16px] pr-[16px]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 pt-[10px] pb-[10px] pl-[16px] pr-[16px]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Roll Dialog */}
      <Dialog open={rollDialogOpen} onOpenChange={setRollDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Roll</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-secondary-500 mb-4">
              Roll serial number will be automatically generated in sequence for
              this job order. Printing quantity will be automatically set to
              equal extrusion quantity.
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity (Kg)</label>
              <input
                type="number"
                step="1"
                value={Math.round(rollQuantity)}
                onChange={(e) =>
                  setRollQuantity(Math.round(parseFloat(e.target.value)))
                }
                placeholder="Enter quantity"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-200 hover:border-gray-300 pt-[10px] pb-[10px] pl-[16px] pr-[16px]"
              onClick={() => setRollDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 pt-[10px] pb-[10px] pl-[16px] pr-[16px]"
              onClick={handleCreateRoll}
              disabled={createRollMutation.isPending}
            >
              {createRollMutation.isPending ? "Creating..." : "Create Roll"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
