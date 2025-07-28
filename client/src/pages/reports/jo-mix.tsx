import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { DataTable } from "@/components/ui/data-table";
import { formatDateString, formatNumber } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { CalendarDays, FileText, Filter, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface JoMix {
  id: number;
  mixNumber: string;
  totalQuantity: number;
  screwType: string;
  status: string;
  createdBy: string;
  createdAt: string;
  completedAt: string | null;
  abaFormulaId: number;
  formulaName: string;
  createdByName: string;
  items: Array<{
    id: number;
    jobOrderId: number;
    quantity: number;
    jobOrderNumber: number;
    jobOrderQty: number;
  }>;
  materials: Array<{
    id: number;
    materialId: number;
    quantity: number;
    percentage: number;
    materialName: string;
    materialType: string;
    materialUnit: string;
  }>;
}

export default function JoMixReports() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  // Filter state
  const [reportPeriod, setReportPeriod] = useState("daily");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedYear, setSelectedYear] = useState<Date>(new Date());
  const [materialTypeFilter, setMaterialTypeFilter] = useState("all");
  const [jobOrderFilter, setJobOrderFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [itemFilter, setItemFilter] = useState("all");

  // Fetch all required data
  const { data: joMixes = [], isLoading: loadingMixes } = useQuery<JoMix[]>({
    queryKey: ["/api/jo-mixes"],
  });

  const { data: jobOrders = [] } = useQuery({
    queryKey: ["/api/job-orders"],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  const { data: rawMaterials = [] } = useQuery({
    queryKey: ["/api/raw-materials"],
  });

  const { data: customerProducts = [] } = useQuery({
    queryKey: ["/api/customer-products"],
  });

  const { data: items = [] } = useQuery({
    queryKey: ["/api/items"],
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
  });

  // Filter completed mixes based on selected criteria
  const filteredMixes = useMemo(() => {
    let filtered = joMixes.filter(
      (mix) => mix.status === "completed" && mix.completedAt,
    );

    // Date filtering based on period
    const filterDate =
      reportPeriod === "daily"
        ? selectedDate
        : reportPeriod === "monthly"
          ? selectedMonth
          : selectedYear;

    if (filterDate) {
      filtered = filtered.filter((mix) => {
        const completedDate = new Date(mix.completedAt!);

        if (reportPeriod === "daily") {
          return completedDate.toDateString() === filterDate.toDateString();
        } else if (reportPeriod === "monthly") {
          return (
            completedDate.getMonth() === filterDate.getMonth() &&
            completedDate.getFullYear() === filterDate.getFullYear()
          );
        } else if (reportPeriod === "yearly") {
          return completedDate.getFullYear() === filterDate.getFullYear();
        }
        return true;
      });
    }

    // Material type filtering
    if (materialTypeFilter !== "all") {
      filtered = filtered.filter((mix) =>
        mix.materials.some(
          (material) => material.materialType === materialTypeFilter,
        ),
      );
    }

    // Job order filtering
    if (jobOrderFilter !== "all") {
      filtered = filtered.filter((mix) =>
        mix.items.some((item) => item.jobOrderId === parseInt(jobOrderFilter)),
      );
    }

    // User filtering
    if (userFilter !== "all") {
      filtered = filtered.filter((mix) => mix.createdBy === userFilter);
    }

    // Item filtering
    if (itemFilter !== "all") {
      filtered = filtered.filter((mix) => {
        return mix.items.some((item) => {
          const jobOrder = jobOrders.find((jo) => jo.id === item.jobOrderId);
          if (!jobOrder) return false;
          const customerProduct = customerProducts.find(
            (cp) => cp.id === jobOrder.customerProductId,
          );
          return customerProduct?.itemId === itemFilter;
        });
      });
    }

    return filtered;
  }, [
    joMixes,
    reportPeriod,
    selectedDate,
    selectedMonth,
    selectedYear,
    materialTypeFilter,
    jobOrderFilter,
    userFilter,
    itemFilter,
    jobOrders,
    customerProducts,
  ]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalQuantity = filteredMixes.reduce(
      (sum, mix) => sum + mix.totalQuantity,
      0,
    );
    const totalMixes = filteredMixes.length;
    const avgQuantityPerMix = totalMixes > 0 ? totalQuantity / totalMixes : 0;

    // Group by material type
    const materialBreakdown: Record<string, number> = {};
    filteredMixes.forEach((mix) => {
      mix.materials.forEach((material) => {
        if (!materialBreakdown[material.materialType]) {
          materialBreakdown[material.materialType] = 0;
        }
        materialBreakdown[material.materialType] += material.quantity;
      });
    });

    return {
      totalQuantity,
      totalMixes,
      avgQuantityPerMix,
      materialBreakdown,
    };
  }, [filteredMixes]);

  // Prepare table data with enhanced information
  const tableData = useMemo(() => {
    return filteredMixes.map((mix) => {
      // Get job order details for this mix
      const jobOrderDetails = mix.items.map((item) => {
        const jobOrder = jobOrders.find((jo) => jo.id === item.jobOrderId);
        const customerProduct = customerProducts.find(
          (cp) => cp.id === jobOrder?.customerProductId,
        );
        const itemName =
          items.find((i) => i.id === customerProduct?.itemId)?.name ||
          "Unknown";
        const customer = customers.find(
          (c) => c.id === customerProduct?.customerId,
        );

        return {
          jobOrderId: item.jobOrderId,
          quantity: item.quantity,
          itemName,
          customerName: customer?.name || "Unknown",
        };
      });

      // Get primary material types
      const materialTypes = [
        ...new Set(mix.materials.map((m) => m.materialType)),
      ];

      return {
        id: mix.id,
        mixNumber: mix.mixNumber,
        completedDate: formatDateString(mix.completedAt!),
        totalQuantity: mix.totalQuantity,
        screwType: mix.screwType,
        formulaName: mix.formulaName,
        createdByName: mix.createdByName,
        materialTypes: materialTypes.join(", "),
        jobOrders: jobOrderDetails
          .map((jo) => `JO-${jo.jobOrderId}`)
          .join(", "),
        items: [...new Set(jobOrderDetails.map((jo) => jo.itemName))].join(
          ", ",
        ),
        customers: [
          ...new Set(jobOrderDetails.map((jo) => jo.customerName)),
        ].join(", "),
        materials: mix.materials,
        jobOrderDetails,
      };
    });
  }, [filteredMixes, jobOrders, customerProducts, items, customers]);

  // Get unique values for filter dropdowns
  const uniqueMaterialTypes = useMemo(() => {
    const types = new Set<string>();
    joMixes.forEach((mix) =>
      mix.materials.forEach((material) => types.add(material.materialType)),
    );
    return Array.from(types);
  }, [joMixes]);

  const uniqueJobOrders = useMemo(() => {
    const orders = new Set<number>();
    joMixes.forEach((mix) =>
      mix.items.forEach((item) => orders.add(item.jobOrderId)),
    );
    return Array.from(orders);
  }, [joMixes]);

  const uniqueUsers = useMemo(() => {
    return Array.from(new Set(joMixes.map((mix) => mix.createdBy)));
  }, [joMixes]);

  const uniqueItems = useMemo(() => {
    const itemIds = new Set<string>();
    joMixes.forEach((mix) => {
      mix.items.forEach((item) => {
        const jobOrder = jobOrders.find((jo) => jo.id === item.jobOrderId);
        if (jobOrder) {
          const customerProduct = customerProducts.find(
            (cp) => cp.id === jobOrder.customerProductId,
          );
          if (customerProduct?.itemId) {
            itemIds.add(customerProduct.itemId);
          }
        }
      });
    });
    return Array.from(itemIds);
  }, [joMixes, jobOrders, customerProducts]);

  // Table columns
  const columns = [
    { header: "Mix Number", accessorKey: "mixNumber" },
    { header: "Date Completed", accessorKey: "completedDate" },
    {
      header: "Quantity (kg)",
      accessorKey: "totalQuantity",
      cell: (row: any) => formatNumber(row.totalQuantity, 1),
    },
    { header: "Screw Type", accessorKey: "screwType" },
    { header: "Formula", accessorKey: "formulaName" },
    { header: "Created By", accessorKey: "createdByName" },
    { header: "Material Types", accessorKey: "materialTypes" },
    { header: "Job Orders", accessorKey: "jobOrders" },
    { header: "Items", accessorKey: "items" },
  ];

  // Print function
  const handlePrint = () => {
    const doc = new jsPDF();

    // Add company header
    doc.setFillColor(6, 95, 70); // Green color
    doc.rect(0, 0, 210, 25, "F");

    // Add company logo (if available)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Modern Plastic Bag Factory", 105, 10, { align: "center" });
    doc.setFontSize(12);
    doc.text("مصنع أكياس البلاستيك الحديث", 105, 18, { align: "center" });

    // Reset text color
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    // Report title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("JO Mix Production Report", 105, 40, { align: "center" });

    // Report details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const periodText =
      reportPeriod === "daily"
        ? `Daily - ${formatDateString(selectedDate)}`
        : reportPeriod === "monthly"
          ? `Monthly - ${selectedMonth.toLocaleDateString("en-US", { year: "numeric", month: "long" })}`
          : `Yearly - ${selectedYear.getFullYear()}`;

    doc.text(`Report Period: ${periodText}`, 20, 55);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 65);
    doc.text(`Total Mixes: ${summaryStats.totalMixes}`, 20, 75);
    doc.text(
      `Total Quantity: ${formatNumber(summaryStats.totalQuantity, 1)} kg`,
      20,
      85,
    );

    // Table data
    const tableRows = tableData.map((row) => [
      row.mixNumber,
      row.completedDate,
      formatNumber(row.totalQuantity, 1) + " kg",
      row.screwType,
      row.formulaName,
      row.createdByName,
      row.materialTypes,
    ]);

    // Add table
    autoTable(doc, {
      startY: 95,
      head: [
        [
          "Mix Number",
          "Date",
          "Quantity",
          "Screw",
          "Formula",
          "Created By",
          "Materials",
        ],
      ],
      body: tableRows,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [6, 95, 70],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        "Modern Plastic Bag Factory - Production Management System",
        105,
        290,
        { align: "center" },
      );
      doc.text(`Page ${i} of ${pageCount}`, 190, 290);
    }

    doc.save(
      `jo-mix-report-${reportPeriod}-${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  // Mobile card view
  const renderMobileCards = () => {
    if (tableData.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">
            No completed JO Mix data found for the selected criteria
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tableData.map((mix) => (
          <Card key={mix.id} className="overflow-hidden">
            <CardHeader className="p-4 bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">
                  {mix.mixNumber}
                </CardTitle>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  {formatNumber(mix.totalQuantity, 1)} kg
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Completed Date</p>
                  <p className="text-sm font-medium">{mix.completedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Screw Type</p>
                  <p className="text-sm font-medium">{mix.screwType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Formula</p>
                  <p className="text-sm font-medium truncate">
                    {mix.formulaName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created By</p>
                  <p className="text-sm font-medium">{mix.createdByName}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Materials</p>
                  <p className="text-sm font-medium">{mix.materialTypes}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Items</p>
                  <p className="text-sm font-medium">{mix.items}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">JO Mix Reports</h1>
        <Button onClick={handlePrint} disabled={tableData.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Mixes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryStats.totalMixes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Quantity
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(summaryStats.totalQuantity, 1)} kg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Filter className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg per Mix</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(summaryStats.avgQuantityPerMix, 1)} kg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="material-icons text-purple-600">blender</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Material Types
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(summaryStats.materialBreakdown).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Period Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Report Period
              </label>
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {reportPeriod === "daily"
                  ? "Select Date"
                  : reportPeriod === "monthly"
                    ? "Select Month"
                    : "Select Year"}
              </label>
              <DatePicker
                selected={
                  reportPeriod === "daily"
                    ? selectedDate
                    : reportPeriod === "monthly"
                      ? selectedMonth
                      : selectedYear
                }
                onSelect={(date) => {
                  if (reportPeriod === "daily")
                    setSelectedDate(date || new Date());
                  else if (reportPeriod === "monthly")
                    setSelectedMonth(date || new Date());
                  else setSelectedYear(date || new Date());
                }}
              />
            </div>

            {/* Material Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Material Type
              </label>
              <Select
                value={materialTypeFilter}
                onValueChange={setMaterialTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Materials</SelectItem>
                  {uniqueMaterialTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Job Order Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Order
              </label>
              <Select value={jobOrderFilter} onValueChange={setJobOrderFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Job Orders</SelectItem>
                  {uniqueJobOrders.map((joId) => (
                    <SelectItem key={joId} value={joId.toString()}>
                      JO-{joId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Created By User
              </label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map((userId) => {
                    const user = users.find((u) => u.id === userId);
                    return (
                      <SelectItem key={userId} value={userId}>
                        {user?.username || userId}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Item Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Item</label>
              <Select value={itemFilter} onValueChange={setItemFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  {uniqueItems.map((itemId) => {
                    const item = items.find((i) => i.id === itemId);
                    return (
                      <SelectItem key={itemId} value={itemId}>
                        {item?.name || itemId}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Material Breakdown */}
      {Object.keys(summaryStats.materialBreakdown).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Material Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(summaryStats.materialBreakdown).map(
                ([type, quantity]) => (
                  <div
                    key={type}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium">{type}</span>
                    <span className="text-blue-600 font-bold">
                      {formatNumber(quantity, 1)} kg
                    </span>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table / Mobile Cards */}
      <Card>
        <CardHeader>
          <CardTitle>JO Mix Production Details</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingMixes ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : isMobile ? (
            renderMobileCards()
          ) : (
            <DataTable columns={columns} data={tableData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
