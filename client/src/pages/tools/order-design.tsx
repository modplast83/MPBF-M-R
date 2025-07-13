import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import jsPDF from "jspdf";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Palette,
  Ruler,
  Package,
  Eye,
  Download,
  RotateCcw,
  Brush,
  Square,
  Circle,
  Type,
  Move,
  Save,
  Share,
  Settings,
  FileText,
  Calculator,
  Zap,
} from "lucide-react";

interface CustomizationState {
  productType: string;
  template: string;
  dimensions: {
    width: number;
    length: number;
    gusset: number;
    thickness: number;
  };
  materialColor: string;
  uploadedDesign: File | null;
  designColors: string[];
  canvasDesign: string | null;
  finalPreview: boolean;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  quantity: number;
  notes: string;
}

const PRODUCT_TYPES = [
  {
    id: "shopping-bag",
    name: "Shopping Bag",
    icon: "🛍️",
    description: "T-shirt and D-cut handle bags",
  },
  {
    id: "table-cover",
    name: "Table Cover",
    icon: "🪑",
    description: "Protective table coverings",
  },
  {
    id: "packing-bags",
    name: "Packing Bags",
    icon: "📦",
    description: "Industrial packaging solutions",
  },
  {
    id: "garbage-bags",
    name: "Garbage Bags",
    icon: "🗑️",
    description: "Waste management bags",
  },
];

const TEMPLATES = [
  {
    id: "t-shirt",
    name: "T-Shirt Bag",
    description: "Classic retail shopping bag with handles",
    productTypes: ["shopping-bag"],
    features: ["Handle cutouts", "Reinforced edges", "Custom sizing"],
  },
  {
    id: "t-shirt-hook",
    name: "T-Shirt with Hook",
    description: "Shopping bag with hanging hook feature",
    productTypes: ["shopping-bag"],
    features: ["Handle cutouts", "Hanging hook", "Display ready"],
  },
  {
    id: "d-cut",
    name: "D-Cut Handle",
    description: "Professional D-shaped handle design",
    productTypes: ["shopping-bag"],
    features: ["D-shaped handles", "Premium finish", "Heavy duty"],
  },
  {
    id: "non-cut",
    name: "Flat Bag",
    description: "Simple flat bag without handles",
    productTypes: ["packing-bags", "garbage-bags", "food-packaging"],
    features: ["Flat design", "Heat sealed", "Multi-purpose"],
  },
  {
    id: "sheet",
    name: "Sheet Cover",
    description: "Flat sheet for table protection",
    productTypes: ["table-cover"],
    features: ["Flat surface", "Custom dimensions", "Protective coating"],
  },
  {
    id: "zipper-pouch",
    name: "Zipper Pouch",
    description: "Resealable pouch with zipper",
    productTypes: ["custom-pouches", "food-packaging"],
    features: ["Zipper closure", "Resealable", "Food safe"],
  },
];

const MATERIAL_COLORS = [
  {
    id: "clear",
    name: "Clear/Transparent",
    hex: "#ffffff",
    border: true,
    opacity: 0.3,
  },
  { id: "white", name: "White", hex: "#ffffff" },
  { id: "black", name: "Black", hex: "#000000" },
  { id: "red", name: "Red", hex: "#ef4444" },
  { id: "green", name: "Green", hex: "#22c55e" },
  { id: "blue", name: "Blue", hex: "#3b82f6" },
  { id: "pink", name: "Pink", hex: "#ec4899" },
  { id: "gold", name: "Gold", hex: "#fbbf24" },
  { id: "silver", name: "Silver", hex: "#94a3b8" },
  { id: "brown", name: "Brown", hex: "#a3a3a3" },
  { id: "gray", name: "Gray", hex: "#6b7280" },
  { id: "purple", name: "Purple", hex: "#8b5cf6" },
  { id: "orange", name: "Orange", hex: "#f97316" },
  { id: "light-blue", name: "Light Blue", hex: "#38bdf8" },
  { id: "ivory", name: "Ivory", hex: "#fffbeb" },
  { id: "yellow", name: "Yellow", hex: "#eab308" },
];

const DESIGN_COLORS = [
  "#000000",
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#fbbf24",
  "#ec4899",
  "#8b5cf6",
  "#f97316",
  "#6b7280",
  "#ffffff",
];

export default function OrderDesignPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [customization, setCustomization] = useState<CustomizationState>({
    productType: "",
    template: "",
    dimensions: { width: 30, length: 40, gusset: 10, thickness: 0.02 },
    materialColor: "",
    uploadedDesign: null,
    designColors: [],
    canvasDesign: null,
    finalPreview: false,
    customerInfo: { name: "", email: "", phone: "" },
    quantity: 1000,
    notes: "",
  });

  const [designPreview, setDesignPreview] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState("rectangle");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [clichesCost, setClichesCost] = useState(0);
  const [bagsCost, setBagsCost] = useState(0);
  const [minimumKg, setMinimumKg] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [showTextDialog, setShowTextDialog] = useState(false);
  const [canvasElements, setCanvasElements] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [textSize, setTextSize] = useState(16);

  const { toast } = useToast();
  const { t } = useTranslation();

  // Email quote request mutation
  const emailQuoteMutation = useMutation({
    mutationFn: async (quoteData: any) => {
      const response = await fetch("/api/send-quote-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteData),
      });
      if (!response.ok) throw new Error("Failed to send email");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("tools.order_design.review.quote_submitted"),
        description: t("tools.order_design.review.quote_submitted_desc"),
      });
    },
    onError: () => {
      toast({
        title: t("tools.order_design.validation.invalid_file_type"),
        description: t("tools.order_design.validation.invalid_file_type_desc"),
        variant: "destructive",
      });
    },
  });

  const steps = [
    t("tools.order_design.steps.product_selection"),
    t("tools.order_design.steps.specifications"),
    t("tools.order_design.steps.material_color"),
    t("tools.order_design.steps.design_upload"),
    t("tools.order_design.steps.design_editor"),
    t("tools.order_design.steps.customer_info"),
    t("tools.order_design.steps.review_quote"),
  ];

  // Calculate estimated cost based on specifications
  useEffect(() => {
    const calculateCosts = () => {
      if (!customization.productType) {
        setClichesCost(0);
        setBagsCost(0);
        setEstimatedCost(0);
        setMinimumKg(0);
        return;
      }

      // 1. Clichés cost = printed area cm² × number of colors × 0.5 SR
      const printedAreaCm2 =
        customization.dimensions.width * customization.dimensions.length;
      const numberOfColors = Math.max(customization.designColors.length, 1); // At least 1 color if design exists
      const calculatedClichesCost = printedAreaCm2 * numberOfColors * 0.5;

      // 2. Bags cost = price per kg = 10 SR with minimum quantities based on colors
      let minimumKgRequired = 0;
      if (numberOfColors >= 1 && numberOfColors <= 2) {
        minimumKgRequired = 300;
      } else if (numberOfColors === 3) {
        minimumKgRequired = 500;
      } else if (numberOfColors >= 4) {
        minimumKgRequired = 1000;
      }

      // Calculate weight needed for the quantity (approximate 1 bag = 0.01 kg)
      const estimatedWeight = customization.quantity * 0.01;
      const finalWeight = Math.max(estimatedWeight, minimumKgRequired);
      const calculatedBagsCost = finalWeight * 10; // 10 SR per kg

      const totalCost = calculatedClichesCost + calculatedBagsCost;

      setClichesCost(Math.round(calculatedClichesCost * 100) / 100);
      setBagsCost(Math.round(calculatedBagsCost * 100) / 100);
      setEstimatedCost(Math.round(totalCost * 100) / 100);
      setMinimumKg(minimumKgRequired);
    };

    calculateCosts();
  }, [customization]);

  // Redraw canvas when elements change
  useEffect(() => {
    if (canvasElements.length > 0 || designPreview) {
      setTimeout(() => redrawCanvas(), 100);
    }
  }, [canvasElements, designPreview]);

  // Canvas element functions
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw uploaded design if exists
    if (customization.uploadedDesign && designPreview) {
      const img = new Image();
      img.onload = () => {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;

        // Redraw all canvas elements
        canvasElements.forEach((element, index) => {
          drawElement(ctx, element, index === selectedElement);
        });
      };
      img.src = designPreview;
    } else {
      // Just redraw canvas elements
      canvasElements.forEach((element, index) => {
        drawElement(ctx, element, index === selectedElement);
      });
    }
  };

  const drawElement = (
    ctx: CanvasRenderingContext2D,
    element: any,
    isSelected: boolean = false,
  ) => {
    ctx.strokeStyle = element.color;
    ctx.fillStyle = element.color;
    ctx.lineWidth = 2;

    if (element.type === "rectangle") {
      ctx.strokeRect(element.x, element.y, element.width, element.height);
      if (isSelected) {
        // Draw selection handles
        ctx.fillStyle = "#0066cc";
        ctx.fillRect(element.x - 3, element.y - 3, 6, 6);
        ctx.fillRect(element.x + element.width - 3, element.y - 3, 6, 6);
        ctx.fillRect(element.x - 3, element.y + element.height - 3, 6, 6);
        ctx.fillRect(
          element.x + element.width - 3,
          element.y + element.height - 3,
          6,
          6,
        );
      }
    } else if (element.type === "circle") {
      ctx.beginPath();
      ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
      ctx.stroke();
      if (isSelected) {
        // Draw selection handles
        ctx.fillStyle = "#0066cc";
        ctx.fillRect(element.x - element.radius - 3, element.y - 3, 6, 6);
        ctx.fillRect(element.x + element.radius - 3, element.y - 3, 6, 6);
        ctx.fillRect(element.x - 3, element.y - element.radius - 3, 6, 6);
        ctx.fillRect(element.x - 3, element.y + element.radius - 3, 6, 6);
      }
    } else if (element.type === "text") {
      const fontSize = element.fontSize || 16;
      ctx.font = `${fontSize}px Arial`;
      ctx.fillText(element.text, element.x, element.y);
      if (isSelected) {
        // Draw text selection box
        const textWidth = ctx.measureText(element.text).width;
        const textHeight = fontSize;
        ctx.strokeStyle = "#0066cc";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          element.x - 2,
          element.y - textHeight,
          textWidth + 4,
          textHeight + 4,
        );
        // Draw resize handles
        ctx.fillStyle = "#0066cc";
        ctx.fillRect(
          element.x + textWidth - 3,
          element.y - textHeight - 3,
          6,
          6,
        );
        ctx.fillRect(element.x + textWidth - 3, element.y - 3, 6, 6);
      }
    }
  };

  // Helper function to check if point is inside element
  const isPointInElement = (x: number, y: number, element: any): boolean => {
    if (element.type === "rectangle") {
      return (
        x >= element.x &&
        x <= element.x + element.width &&
        y >= element.y &&
        y <= element.y + element.height
      );
    } else if (element.type === "circle") {
      const distance = Math.sqrt(
        Math.pow(x - element.x, 2) + Math.pow(y - element.y, 2),
      );
      return distance <= element.radius;
    } else if (element.type === "text") {
      const canvas = canvasRef.current;
      if (!canvas) return false;
      const ctx = canvas.getContext("2d");
      if (!ctx) return false;
      const fontSize = element.fontSize || 16;
      ctx.font = `${fontSize}px Arial`;
      const textWidth = ctx.measureText(element.text).width;
      return (
        x >= element.x &&
        x <= element.x + textWidth &&
        y >= element.y - fontSize &&
        y <= element.y
      );
    }
    return false;
  };

  // Helper function to check if point is on resize handle
  const isPointOnResizeHandle = (
    x: number,
    y: number,
    element: any,
  ): boolean => {
    if (element.type === "text") {
      const canvas = canvasRef.current;
      if (!canvas) return false;
      const ctx = canvas.getContext("2d");
      if (!ctx) return false;
      const fontSize = element.fontSize || 16;
      ctx.font = `${fontSize}px Arial`;
      const textWidth = ctx.measureText(element.text).width;
      // Check bottom-right resize handle
      return (
        x >= element.x + textWidth - 6 &&
        x <= element.x + textWidth &&
        y >= element.y - 6 &&
        y <= element.y
      );
    }
    return false;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });

    // Check if clicking on an existing element for selection/dragging
    let clickedElementIndex = -1;
    for (let i = canvasElements.length - 1; i >= 0; i--) {
      if (isPointInElement(x, y, canvasElements[i])) {
        clickedElementIndex = i;
        break;
      }
    }

    if (clickedElementIndex !== -1) {
      setSelectedElement(clickedElementIndex);
      const element = canvasElements[clickedElementIndex];

      // Check if clicking on resize handle
      if (isPointOnResizeHandle(x, y, element)) {
        setIsResizing(true);
      } else {
        // Start dragging
        setIsDragging(true);
        setDragOffset({
          x: x - element.x,
          y: y - element.y,
        });
      }
      redrawCanvas();
      return;
    } else {
      setSelectedElement(null);
    }

    if (selectedTool === "text") {
      setShowTextDialog(true);
      return;
    }

    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Handle dragging existing element
    if (isDragging && selectedElement !== null) {
      const newElements = [...canvasElements];
      const element = newElements[selectedElement];
      element.x = x - dragOffset.x;
      element.y = y - dragOffset.y;
      setCanvasElements(newElements);
      redrawCanvas();
      return;
    }

    // Handle resizing text element
    if (isResizing && selectedElement !== null) {
      const newElements = [...canvasElements];
      const element = newElements[selectedElement];
      if (element.type === "text") {
        // Calculate new font size based on distance from original position
        const distance = Math.sqrt(
          Math.pow(x - element.x, 2) + Math.pow(y - element.y, 2),
        );
        const newFontSize = Math.max(8, Math.min(72, distance * 0.5));
        element.fontSize = newFontSize;
      }
      setCanvasElements(newElements);
      redrawCanvas();
      return;
    }

    if (!isDrawing || selectedTool === "text") return;

    // Clear canvas and redraw all elements plus current preview
    redrawCanvas();

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 2;

      if (selectedTool === "rectangle") {
        const width = x - startPos.x;
        const height = y - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, width, height);
      } else if (selectedTool === "circle") {
        const radius = Math.sqrt(
          Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2),
        );
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Stop dragging or resizing
    if (isDragging) {
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    if (isResizing) {
      setIsResizing(false);
      return;
    }

    if (!isDrawing || selectedTool === "text") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add the completed element to the elements array
    if (selectedTool === "rectangle") {
      const width = x - startPos.x;
      const height = y - startPos.y;
      const newElement = {
        type: "rectangle",
        x: startPos.x,
        y: startPos.y,
        width,
        height,
        color: selectedColor,
      };
      setCanvasElements((prev) => [...prev, newElement]);
    } else if (selectedTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2),
      );
      const newElement = {
        type: "circle",
        x: startPos.x,
        y: startPos.y,
        radius,
        color: selectedColor,
      };
      setCanvasElements((prev) => [...prev, newElement]);
    }

    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setCanvasElements([]);
  };

  const addTextElement = () => {
    if (!textInput.trim()) return;

    const newElement = {
      type: "text",
      x: startPos.x,
      y: startPos.y,
      text: textInput,
      color: selectedColor,
      fontSize: textSize,
    };

    setCanvasElements((prev) => [...prev, newElement]);
    setTextInput("");
    setShowTextDialog(false);

    // Redraw canvas with new text
    setTimeout(() => redrawCanvas(), 100);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      toast({
        title: t("tools.order_design.validation.invalid_file_type"),
        description: t("tools.order_design.validation.invalid_file_type_desc"),
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: t("tools.order_design.validation.file_too_large"),
        description: t("tools.order_design.validation.file_too_large_desc"),
        variant: "destructive",
      });
      return;
    }

    setCustomization((prev) => ({ ...prev, uploadedDesign: file }));

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDesignPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    toast({
      title: "Design uploaded successfully",
      description: `${file.name} has been uploaded and will be processed for printing.`,
    });
  };

  const addDesignColor = (color: string) => {
    if (customization.designColors.length >= 4) {
      toast({
        title: t("tools.order_design.validation.max_colors_reached"),
        description: t("tools.order_design.validation.max_colors_reached_desc"),
        variant: "destructive",
      });
      return;
    }

    if (!customization.designColors.includes(color)) {
      setCustomization((prev) => ({
        ...prev,
        designColors: [...prev.designColors, color],
      }));
    }
  };

  const removeDesignColor = (color: string) => {
    setCustomization((prev) => ({
      ...prev,
      designColors: prev.designColors.filter((c) => c !== color),
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return customization.productType && customization.template;
      case 1:
        return true;
      case 2:
        return customization.materialColor;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return (
          customization.customerInfo.name && customization.customerInfo.email
        );
      case 6:
        return true;
      default:
        return false;
    }
  };

  // Handle sending quote request via email
  const handleSendQuoteRequest = () => {
    const quoteData = {
      customerInfo: customization.customerInfo,
      productType: customization.productType,
      template: customization.template,
      dimensions: customization.dimensions,
      materialColor: customization.materialColor,
      quantity: customization.quantity,
      estimatedCost,
      clichesCost,
      bagsCost,
      minimumKg,
      numberOfColors: Math.max(customization.designColors.length, 1),
      notes: customization.notes,
      designColors: customization.designColors,
      timestamp: new Date().toISOString(),
    };

    emailQuoteMutation.mutate(quoteData);
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("Quote Request", 20, 20);

    // Customer Information
    doc.setFontSize(14);
    doc.text("Customer Information:", 20, 40);
    doc.setFontSize(11);
    doc.text(`Name: ${customization.customerInfo.name}`, 20, 50);
    doc.text(`Email: ${customization.customerInfo.email}`, 20, 60);
    doc.text(`Phone: ${customization.customerInfo.phone}`, 20, 70);

    // Product Details
    doc.setFontSize(14);
    doc.text("Product Details:", 20, 90);
    doc.setFontSize(11);
    doc.text(`Product Type: ${customization.productType}`, 20, 100);
    doc.text(`Template: ${customization.template}`, 20, 110);
    doc.text(`Material Color: ${customization.materialColor}`, 20, 120);

    // Dimensions
    doc.text(`Dimensions:`, 20, 140);
    doc.text(`  Width: ${customization.dimensions.width} cm`, 30, 150);
    doc.text(`  Length: ${customization.dimensions.length} cm`, 30, 160);
    doc.text(`  Gusset: ${customization.dimensions.gusset} cm`, 30, 170);
    doc.text(`  Thickness: ${customization.dimensions.thickness} mm`, 30, 180);

    // Pricing
    doc.setFontSize(14);
    doc.text("Pricing Breakdown:", 20, 200);
    doc.setFontSize(11);
    doc.text(
      `Quantity: ${customization.quantity.toLocaleString()} pieces`,
      20,
      210,
    );

    // Cost breakdown
    doc.text("1. Clichés Cost:", 20, 225);
    doc.text(
      `   ${customization.dimensions.width} × ${customization.dimensions.length} cm² × ${Math.max(customization.designColors.length, 1)} colors × 0.5 SR`,
      30,
      235,
    );
    doc.text(`   = ${clichesCost.toLocaleString()} SR`, 30, 245);

    doc.text("2. Bags Cost:", 20, 260);
    doc.text(
      `   Minimum ${minimumKg} kg × 10 SR/kg (for ${Math.max(customization.designColors.length, 1)} color${Math.max(customization.designColors.length, 1) > 1 ? "s" : ""})`,
      30,
      270,
    );
    doc.text(`   = ${bagsCost.toLocaleString()} SR`, 30, 280);

    // Total
    doc.setFontSize(12);
    doc.text(`Total Cost: ${estimatedCost.toLocaleString()} SR`, 20, 295);
    doc.text(
      `Unit Price: ${(estimatedCost / customization.quantity).toFixed(3)} SR per piece`,
      20,
      305,
    );

    // Notes
    if (customization.notes) {
      doc.setFontSize(14);
      doc.text("Notes:", 20, 250);
      doc.setFontSize(11);
      const splitNotes = doc.splitTextToSize(customization.notes, 170);
      doc.text(splitNotes, 20, 260);
    }

    // Footer
    doc.setFontSize(8);
    doc.text(
      "*Final pricing may vary based on design complexity and material availability",
      20,
      280,
    );
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 290);

    doc.save(
      `quote-${customization.customerInfo.name.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`,
    );

    toast({
      title: "PDF Downloaded",
      description: "Quote has been saved as PDF file.",
    });
  };

  const renderTemplatePreview = (template: string, materialColor: string) => {
    const color = MATERIAL_COLORS.find((c) => c.id === materialColor);
    const fillColor = color?.hex || "#ffffff";
    const opacity = color?.opacity || 1;
    const strokeColor =
      fillColor === "#ffffff" || fillColor === "#fffbeb" ? "#333" : "#000";

    // Calculate proportional dimensions based on width and length
    const aspectRatio =
      customization.dimensions.width / customization.dimensions.length;
    const baseWidth = Math.min(200, Math.max(120, aspectRatio * 150));
    const baseHeight = baseWidth / aspectRatio;

    // Scale viewBox proportionally
    const viewBoxWidth = 100;
    const viewBoxHeight = 100 / aspectRatio;

    switch (template) {
      case "t-shirt":
        return (
          <div
            className="mx-auto relative"
            style={{ width: `${baseWidth}px`, height: `${baseHeight}px` }}
          >
            <svg
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              className="w-full h-full"
            >
              <path
                d={`M15 ${viewBoxHeight * 0.3} L15 15 L25 15 L25 ${viewBoxHeight * 0.27} L50 ${viewBoxHeight * 0.27} L75 ${viewBoxHeight * 0.27} L75 15 L85 15 L85 ${viewBoxHeight * 0.3} L85 ${viewBoxHeight * 0.92} L15 ${viewBoxHeight * 0.92} Z`}
                fill={fillColor}
                fillOpacity={opacity}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              <path
                d={`M25 15 C 25 22 25 ${viewBoxHeight * 0.23} 25 ${viewBoxHeight * 0.27} L50 ${viewBoxHeight * 0.27} C 50 ${viewBoxHeight * 0.23} 50 22 50 15`}
                fill="white"
                stroke={strokeColor}
                strokeWidth="1"
              />
              <path
                d={`M50 15 C 50 22 50 ${viewBoxHeight * 0.23} 50 ${viewBoxHeight * 0.27} L75 ${viewBoxHeight * 0.27} C 75 ${viewBoxHeight * 0.23} 75 22 75 15`}
                fill="white"
                stroke={strokeColor}
                strokeWidth="1"
              />
            </svg>
          </div>
        );

      case "t-shirt-hook":
        return (
          <div
            className="mx-auto relative"
            style={{ width: `${baseWidth}px`, height: `${baseHeight}px` }}
          >
            <svg
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              className="w-full h-full"
            >
              <path
                d={`M15 ${viewBoxHeight * 0.3} L15 15 L25 15 L25 ${viewBoxHeight * 0.27} L50 ${viewBoxHeight * 0.27} L75 ${viewBoxHeight * 0.27} L75 15 L85 15 L85 ${viewBoxHeight * 0.3} L85 ${viewBoxHeight * 0.92} L15 ${viewBoxHeight * 0.92} Z`}
                fill={fillColor}
                fillOpacity={opacity}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              <path
                d={`M25 15 C 25 22 25 ${viewBoxHeight * 0.23} 25 ${viewBoxHeight * 0.27} L50 ${viewBoxHeight * 0.27} C 50 ${viewBoxHeight * 0.23} 50 22 50 15`}
                fill="white"
                stroke={strokeColor}
                strokeWidth="1"
              />
              <path
                d={`M50 15 C 50 22 50 ${viewBoxHeight * 0.23} 50 ${viewBoxHeight * 0.27} L75 ${viewBoxHeight * 0.27} C 75 ${viewBoxHeight * 0.23} 75 22 75 15`}
                fill="white"
                stroke={strokeColor}
                strokeWidth="1"
              />
              <ellipse
                cx="50"
                cy="10"
                rx="3"
                ry="2"
                fill="white"
                stroke={strokeColor}
                strokeWidth="1"
              />
            </svg>
          </div>
        );

      case "d-cut":
        return (
          <div
            className="mx-auto relative"
            style={{ width: `${baseWidth}px`, height: `${baseHeight}px` }}
          >
            <svg
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              className="w-full h-full"
            >
              <rect
                x="20"
                y={viewBoxHeight * 0.08}
                width="60"
                height={viewBoxHeight * 0.84}
                fill={fillColor}
                fillOpacity={opacity}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              <path
                d={`M35 ${viewBoxHeight * 0.12} L65 ${viewBoxHeight * 0.12} C 70 ${viewBoxHeight * 0.12} 70 ${viewBoxHeight * 0.19} 65 ${viewBoxHeight * 0.19} L35 ${viewBoxHeight * 0.19} C 30 ${viewBoxHeight * 0.19} 30 ${viewBoxHeight * 0.12} 35 ${viewBoxHeight * 0.12} Z`}
                fill="white"
                stroke={strokeColor}
                strokeWidth="1"
              />
            </svg>
          </div>
        );

      case "non-cut":
        return (
          <div
            className="mx-auto relative"
            style={{ width: `${baseWidth}px`, height: `${baseHeight}px` }}
          >
            <svg
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              className="w-full h-full"
            >
              <rect
                x="25"
                y={viewBoxHeight * 0.15}
                width="50"
                height={viewBoxHeight * 0.69}
                fill={fillColor}
                fillOpacity={opacity}
                stroke={strokeColor}
                strokeWidth="1.5"
                rx="2"
              />
              <line
                x1="25"
                y1="30"
                x2="75"
                y2="30"
                stroke={strokeColor}
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            </svg>
          </div>
        );

      case "sheet":
        return (
          <div
            className="mx-auto relative"
            style={{ width: `${baseWidth}px`, height: `${baseHeight}px` }}
          >
            <svg
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              className="w-full h-full"
            >
              <rect
                x="15"
                y={viewBoxHeight * 0.19}
                width="70"
                height={viewBoxHeight * 0.61}
                fill={fillColor}
                fillOpacity={opacity}
                stroke={strokeColor}
                strokeWidth="1.5"
                rx="1"
              />
              <line
                x1="15"
                y1={viewBoxHeight * 0.27}
                x2="85"
                y2={viewBoxHeight * 0.27}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              <line
                x1="20"
                y1={viewBoxHeight * 0.19}
                x2="20"
                y2={viewBoxHeight * 0.81}
                stroke={strokeColor}
                strokeWidth="1"
                strokeDasharray="1,1"
              />
              <line
                x1="80"
                y1={viewBoxHeight * 0.19}
                x2="80"
                y2={viewBoxHeight * 0.81}
                stroke={strokeColor}
                strokeWidth="1"
                strokeDasharray="1,1"
              />
            </svg>
          </div>
        );

      case "zipper-pouch":
        return (
          <div
            className="mx-auto relative"
            style={{ width: `${baseWidth}px`, height: `${baseHeight}px` }}
          >
            <svg
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              className="w-full h-full"
            >
              <rect
                x="20"
                y={viewBoxHeight * 0.19}
                width="60"
                height={viewBoxHeight * 0.62}
                fill={fillColor}
                fillOpacity={opacity}
                stroke={strokeColor}
                strokeWidth="1.5"
                rx="3"
              />
              <rect
                x="20"
                y={viewBoxHeight * 0.15}
                width="60"
                height={viewBoxHeight * 0.06}
                fill="#666"
                stroke={strokeColor}
                strokeWidth="1"
                rx="1"
              />
              <line
                x1="25"
                y1={viewBoxHeight * 0.18}
                x2="75"
                y2={viewBoxHeight * 0.18}
                stroke="white"
                strokeWidth="1"
                strokeDasharray="2,1"
              />
            </svg>
          </div>
        );

      default:
        return (
          <div className="w-32 h-40 mx-auto bg-gray-200 rounded flex items-center justify-center">
            <Package className="h-16 w-16 text-gray-400" />
          </div>
        );
    }
  };

  const generateQuote = () => {
    const quoteData = {
      id: `QUOTE-${Date.now()}`,
      customer: customization.customerInfo,
      product: {
        type: PRODUCT_TYPES.find((p) => p.id === customization.productType)
          ?.name,
        template: TEMPLATES.find((t) => t.id === customization.template)?.name,
        dimensions: customization.dimensions,
        material: MATERIAL_COLORS.find(
          (c) => c.id === customization.materialColor,
        )?.name,
        colors: customization.designColors.length,
        quantity: customization.quantity,
      },
      pricing: {
        estimatedCost: estimatedCost,
        unitPrice:
          Math.round((estimatedCost / customization.quantity) * 100) / 100,
        currency: "USD",
      },
      notes: customization.notes,
      timestamp: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };

    const blob = new Blob([JSON.stringify(quoteData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quote-${quoteData.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Quote Generated",
      description:
        "Quote has been generated and downloaded. We'll contact you within 24 hours.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("tools.order_design.title")}
            </h1>
            <p className="text-gray-600 mt-2">
              {t("tools.order_design.description")}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              {t("tools.order_design.save_draft")}
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              {t("tools.order_design.share")}
            </Button>
          </div>
        </div>

        {/* Enhanced Progress Steps */}
        <div className="relative">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center z-10 bg-white px-2"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all ${
                    index < currentStep
                      ? "bg-green-500 text-white border-green-500"
                      : index === currentStep
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 text-gray-500 border-gray-300"
                  }`}
                >
                  {index < currentStep ? "✓" : index + 1}
                </div>
                <span className="text-xs mt-2 text-center max-w-20 font-medium">
                  {step}
                </span>
              </div>
            ))}
          </div>
          {/* Progress Line */}
          <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 -z-10">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold text-sm">
                    {currentStep + 1}
                  </span>
                </div>
                {steps[currentStep]}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {/* Step 0: Product & Template Selection */}
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div>
                    <Label className="text-lg font-semibold mb-6 block">
                      Select Product Type
                    </Label>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {PRODUCT_TYPES.map((product) => (
                        <div
                          key={product.id}
                          onClick={() =>
                            setCustomization((prev) => ({
                              ...prev,
                              productType: product.id,
                              template: "",
                            }))
                          }
                          className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                            customization.productType === product.id
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-3xl mb-3 text-center">
                            {product.icon}
                          </div>
                          <div className="font-semibold text-center mb-2">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-600 text-center">
                            {product.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {customization.productType && (
                    <div>
                      <Label className="text-lg font-semibold mb-6 block">
                        Select Template Design
                      </Label>
                      <div className="grid gap-4">
                        {TEMPLATES.filter((template) =>
                          template.productTypes.includes(
                            customization.productType,
                          ),
                        ).map((template) => (
                          <div
                            key={template.id}
                            onClick={() =>
                              setCustomization((prev) => ({
                                ...prev,
                                template: template.id,
                              }))
                            }
                            className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                              customization.template === template.id
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0">
                                {renderTemplatePreview(template.id, "white")}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-lg mb-2">
                                  {template.name}
                                </div>
                                <div className="text-gray-600 mb-3">
                                  {template.description}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {template.features.map((feature, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Specifications */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div>
                    <Label className="text-lg font-semibold mb-6 block">
                      Product Dimensions
                    </Label>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="width" className="font-medium">
                          Width (cm)
                        </Label>
                        <Input
                          id="width"
                          type="number"
                          value={customization.dimensions.width}
                          onChange={(e) =>
                            setCustomization((prev) => ({
                              ...prev,
                              dimensions: {
                                ...prev.dimensions,
                                width: Number(e.target.value),
                              },
                            }))
                          }
                          min="10"
                          max="100"
                          className="text-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="length" className="font-medium">
                          Length (cm)
                        </Label>
                        <Input
                          id="length"
                          type="number"
                          value={customization.dimensions.length}
                          onChange={(e) =>
                            setCustomization((prev) => ({
                              ...prev,
                              dimensions: {
                                ...prev.dimensions,
                                length: Number(e.target.value),
                              },
                            }))
                          }
                          min="10"
                          max="150"
                          className="text-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gusset" className="font-medium">
                          Gusset (cm)
                        </Label>
                        <Input
                          id="gusset"
                          type="number"
                          value={customization.dimensions.gusset}
                          onChange={(e) =>
                            setCustomization((prev) => ({
                              ...prev,
                              dimensions: {
                                ...prev.dimensions,
                                gusset: Number(e.target.value),
                              },
                            }))
                          }
                          min="0"
                          max="30"
                          className="text-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="thickness" className="font-medium">
                          Thickness (mm)
                        </Label>
                        <Input
                          id="thickness"
                          type="number"
                          step="0.01"
                          value={customization.dimensions.thickness}
                          onChange={(e) =>
                            setCustomization((prev) => ({
                              ...prev,
                              dimensions: {
                                ...prev.dimensions,
                                thickness: Number(e.target.value),
                              },
                            }))
                          }
                          min="0.01"
                          max="0.20"
                          className="text-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-lg font-semibold mb-6 block">
                      Quantity & Requirements
                    </Label>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="quantity" className="font-medium">
                          Order Quantity
                        </Label>
                        <Select
                          value={customization.quantity.toString()}
                          onValueChange={(value) =>
                            setCustomization((prev) => ({
                              ...prev,
                              quantity: Number(value),
                            }))
                          }
                        >
                          <SelectTrigger className="text-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="500">500 pieces</SelectItem>
                            <SelectItem value="1000">1,000 pieces</SelectItem>
                            <SelectItem value="2500">2,500 pieces</SelectItem>
                            <SelectItem value="5000">5,000 pieces</SelectItem>
                            <SelectItem value="10000">10,000 pieces</SelectItem>
                            <SelectItem value="25000">25,000 pieces</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-xl">
                    <div className="flex items-center mb-3">
                      <Calculator className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-blue-900">
                        Size Optimization
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Surface Area:</span>
                        <span className="font-medium ml-2">
                          {(
                            (customization.dimensions.width *
                              customization.dimensions.length) /
                            100
                          ).toFixed(1)}{" "}
                          cm²
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700">Aspect Ratio:</span>
                        <span className="font-medium ml-2">
                          {(
                            customization.dimensions.width /
                            customization.dimensions.length
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Material Color */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg font-semibold mb-6 block">
                      Select Material Color
                    </Label>
                    <div className="grid grid-cols-4 gap-4">
                      {MATERIAL_COLORS.map((color) => (
                        <div
                          key={color.id}
                          onClick={() =>
                            setCustomization((prev) => ({
                              ...prev,
                              materialColor: color.id,
                            }))
                          }
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                            customization.materialColor === color.id
                              ? "border-blue-500 ring-2 ring-blue-200 shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className={`w-full h-12 rounded-lg mb-3 ${color.border ? "border border-gray-300" : ""}`}
                            style={{
                              backgroundColor: color.hex,
                              opacity: color.opacity || 1,
                            }}
                          ></div>
                          <div className="text-sm text-center font-medium">
                            {color.name}
                          </div>
                          {color.id === "clear" && (
                            <div className="text-xs text-center text-gray-500 mt-1">
                              See-through
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Design Upload */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div>
                    <Label className="text-lg font-semibold mb-6 block">
                      Upload Logo or Design (Optional)
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                      <div className="space-y-4">
                        <div>
                          <p className="text-xl font-semibold text-gray-700">
                            Upload your design file
                          </p>
                          <p className="text-gray-600 mt-2">
                            Supports: AI, EPS, PDF, PNG, JPG, SVG (Max 10MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          accept=".ai,.eps,.pdf,.png,.jpg,.jpeg,.svg"
                          className="hidden"
                          id="design-upload"
                        />
                        <Button
                          onClick={() =>
                            document.getElementById("design-upload")?.click()
                          }
                          size="lg"
                          className="px-8"
                        >
                          <Upload className="h-5 w-5 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    </div>

                    {customization.uploadedDesign && (
                      <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-semibold text-green-800 text-lg">
                            {customization.uploadedDesign.name}
                          </span>
                        </div>
                        <p className="text-green-700">
                          Design uploaded successfully and will be vectorized
                          for optimal printing quality
                        </p>
                      </div>
                    )}

                    {designPreview && (
                      <div className="mt-6">
                        <Label className="text-base font-semibold mb-3 block">
                          Design Preview
                        </Label>
                        <div className="border rounded-xl p-6 bg-white shadow-sm">
                          <img
                            src={designPreview}
                            alt="Design preview"
                            className="max-w-full max-h-80 mx-auto object-contain rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Design Editor */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div>
                    <Label className="text-lg font-semibold mb-6 block">
                      {t("tools.order_design.design.design_editor_title")}
                    </Label>

                    {/* Enhanced Tool Selection */}
                    <div className="flex space-x-3 mb-6">
                      <Button
                        variant={
                          selectedTool === "rectangle"
                            ? "default"
                            : ("outline" as any)
                        }
                        onClick={() => setSelectedTool("rectangle")}
                        className="flex-1"
                      >
                        <Square className="h-4 w-4 mr-2" /> {t("tools.order_design.design.tools.rectangle")}
                      </Button>
                      <Button
                        variant={
                          selectedTool === "circle"
                            ? "default"
                            : ("outline" as any)
                        }
                        onClick={() => setSelectedTool("circle")}
                        className="flex-1"
                      >
                        <Circle className="h-4 w-4 mr-2" /> {t("tools.order_design.design.tools.circle")}
                      </Button>
                      <Button
                        variant={
                          selectedTool === "text"
                            ? "default"
                            : ("outline" as any)
                        }
                        onClick={() => setSelectedTool("text")}
                        className="flex-1"
                      >
                        <Type className="h-4 w-4 mr-2" /> {t("tools.order_design.design.tools.text")}
                      </Button>
                      <Button
                        variant={
                          selectedTool === "move"
                            ? "default"
                            : ("outline" as any)
                        }
                        onClick={() => setSelectedTool("move")}
                        className="flex-1"
                      >
                        <Move className="h-4 w-4 mr-2" /> {t("tools.order_design.design.tools.move")}
                      </Button>
                    </div>

                    {/* Text Size Control */}
                    {selectedTool === "text" && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <Label className="text-sm font-medium mb-3 block">
                          {t("tools.order_design.design.text_settings.text_size")}: {textSize}px
                        </Label>
                        <Slider
                          value={[textSize]}
                          onValueChange={(value) => setTextSize(value[0])}
                          min={8}
                          max={72}
                          step={2}
                          className="w-full"
                        />
                      </div>
                    )}

                    {/* Enhanced Color Palette */}
                    <div className="mb-6">
                      <Label className="text-base font-semibold mb-4 block">
                        {t("tools.order_design.design.colors_title")}
                      </Label>
                      <div className="flex space-x-3 mb-4">
                        {DESIGN_COLORS.map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              setSelectedColor(color);
                              addDesignColor(color);
                            }}
                            className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-105 ${
                              selectedColor === color
                                ? "border-blue-500 ring-2 ring-blue-200"
                                : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      {/* Selected Colors Display */}
                      {customization.designColors.length > 0 && (
                        <div className="flex space-x-3 items-center">
                          <span className="text-sm font-medium text-gray-700">
                            {t("tools.order_design.design.selected_colors")}:
                          </span>
                          {customization.designColors.map((color) => (
                            <Badge
                              key={color}
                              variant="secondary"
                              className="flex items-center space-x-2 px-3 py-1"
                            >
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: color }}
                              ></div>
                              <button
                                onClick={() => removeDesignColor(color)}
                                className="text-sm hover:text-red-500 font-bold"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                          <span className="text-sm text-gray-500">
                            ({customization.designColors.length}/4)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Drawing Canvas */}
                    <div className="border-2 rounded-xl p-6 bg-white shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <Label className="text-base font-semibold">
                          {t("tools.order_design.design.canvas_title")}
                        </Label>
                        <Button
                          variant="outline"
                          onClick={clearCanvas}
                          className="flex items-center"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" /> {t("tools.order_design.design.clear_canvas")}
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <canvas
                          ref={canvasRef}
                          width={500}
                          height={350}
                          className={`border-2 border-gray-200 w-full max-w-2xl mx-auto rounded-lg bg-white ${
                            selectedTool === "move"
                              ? "cursor-move"
                              : selectedTool === "text"
                                ? "cursor-text"
                                : "cursor-crosshair"
                          }`}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                        />
                      </div>
                    </div>

                    {/* Text Input Dialog */}
                    {showTextDialog && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                          <h3 className="text-lg font-semibold mb-4">
                            {t("tools.order_design.design.text_settings.add_text")}
                          </h3>
                          <Input
                            type="text"
                            placeholder={t("tools.order_design.design.text_settings.text_placeholder")}
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            className="mb-4"
                            autoFocus
                          />
                          <div className="mb-4">
                            <Label className="text-sm font-medium mb-2 block">
                              {t("tools.order_design.design.text_settings.font_size")}: {textSize}px
                            </Label>
                            <Slider
                              value={[textSize]}
                              onValueChange={(value) => setTextSize(value[0])}
                              min={8}
                              max={72}
                              step={2}
                              className="w-full"
                            />
                          </div>
                          <div className="flex space-x-3">
                            <Button
                              onClick={addTextElement}
                              disabled={!textInput.trim()}
                              className="flex-1"
                            >
                              {t("tools.order_design.design.text_settings.add_text")}
                            </Button>
                            <Button
                              variant={"outline" as any}
                              onClick={() => {
                                setShowTextDialog(false);
                                setTextInput("");
                              }}
                              className="flex-1"
                            >
                              {t("tools.order_design.common.cancel")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Selected Element Controls */}
                    {selectedElement !== null &&
                      canvasElements[selectedElement] && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="text-sm font-semibold mb-3 text-blue-800">
                            {t("tools.order_design.design.text_settings.element_selected")}
                          </h4>
                          <div className="flex space-x-3">
                            <Button
                              onClick={() => {
                                const newElements = canvasElements.filter(
                                  (_, index) => index !== selectedElement,
                                );
                                setCanvasElements(newElements);
                                setSelectedElement(null);
                                redrawCanvas();
                              }}
                              variant={"destructive" as any}
                              size={"sm" as any}
                              className="flex-1"
                            >
                              {t("tools.order_design.design.text_settings.delete_element")}
                            </Button>
                            <Button
                              onClick={() => setSelectedElement(null)}
                              variant={"outline" as any}
                              size={"sm" as any}
                              className="flex-1"
                            >
                              {t("tools.order_design.design.text_settings.deselect")}
                            </Button>
                          </div>
                          {canvasElements[selectedElement]?.type === "text" && (
                            <div className="mt-3">
                              <Label className="text-sm font-medium mb-2 block">
                                Font Size:{" "}
                                {canvasElements[selectedElement]?.fontSize ||
                                  16}
                                px
                              </Label>
                              <Slider
                                value={[
                                  canvasElements[selectedElement]?.fontSize ||
                                    16,
                                ]}
                                onValueChange={(value) => {
                                  const newElements = [...canvasElements];
                                  newElements[selectedElement].fontSize =
                                    value[0];
                                  setCanvasElements(newElements);
                                  redrawCanvas();
                                }}
                                min={8}
                                max={72}
                                step={2}
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Step 5: Customer Information */}
              {currentStep === 5 && (
                <div className="space-y-8">
                  <div>
                    <Label className="text-lg font-semibold mb-6 block">
                      {t("tools.order_design.customer.title")}
                    </Label>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="customerName" className="font-medium">
                          {t("tools.order_design.customer.full_name")} *
                        </Label>
                        <Input
                          id="customerName"
                          type="text"
                          value={customization.customerInfo.name}
                          onChange={(e) =>
                            setCustomization((prev) => ({
                              ...prev,
                              customerInfo: {
                                ...prev.customerInfo,
                                name: e.target.value,
                              },
                            }))
                          }
                          placeholder={t("tools.order_design.customer.name_placeholder")}
                          className="text-lg"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerEmail" className="font-medium">
                          {t("tools.order_design.customer.email")} *
                        </Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          value={customization.customerInfo.email}
                          onChange={(e) =>
                            setCustomization((prev) => ({
                              ...prev,
                              customerInfo: {
                                ...prev.customerInfo,
                                email: e.target.value,
                              },
                            }))
                          }
                          placeholder={t("tools.order_design.customer.email_placeholder")}
                          className="text-lg"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerPhone" className="font-medium">
                          {t("tools.order_design.customer.phone")}
                        </Label>
                        <Input
                          id="customerPhone"
                          type="tel"
                          value={customization.customerInfo.phone}
                          onChange={(e) =>
                            setCustomization((prev) => ({
                              ...prev,
                              customerInfo: {
                                ...prev.customerInfo,
                                phone: e.target.value,
                              },
                            }))
                          }
                          placeholder={t("tools.order_design.customer.phone_placeholder")}
                          className="text-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes" className="font-medium">
                          {t("tools.order_design.customer.notes")}
                        </Label>
                        <textarea
                          id="notes"
                          value={customization.notes}
                          onChange={(e) =>
                            setCustomization((prev) => ({
                              ...prev,
                              notes: e.target.value,
                            }))
                          }
                          placeholder={t("tools.order_design.customer.notes_placeholder")}
                          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Review & Quote */}
              {currentStep === 6 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">
                      {t("tools.order_design.quote.title")}
                    </h3>

                    {/* Enhanced Product Preview */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-inner">
                      <div className="mb-6">
                        {renderTemplatePreview(
                          customization.template,
                          customization.materialColor,
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div className="space-y-3">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <strong className="text-gray-700 block mb-2">
                              {t("tools.order_design.quote.product_details")}
                            </strong>
                            <div className="space-y-1 text-sm">
                              <div>
                                {t("tools.order_design.quote.type")}:{" "}
                                {
                                  PRODUCT_TYPES.find(
                                    (p) => p.id === customization.productType,
                                  )?.name
                                }
                              </div>
                              <div>
                                {t("tools.order_design.quote.template")}:{" "}
                                {
                                  TEMPLATES.find(
                                    (t) => t.id === customization.template,
                                  )?.name
                                }
                              </div>
                              <div>
                                {t("tools.order_design.quote.material")}:{" "}
                                {
                                  MATERIAL_COLORS.find(
                                    (c) => c.id === customization.materialColor,
                                  )?.name
                                }
                              </div>
                              <div>
                                {t("tools.order_design.quote.quantity")}:{" "}
                                {customization.quantity.toLocaleString()} {t("tools.order_design.quote.pieces")}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <strong className="text-gray-700 block mb-2">
                              {t("tools.order_design.quote.specifications")}
                            </strong>
                            <div className="space-y-1 text-sm">
                              <div>
                                {t("tools.order_design.quote.width")}: {customization.dimensions.width} cm
                              </div>
                              <div>
                                {t("tools.order_design.quote.length")}: {customization.dimensions.length} cm
                              </div>
                              <div>
                                {t("tools.order_design.quote.gusset")}: {customization.dimensions.gusset} cm
                              </div>
                              <div>
                                {t("tools.order_design.quote.thickness")}: {customization.dimensions.thickness}{" "}
                                mm
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {customization.designColors.length > 0 && (
                        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                          <strong className="text-gray-700 block mb-3">
                            Printing Colors
                          </strong>
                          <div className="flex justify-center space-x-3">
                            {customization.designColors.map((color, index) => (
                              <div key={index} className="text-center">
                                <div
                                  className="w-8 h-8 rounded-full border-2 border-gray-300 mx-auto mb-1"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-xs text-gray-600">
                                  {t("tools.order_design.design.color")} {index + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Customer Information */}
                      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                        <strong className="text-gray-700 block mb-2">
                          {t("tools.order_design.quote.customer_info")}
                        </strong>
                        <div className="text-sm space-y-1">
                          <div>{t("tools.order_design.quote.name")}: {customization.customerInfo.name}</div>
                          <div>{t("tools.order_design.quote.email")}: {customization.customerInfo.email}</div>
                          {customization.customerInfo.phone && (
                            <div>{t("tools.order_design.quote.phone")}: {customization.customerInfo.phone}</div>
                          )}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="mt-6 bg-blue-50 p-6 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-center mb-4">
                          <Zap className="h-6 w-6 text-blue-600 mr-2" />
                          <strong className="text-xl text-blue-900">
                            {t("tools.order_design.quote.estimated_quote")}
                          </strong>
                        </div>
                        <div className="space-y-4">
                          {/* Cost Breakdown */}
                          <div className="space-y-3 text-left">
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                              <span className="text-gray-700">
                                1. {t("tools.order_design.quote.cliches_cost")}:
                              </span>
                              <span className="font-semibold text-blue-600">
                                {clichesCost.toLocaleString()} SR
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 pl-3">
                              ({customization.dimensions.width} ×{" "}
                              {customization.dimensions.length} cm² ×{" "}
                              {Math.max(customization.designColors.length, 1)}{" "}
                              {t("tools.order_design.quote.colors")} × 0.5 SR)
                            </div>

                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                              <span className="text-gray-700">
                                2. {t("tools.order_design.quote.bags_cost")}:
                              </span>
                              <span className="font-semibold text-blue-600">
                                {bagsCost.toLocaleString()} SR
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 pl-3">
                              (Min. {minimumKg} kg × 10 SR/kg for{" "}
                              {Math.max(customization.designColors.length, 1)}{" "}
                              {t("tools.order_design.quote.color")}
                              {Math.max(customization.designColors.length, 1) >
                              1
                                ? "s"
                                : ""}
                              )
                            </div>
                          </div>

                          {/* Total */}
                          <div className="border-t border-blue-200 pt-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600 mb-2">
                                {t("tools.order_design.quote.total")}: {estimatedCost.toLocaleString()} SR
                              </div>
                              <div className="text-sm text-blue-700">
                                {t("tools.order_design.quote.unit_price")}:{" "}
                                {(
                                  estimatedCost / customization.quantity
                                ).toFixed(3)}{" "}
                                SR {t("tools.order_design.quote.per_piece")}
                              </div>
                              <div className="text-xs text-blue-600 mt-2">
                                *{t("tools.order_design.quote.pricing_note")}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={handleDownloadPDF}
                        size="lg"
                        className="px-8"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        {t("tools.order_design.quote.download_quote")}
                      </Button>
                      <Button
                        onClick={handleSendQuoteRequest}
                        size="lg"
                        className="px-8"
                        disabled={emailQuoteMutation.isPending}
                      >
                        <FileText className="h-5 w-5 mr-2" />
                        {emailQuoteMutation.isPending
                          ? t("tools.order_design.quote.sending")
                          : t("tools.order_design.quote.submit_quote_request")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              size="lg"
              className="px-8"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              {t("tools.order_design.navigation.previous")}
            </Button>

            <Button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1 || !canProceed()}
              size="lg"
              className="px-8"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  {t("tools.order_design.navigation.complete_order")}
                </>
              ) : (
                <>
                  {t("tools.order_design.navigation.next")}
                  <ChevronRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div className="space-y-6">
          {/* Live Preview */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center text-lg">
                <Eye className="h-5 w-5 mr-2" />
                {t("tools.order_design.sidebar.live_preview")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 min-h-64 flex items-center justify-center overflow-hidden">
                {customization.template && customization.materialColor ? (
                  <div className="text-center w-full">
                    <div className="mb-4">
                      {renderTemplatePreview(
                        customization.template,
                        customization.materialColor,
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 font-medium">
                        {
                          TEMPLATES.find((t) => t.id === customization.template)
                            ?.name
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {
                          MATERIAL_COLORS.find(
                            (c) => c.id === customization.materialColor,
                          )?.name
                        }
                      </p>
                      <div className="text-xs text-gray-400 mt-2 space-y-0.5">
                        <p>
                          W: {customization.dimensions.width} cm × L:{" "}
                          {customization.dimensions.length} cm
                        </p>
                        <p>
                          Aspect Ratio:{" "}
                          {(
                            customization.dimensions.width /
                            customization.dimensions.length
                          ).toFixed(2)}
                          :1
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Package className="h-16 w-16 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Select product to see preview</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center text-lg">
                <Ruler className="h-5 w-5 mr-2" />
                Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Width:</span>
                <span className="font-medium">
                  {customization.dimensions.width} cm
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Length:</span>
                <span className="font-medium">
                  {customization.dimensions.length} cm
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Gusset:</span>
                <span className="font-medium">
                  {customization.dimensions.gusset} cm
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Thickness:</span>
                <span className="font-medium">
                  {customization.dimensions.thickness} mm
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">
                  {customization.quantity.toLocaleString()}
                </span>
              </div>
              {customization.materialColor && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-medium">
                    {
                      MATERIAL_COLORS.find(
                        (c) => c.id === customization.materialColor,
                      )?.name
                    }
                  </span>
                </div>
              )}
              {customization.designColors.length > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Print Colors:</span>
                  <span className="font-medium">
                    {customization.designColors.length}/4
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost Estimate */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center text-lg">
                <Calculator className="h-5 w-5 mr-2" />
                Cost Estimate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Cost Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">Clichés Cost:</span>
                    <span className="font-semibold text-blue-600">
                      {clichesCost.toLocaleString()} SR
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">Bags Cost:</span>
                    <span className="font-semibold text-blue-600">
                      {bagsCost.toLocaleString()} SR
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    Total: {estimatedCost.toLocaleString()} SR
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    {(estimatedCost / customization.quantity).toFixed(3)} SR per
                    unit
                  </div>
                  <div className="text-xs text-gray-500">
                    Minimum {minimumKg} kg required for{" "}
                    {Math.max(customization.designColors.length, 1)} color
                    {Math.max(customization.designColors.length, 1) > 1
                      ? "s"
                      : ""}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
