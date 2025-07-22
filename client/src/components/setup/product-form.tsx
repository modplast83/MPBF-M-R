import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "@/lib/constants";
import { useTranslation } from "react-i18next";
import DesignPreview from "./design-preview";
import {
  insertCustomerProductSchema,
  CustomerProduct,
  Customer,
  Category,
  Item,
} from "@shared/schema";
import { 
  User, 
  Package, 
  Layers, 
  Ruler, 
  Palette, 
  FileImage, 
  Settings, 
  Calculator,
  Info
} from "lucide-react";

interface ProductFormProps {
  product?: CustomerProduct;
  onSuccess?: () => void;
  preSelectedCustomerId?: string;
  isDuplicate?: boolean;
}

export function ProductForm({
  product,
  onSuccess,
  preSelectedCustomerId,
  isDuplicate = false,
}: ProductFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isEditing = !!product && !isDuplicate;
  
  // State for file uploads
  const [frontDesignFile, setFrontDesignFile] = useState<File | null>(null);
  const [backDesignFile, setBackDesignFile] = useState<File | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // Fetch required data
  const { data: customers = [], isLoading: customersLoading } = useQuery<
    Customer[]
  >({
    queryKey: [API_ENDPOINTS.CUSTOMERS],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: [API_ENDPOINTS.CATEGORIES],
  });

  const { data: items = [], isLoading: itemsLoading } = useQuery<Item[]>({
    queryKey: [API_ENDPOINTS.ITEMS],
  });

  const { data: masterBatches = [], isLoading: masterBatchesLoading } =
    useQuery<any[]>({
      queryKey: [API_ENDPOINTS.MASTER_BATCHES],
    });

  // Create a simplified schema for the form
  const formSchema = z.object({
    customerId: z.string().min(1, t("setup.products.form.customer_required")),
    categoryId: z.string().min(1, t("setup.products.form.category_required")),
    itemId: z.string().min(1, t("setup.products.form.item_required")),
    sizeCaption: z.string().min(1, "Size caption is required"),
    width: z.number().optional(),
    leftF: z.number().optional(),
    rightF: z.number().optional(),
    thickness: z.number().optional(),
    thicknessOne: z.number().optional(),
    printingCylinder: z.union([z.number(), z.null()]).optional(),
    lengthCm: z.union([z.number(), z.string(), z.null()]).optional(),
    cuttingLength: z.number().optional(),
    rawMaterial: z.string().optional(),
    masterBatchId: z.string().optional(),
    printed: z.boolean().optional(),
    cuttingUnit: z.string().optional(),
    unitWeight: z.number().optional(),
    unitQty: z.number().optional(),
    packageKg: z.number().optional(),
    packing: z.string().optional(),
    punching: z.string().optional(),
    cover: z.string().optional(),
    volum: z.string().nullable().optional(),
    knife: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    clicheFrontDesign: z.string().nullable().optional(),
    clicheBackDesign: z.string().nullable().optional(),
  });

  // Set up the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: product?.customerId || preSelectedCustomerId || "",
      categoryId: product?.categoryId || "",
      itemId: product?.itemId || "",
      sizeCaption: product?.sizeCaption || "",
      width: product?.width || undefined,
      leftF: product?.leftF || undefined,
      rightF: product?.rightF || undefined,
      thickness: product?.thickness || undefined,
      thicknessOne: product?.thicknessOne || undefined,
      printingCylinder: product?.printingCylinder || null,
      lengthCm:
        product?.lengthCm === null || product?.lengthCm === undefined
          ? "Not Printed"
          : product?.lengthCm,
      cuttingLength: product?.cuttingLength || undefined,
      rawMaterial: product?.rawMaterial || "",
      masterBatchId: product?.masterBatchId || "none",
      printed: product?.printed === "Yes" || false,
      cuttingUnit: product?.cuttingUnit || "",
      unitWeight: product?.unitWeight || undefined,
      unitQty: product?.unitQty || undefined,
      packageKg: product?.packageKg || undefined,
      packing: product?.packing || "",
      punching: product?.punching || "",
      cover: product?.cover || "",
      volum: product?.volum || null,
      knife: product?.knife || null,
      notes: product?.notes || null,
      clicheFrontDesign: product?.clicheFrontDesign || null,
      clicheBackDesign: product?.clicheBackDesign || null,
    },
  });

  // Auto-calculate Thickness One when Thickness changes
  const watchedThickness = form.watch("thickness");

  useEffect(() => {
    if (watchedThickness !== undefined && watchedThickness > 0) {
      const calculatedThicknessOne = (watchedThickness / 4) * 10;
      form.setValue("thicknessOne", calculatedThicknessOne);
    }
  }, [watchedThickness, form]);

  // Auto-calculate Length (cm) when Printing Cylinder changes
  const watchedPrintingCylinder = form.watch("printingCylinder");

  useEffect(() => {
    if (
      watchedPrintingCylinder !== undefined &&
      watchedPrintingCylinder !== null &&
      watchedPrintingCylinder > 0
    ) {
      const calculatedLength = Math.round(watchedPrintingCylinder * 2.54);
      form.setValue("lengthCm", calculatedLength);
    } else if (watchedPrintingCylinder === null) {
      // Set "Not Printed" when "Non" is selected
      form.setValue("lengthCm", t("setup.products.form.not_printed"));
    }
  }, [watchedPrintingCylinder, form]);

  // Auto-calculate Size Caption when width, leftF, or rightF change
  const watchedRightF = form.watch("rightF");
  const watchedWidth = form.watch("width");
  const watchedLeftF = form.watch("leftF");
  const watchedLengthCm = form.watch("lengthCm");
  const watchedThicknessOne = form.watch("thicknessOne");

  useEffect(() => {
    const rightF = watchedRightF || 0;
    const leftF = watchedLeftF || 0;
    const width = watchedWidth;

    if (width !== undefined && width > 0) {
      let sizeCaption = "";

      // If both Right F and Left F are null or 0, size caption = Width
      if (rightF === 0 && leftF === 0) {
        sizeCaption = width.toString();
      } else {
        // Otherwise format as "rightF+width+leftF" (only include non-zero values)
        const parts = [];
        if (rightF > 0) parts.push(rightF.toString());
        parts.push(width.toString());
        if (leftF > 0) parts.push(leftF.toString());
        sizeCaption = parts.join("+");
      }

      form.setValue("sizeCaption", sizeCaption);
    }
  }, [watchedWidth, watchedLeftF, watchedRightF, form]);

  // Auto-calculate Package Kg when Unit Weight or Unit Qty change
  const watchedUnitWeight = form.watch("unitWeight");
  const watchedUnitQty = form.watch("unitQty");

  useEffect(() => {
    const unitWeight = watchedUnitWeight || 0;
    const unitQty = watchedUnitQty || 0;

    if (unitWeight > 0 && unitQty > 0) {
      const packageKg = unitWeight * unitQty;
      form.setValue("packageKg", packageKg);
    }
  }, [watchedUnitWeight, watchedUnitQty, form]);

  useEffect(() => {
    if (
      watchedRightF !== undefined &&
      watchedWidth !== undefined &&
      watchedLeftF !== undefined &&
      watchedLengthCm !== undefined &&
      watchedThicknessOne !== undefined &&
      watchedRightF > 0 &&
      watchedWidth > 0 &&
      watchedLeftF > 0 &&
      typeof watchedLengthCm === 'number' && watchedLengthCm > 0 &&
      watchedThicknessOne > 0
    ) {
      const calculatedVolume =
        ((watchedRightF + watchedWidth + watchedLeftF) *
          watchedLengthCm *
          2 *
          watchedThicknessOne) /
        1000;
      form.setValue("volum", calculatedVolume.toFixed(2));
    }
  }, [
    watchedRightF,
    watchedWidth,
    watchedLeftF,
    watchedLengthCm,
    watchedThicknessOne,
    form,
  ]);

  // Auto-calculate Size Caption when dimensions change
  useEffect(() => {
    if (
      watchedWidth !== undefined &&
      watchedLeftF !== undefined &&
      watchedRightF !== undefined &&
      watchedWidth > 0 &&
      watchedLeftF > 0 &&
      watchedRightF > 0
    ) {
      const calculatedSizeCaption = `${watchedWidth}+${watchedLeftF}+${watchedRightF}`;
      form.setValue("sizeCaption", calculatedSizeCaption);
    }
  }, [watchedWidth, watchedLeftF, watchedRightF, form]);

  // Filter items based on selected category
  const watchedCategoryId = form.watch("categoryId");
  const filteredItems =
    items?.filter((item) => item.categoryId === watchedCategoryId) || [];

  // Function to upload file
  const uploadFile = async (file: File, prefix: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prefix', prefix);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('File upload failed');
    }
    
    const result = await response.json();
    return result.filePath;
  };

  // Create mutation for adding/updating product
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      setUploadingFiles(true);
      
      try {
        // Upload files first if they exist
        let frontDesignPath = values.clicheFrontDesign;
        let backDesignPath = values.clicheBackDesign;

        if (frontDesignFile) {
          frontDesignPath = await uploadFile(frontDesignFile, 'cliche-front');
        }

        if (backDesignFile) {
          backDesignPath = await uploadFile(backDesignFile, 'cliche-back');
        }

        // Handle all fields to ensure correct typing and validation
        const payload = {
        customerId: values.customerId,
        categoryId: values.categoryId,
        itemId: values.itemId,
        sizeCaption: values.sizeCaption || "",
        // Convert number fields properly 
        width: values.width !== undefined ? Number(values.width) : null,
        leftF: values.leftF !== undefined ? Number(values.leftF) : null,
        rightF: values.rightF !== undefined ? Number(values.rightF) : null,
        thickness: values.thickness !== undefined ? Number(values.thickness) : null,
        thicknessOne: values.thicknessOne !== undefined ? Number(values.thicknessOne) : null,
        printingCylinder: values.printingCylinder !== undefined && values.printingCylinder !== null ? Number(values.printingCylinder) : null,
        lengthCm: values.lengthCm === "Not Printed" ? null : (values.lengthCm !== undefined && typeof values.lengthCm === "number" ? Number(values.lengthCm) : null),
        cuttingLength: values.cuttingLength !== undefined ? Number(values.cuttingLength) : null,
        unitWeight: values.unitWeight !== undefined ? Number(values.unitWeight) : null,
        unitQty: values.unitQty !== undefined ? Number(values.unitQty) : null,
        packageKg: values.packageKg !== undefined ? Number(values.packageKg) : null,
        // Text fields
        rawMaterial: values.rawMaterial || "",
        masterBatchId: values.masterBatchId === "none" ? null : values.masterBatchId,
        printed: values.printed ? "Yes" : "No",
        cuttingUnit: values.cuttingUnit || "",
        packing: values.packing || "",
        punching: values.punching || "",
        cover: values.cover || "",
        volum: values.volum || null,
        knife: values.knife || null,
        notes: values.notes || null,
        // Add file upload paths
        clicheFrontDesign: frontDesignPath,
        clicheBackDesign: backDesignPath,
      };

        console.log("Submitting customer product with payload:", payload);

        if (isEditing && product && !isDuplicate) {
          // Only do an update if we're editing and not duplicating
          await apiRequest(
            "PUT",
            `${API_ENDPOINTS.CUSTOMER_PRODUCTS}/${product.id}`,
            payload,
          );
        } else {
          // For both new products and duplications, create a new record
          await apiRequest("POST", API_ENDPOINTS.CUSTOMER_PRODUCTS, payload);
        }
      } catch (error) {
        console.error("Error submitting customer product:", error);
        throw error;
      } finally {
        setUploadingFiles(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CUSTOMER_PRODUCTS],
      });

      // Determine the appropriate success message based on the operation type
      let actionTitle = t("setup.products.form.created");
      let actionDescription = t("setup.products.form.created_success");

      if (isDuplicate) {
        actionTitle = t("setup.products.form.duplicated");
        actionDescription = t("setup.products.form.duplicated_success");
      } else if (isEditing) {
        actionTitle = t("setup.products.form.updated");
        actionDescription = t("setup.products.form.updated_success");
      }

      toast({
        title: `${t("setup.products.product_name")} ${actionTitle}`,
        description: actionDescription,
      });

      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      // Determine the appropriate error message based on the operation type
      let actionType = t("setup.products.form.create_failed");
      if (isDuplicate) {
        actionType = t("setup.products.form.duplicate_failed");
      } else if (isEditing) {
        actionType = t("setup.products.form.update_failed");
      }

      const errorMessage = error instanceof Error ? error.message : String(error);
      toast({
        title: t("common.error"),
        description: `${actionType}: ${errorMessage}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  const isLoading =
    customersLoading ||
    categoriesLoading ||
    itemsLoading ||
    masterBatchesLoading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-blue-600" />
              {t("setup.products.form.basic_information")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t("setup.products.customer")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={t("setup.products.form.select_customer")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers?.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{customer.name}</span>
                              {customer.nameAr && (
                                <span className="text-sm text-gray-500 font-arabic">{customer.nameAr}</span>
                              )}
                              <span className="text-xs text-gray-400">({customer.code})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {t("setup.products.category")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={t("setup.products.form.select_category")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{category.name}</span>
                              {category.nameAr && (
                                <span className="text-sm text-gray-500 font-arabic">{category.nameAr}</span>
                              )}
                              <span className="text-xs text-gray-400">({category.code})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="itemId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      {t("setup.products.form.item")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading || !watchedCategoryId}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue
                            placeholder={
                              watchedCategoryId
                                ? t("setup.products.form.select_item")
                                : t("setup.products.form.select_category_first")
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredItems?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sizeCaption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      {t("setup.products.form.size_caption")}
                      <Badge variant="secondary" className="text-xs">Auto</Badge>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("setup.products.form.size_caption_placeholder")}
                        {...field}
                        value={field.value || ""}
                        readOnly
                        className="bg-gray-50 h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dimensions Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ruler className="h-5 w-5 text-green-600" />
              {t("setup.products.form.dimensions")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="rightF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      {t("setup.products.form.right_f")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("setup.products.form.right_f_placeholder")}
                        {...field}
                        className="h-11"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      {t("setup.products.form.width")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("setup.products.form.width_placeholder")}
                        {...field}
                        className="h-11"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leftF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      {t("setup.products.form.left_f")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("setup.products.form.left_f_placeholder")}
                        {...field}
                        className="h-11"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Materials & Technical Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-purple-600" />
              {t("setup.products.form.materials_technical")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="thickness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      {t("setup.products.thickness")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("setup.products.thickness")}
                        {...field}
                        className="h-11"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thicknessOne"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      {t("setup.products.form.thickness_one")}
                      <Badge variant="secondary" className="text-xs">Auto</Badge>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("setup.products.form.thickness_one_placeholder")}
                        {...field}
                        value={field.value || ""}
                        readOnly
                        className="bg-gray-50 h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="printingCylinder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      {t("setup.products.form.printing_cylinder")}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value === "non") {
                          field.onChange(null);
                        } else {
                          field.onChange(parseFloat(value));
                        }
                      }}
                      value={field.value ? field.value.toString() : "non"}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={t("setup.products.form.printing_cylinder_placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="non">{t("setup.products.form.non")}</SelectItem>
                        {[
                          8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36,
                          38, 39,
                        ].map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}"
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Production Settings Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5 text-orange-600" />
              {t("setup.products.form.production_settings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="lengthCm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      {t("setup.products.form.length_cm")}
                      <Badge variant="secondary" className="text-xs">Auto</Badge>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("setup.products.form.length_cm_placeholder")}
                        {...field}
                        value={
                          field.value === t("setup.products.form.not_printed") || field.value === "Not Printed"
                            ? t("setup.products.form.not_printed")
                            : field.value || ""
                        }
                        readOnly
                        className="bg-gray-50 h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cuttingLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      {t("setup.products.form.cutting_length")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("setup.products.form.cutting_length_placeholder")}
                        {...field}
                        className="h-11"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rawMaterial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      {t("setup.products.form.raw_material")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={t("setup.products.form.raw_material_placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="HDPE">HDPE</SelectItem>
                        <SelectItem value="LLDPE">LLDPE</SelectItem>
                        <SelectItem value="Regrind">Regrind</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="masterBatchId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.products.master_batch")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("setup.products.form.master_batch_placeholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">{t("setup.products.form.none")}</SelectItem>
                    {masterBatches?.map((mb) => (
                      <SelectItem key={mb.id} value={mb.id}>
                        {mb.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="printed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.products.form.printed")}</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value ? "true" : "false"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("setup.products.form.printed")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">{t("common.yes")}</SelectItem>
                    <SelectItem value="false">{t("common.no")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="cuttingUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.products.form.cutting_unit")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("setup.products.form.cutting_unit_placeholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Kg.">Kg.</SelectItem>
                    <SelectItem value="ROLL">ROLL</SelectItem>
                    <SelectItem value="PKT">PKT</SelectItem>
                    <SelectItem value="BOX">BOX</SelectItem>
                    <SelectItem value="Peace">Peace</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.products.form.unit_weight")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("setup.products.form.unit_weight_placeholder")}
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitQty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.products.form.unit_qty")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("setup.products.form.unit_qty_placeholder")}
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="packageKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.products.form.package_kg")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("setup.products.form.package_kg_placeholder")}
                    {...field}
                    value={field.value || ""}
                    readOnly
                    className="bg-gray-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="packing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.products.form.packing")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("setup.products.form.packing_placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="punching"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.products.form.punching")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("setup.products.form.punching_placeholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="None">{t("setup.products.form.none")}</SelectItem>
                    <SelectItem value="T-Shirt">T-Shirt</SelectItem>
                    <SelectItem value="T-Shirt w/Hook">
                      T-Shirt w/Hook
                    </SelectItem>
                    <SelectItem value="Banana">Banana</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cover"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.products.form.cover")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("setup.products.form.cover_placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="volum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.products.form.volume")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("setup.products.form.volume_placeholder")}
                    {...field}
                    value={field.value || ""}
                    readOnly
                    className="bg-gray-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="knife"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.products.form.knife")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("setup.products.form.knife_placeholder")}
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.products.form.notes")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("setup.products.form.notes_placeholder")}
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Cliché Design Attachments Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clicheFrontDesign"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.products.form.cliche_front_design")}</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFrontDesignFile(file);
                          field.onChange(`cliche-front-${Date.now()}-${file.name}`);
                        }
                      }}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {field.value && (
                      <div className="text-sm text-green-600">
                        ✓ File selected: {field.value.split('-').slice(2).join('-')}
                      </div>
                    )}
                    {frontDesignFile && (
                      <div className="text-sm text-blue-600">
                        Ready to upload: {frontDesignFile.name}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clicheBackDesign"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.products.form.cliche_back_design")}</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setBackDesignFile(file);
                          field.onChange(`cliche-back-${Date.now()}-${file.name}`);
                        }
                      }}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {field.value && (
                      <div className="text-sm text-green-600">
                        ✓ File selected: {field.value.split('-').slice(2).join('-')}
                      </div>
                    )}
                    {backDesignFile && (
                      <div className="text-sm text-blue-600">
                        Ready to upload: {backDesignFile.name}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            </div>
          </CardContent>
        </Card>

        {/* Design Preview Section */}
        {(form.watch("clicheFrontDesign") || form.watch("clicheBackDesign") || frontDesignFile || backDesignFile) && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Design Preview</h3>
            <DesignPreview
              frontDesignPath={frontDesignFile ? URL.createObjectURL(frontDesignFile) : form.watch("clicheFrontDesign")}
              backDesignPath={backDesignFile ? URL.createObjectURL(backDesignFile) : form.watch("clicheBackDesign")}
              productName={form.watch("sizeCaption") || "Product"}
            />
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          {onSuccess && (
            <Button type="button" variant="outline" onClick={onSuccess}>
              {t("setup.products.form.cancel")}
            </Button>
          )}
          <Button type="submit" disabled={mutation.isPending || uploadingFiles}>
            {uploadingFiles
              ? "Uploading files..."
              : mutation.isPending
              ? t("setup.products.form.submitting")
              : t("setup.products.form.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
