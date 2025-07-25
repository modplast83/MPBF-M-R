import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Plus, Minus, Search, User, Package, FileText, CheckCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import Fuse from "fuse.js";
import { safeSync, handleError } from "@/utils/error-boundary-utils";
import { safeParseInt, safeStringAccess, validateFormData, isValidNumber } from "@/utils/type-safety";
import { FormValidator } from "@/utils/form-validation";
import { ApiErrorHandler } from "@/utils/api-error-handler";
import React from "react";

// Error Boundary Component for New Order Page
class NewOrderErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    handleError(error, { 
      component: 'NewOrderPage',
      errorInfo: errorInfo.componentStack 
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-container">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-destructive">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                An error occurred while loading the new order page. Please try refreshing the page.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Product Details Display Component
function ProductDetailsDisplay({ productId, getProductDetails, getItemName, getCategoryName, t }: {
  productId: number;
  getProductDetails: (id: number) => Product | null;
  getItemName: (itemId: string) => string;
  getCategoryName: (categoryId: string) => string;
  t: (key: string) => string;
}) {
  const details = safeSync(() => getProductDetails(productId), null, { productId });
  
  if (!details) {
    return (
      <div className="mt-4 p-3 bg-muted rounded-md">
        <p className="text-sm text-muted-foreground">
          {t('orders.product_details_unavailable')}
        </p>
      </div>
    );
  }
  
  const itemName = details.itemId ? getItemName(details.itemId) : 'Unknown Item';
  
  return (
    <div className="mt-4 p-3 bg-muted rounded-md">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        {details.sizeCaption && (
          <div>
            <span className="font-medium">{t('orders.size')}: </span>
            {details.sizeCaption}
          </div>
        )}
        {details.itemId && (
          <div>
            <span className="font-medium">{t('orders.item_name')}: </span>
            {itemName}
          </div>
        )}
        {details.rawMaterial && (
          <div>
            <span className="font-medium">{t('orders.raw_material')}: </span>
            {details.rawMaterial}
          </div>
        )}
        {details.categoryId && (
          <div>
            <span className="font-medium">{t('orders.category')}: </span>
            {getCategoryName(details.categoryId)}
          </div>
        )}
        {details.thickness && (
          <div>
            <span className="font-medium">{t('orders.thickness')}: </span>
            {details.thickness}µm
          </div>
        )}
        {details.width && details.lengthCm && (
          <div>
            <span className="font-medium">{t('orders.dimensions')}: </span>
            {details.width}x{details.lengthCm}cm
          </div>
        )}
        {details.notes && (
          <div>
            <span className="font-medium">{t('orders.notes')}: </span>
            {details.notes}
          </div>
        )}
      </div>
    </div>
  );
}

// Order form validation schema
const orderFormSchema = z.object({
  customerId: z.string().min(1, "Please select a customer"),
  notes: z.string().optional(),
  products: z.array(z.object({
    productId: z.number().min(1, "Product is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
  })).min(1, "At least one product is required"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface Customer {
  id: string;
  name: string;
  nameAr?: string;
  code?: string;
  plateDrawerCode?: string;
}

interface Product {
  id: number;
  customerId: string;
  categoryId: string;
  itemId: string;
  sizeCaption?: string;
  width?: number;
  leftF?: number;
  rightF?: number;
  thickness?: number;
  thicknessOne?: number;
  printingCylinder?: number;
  lengthCm?: number;
  cuttingLength?: number;
  rawMaterial?: string;
  masterBatchId?: string;
  printed?: string;
  cuttingUnit?: string;
  unitWeight?: number;
  unitQty?: number;
  packageKg?: number;
  packing?: string;
  punching?: string;
  cover?: string;
  volum?: string;
  knife?: string;
  notes?: string;
}

interface Item {
  id: string;
  categoryId: string;
  name: string;
  fullName: string;
}

interface Category {
  id: string;
  name: string;
  displayName: string;
}

export default function NewOrderPage() {
  const { t } = useTranslation();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<{ productId: number; quantity: number }[]>([]);

  // Initialize form with default values
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerId: "",
      notes: "",
      products: [],
    },
  });

  // Fetch customers
  const { data: customers = [], isLoading: customersLoading } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
  });

  // Fetch items for item names
  const { data: items = [] } = useQuery<Item[]>({
    queryKey: ['/api/items'],
  });

  // Fetch categories for category names
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Fetch master batches for master batch names
  const { data: masterBatches = [] } = useQuery<{ id: string; name: string }[]>({
    queryKey: ['/api/master-batches'],
  });

  // Fetch products for selected customer
  const { data: customerProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/customers', selectedCustomer?.id, 'products'],
    queryFn: async () => {
      if (!selectedCustomer?.id) return [];
      const response = await fetch(`/api/customers/${selectedCustomer.id}/products`);
      if (!response.ok) throw new Error('Failed to fetch customer products');
      return response.json();
    },
    enabled: !!selectedCustomer?.id,
  });

  // Search customers with fuzzy search
  const customersFuse = new Fuse(customers, {
    keys: ['name', 'nameAr', 'code'],
    threshold: 0.3,
    includeScore: true,
  });

  const filteredCustomers = customerSearch
    ? customersFuse.search(customerSearch).map(result => result.item)
    : customers;

  // Helper function to calculate extra quantity based on punching type
  const calculateJobOrderQuantity = (baseQuantity: number, punching: string): number => {
    let extraPercentage = 0;
    
    // Apply extra quantity based on punching type
    switch (punching) {
      case 'T-Shirt':
        extraPercentage = 20; // 20% extra
        break;
      case 'T-Shirt w/Hook':
        extraPercentage = 20; // 20% extra
        break;
      case 'Banana':
        extraPercentage = 10; // 10% extra
        break;
      case 'None':
        extraPercentage = 5; // 5% extra
        break;
      default:
        extraPercentage = 5; // 5% extra for any other punching types
        break;
    }
    
    return baseQuantity + (baseQuantity * extraPercentage / 100);
  };

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderFormValues) => {
      // First create the order with proper field names
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: data.customerId,
          note: data.notes, // Use 'note' field name as expected by backend
        }),
      });
      
      if (!orderResponse.ok) throw new Error('Failed to create order');
      const order = await orderResponse.json();

      // Then create job orders for each product with calculated quantities
      for (const product of data.products) {
        // Find the customer product to get punching type
        const customerProduct = customerProducts.find(cp => cp.id === product.productId);
        const punching = customerProduct?.punching || 'None';
        
        // Calculate the final quantity with extra percentage
        const finalQuantity = calculateJobOrderQuantity(product.quantity, punching);
        
        const jobOrderResponse = await fetch('/api/job-orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            customerProductId: product.productId,
            quantity: finalQuantity,
          }),
        });
        
        if (!jobOrderResponse.ok) {
          throw new Error('Failed to create job order');
        }
      }

      return order;
    },
    onSuccess: (data) => {
      toast({
        title: t('orders.order_created'),
        description: t('orders.order_created_success', { id: data.id }),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      navigate('/orders');
    },
    onError: (error: Error) => {
      toast({
        title: t('orders.error'),
        description: t('orders.order_creation_failed', { error: error.message }),
        variant: "destructive",
      });
    },
  });

  // Handle customer selection
  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    form.setValue('customerId', customer.id);
    setCustomerSearch("");
    setProducts([]);
    form.setValue('products', []);
  };

  // Add product to order with validation
  const addProduct = () => {
    try {
      if (!selectedCustomer) {
        toast({
          title: t('orders.error'),
          description: t('orders.select_customer_first'),
          variant: "destructive",
        });
        return;
      }

      if (customerProducts.length === 0) {
        toast({
          title: t('orders.error'),
          description: t('orders.no_products_available'),
          variant: "destructive",
        });
        return;
      }

      const newProduct = { productId: 0, quantity: 1 };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      form.setValue('products', updatedProducts);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error(String(error)), { context: 'Failed to add product' });
    }
  };

  // Remove product from order
  const removeProduct = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    form.setValue('products', updatedProducts);
  };

  // Update product in order with validation
  const updateProduct = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    try {
      if (index < 0 || index >= products.length) return;
      
      const updatedProducts = [...products];
      if (field === 'productId') {
        const productId = safeParseInt(value);
        if (productId > 0) {
          updatedProducts[index] = { ...updatedProducts[index], productId };
        }
      } else if (field === 'quantity') {
        const quantity = safeParseInt(value, 1);
        if (quantity > 0) {
          updatedProducts[index] = { ...updatedProducts[index], quantity };
        }
      }
      setProducts(updatedProducts);
      form.setValue('products', updatedProducts);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error(String(error)), { context: 'Failed to update product' });
    }
  };

  // Get product details
  const getProductDetails = (productId: number): Product | null => {
    try {
      return customerProducts.find(p => p.id === productId) || null;
    } catch (error) {
      console.error('Error getting product details:', error);
      return null;
    }
  };

  // Get item name by itemId
  const getItemName = (itemId: string) => {
    try {
      const item = items.find(i => i.id === itemId);
      return item ? item.name : itemId;
    } catch (error) {
      console.error('Error getting item name:', error);
      return itemId || 'Unknown Item';
    }
  };

  // Get category name by categoryId
  const getCategoryName = (categoryId: string) => {
    try {
      const category = categories.find(c => c.id === categoryId);
      return category ? category.name : categoryId;
    } catch (error) {
      console.error('Error getting category name:', error);
      return categoryId || 'Unknown Category';
    }
  };

  // Get master batch name by masterBatchId
  const getMasterBatchName = (masterBatchId: string) => {
    try {
      const masterBatch = masterBatches.find(mb => mb.id === masterBatchId);
      return masterBatch ? masterBatch.name : masterBatchId;
    } catch (error) {
      console.error('Error getting master batch name:', error);
      return masterBatchId || 'Unknown Master Batch';
    }
  };

  // Submit form
  const onSubmit = (data: OrderFormValues) => {
    try {
      // Validate that products are selected
      if (!selectedCustomer) {
        toast({
          title: t('orders.error'),
          description: t('orders.select_customer_first'),
          variant: "destructive",
        });
        return;
      }

      if (products.length === 0) {
        toast({
          title: t('orders.error'),
          description: t('orders.add_first_product'),
          variant: "destructive",
        });
        return;
      }

      // Enhanced validation with type safety
      const invalidProducts = products.filter(p => 
        !p.productId || 
        !isValidNumber(p.productId) || 
        p.productId === 0 ||
        !isValidNumber(p.quantity) ||
        p.quantity <= 0
      );

      if (invalidProducts.length > 0) {
        toast({
          title: t('orders.error'),
          description: t('orders.select_valid_products'),
          variant: "destructive",
        });
        return;
      }

      // Enhanced form validation
      const orderValidation = FormValidator.validateOrderForm({
        customerId: selectedCustomer.id,
        products: products,
        notes: data.notes,
      });
      
      if (!orderValidation.isValid) {
        const errorMessages = Object.values(orderValidation.errors).join(', ');
        toast({
          title: t('orders.error'),
          description: errorMessages,
          variant: "destructive",
        });
        return;
      }

      // Create the order data with products (sanitized)
      const orderData = FormValidator.sanitizeFormData({
        ...data,
        customerId: selectedCustomer.id,
        products: products.map(p => ({
          productId: safeParseInt(p.productId),
          quantity: safeParseInt(p.quantity, 1)
        })),
      });

      createOrderMutation.mutate(orderData as OrderFormValues);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error(String(error)), { context: 'Failed to submit order' });
      toast({
        title: t('orders.error'),
        description: 'An unexpected error occurred while submitting the order',
        variant: "destructive",
      });
    }
  };

  return (
    <NewOrderErrorBoundary>
      <div className="page-container">
        <div className="page-header">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('common.back')}
            </Button>
            <div>
              <h1 className="page-title">{t('orders.new_order')}</h1>
              <p className="page-subtitle">{t('orders.create_order_description')}</p>
            </div>
          </div>
        </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('orders.customer_selection')}
            </CardTitle>
            <CardDescription>{t('orders.select_customer_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('orders.search_customers')}
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {customersLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedCustomer?.id === customer.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleCustomerSelect(customer)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{customer.name}</h4>
                          {customer.nameAr && (
                            <p className="text-sm text-muted-foreground">{customer.nameAr}</p>
                          )}
                        </div>
                        {customer.code && (
                          <Badge variant="secondary">
                            {t('orders.customer_code')}: {customer.code}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{t('orders.no_customers_found')}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('orders.order_summary')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">{t('orders.customer')}</Label>
              <div className="mt-1 p-2 bg-muted rounded-md">
                {selectedCustomer ? (
                  <div>
                    <p className="font-medium">{selectedCustomer.name}</p>
                    {selectedCustomer.nameAr && (
                      <p className="text-sm text-muted-foreground">{selectedCustomer.nameAr}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">{t('orders.not_selected')}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">{t('orders.products')}</Label>
              <div className="mt-1 p-2 bg-muted rounded-md">
                <p className="text-sm">
                  {products.length} {t('orders.items')}
                </p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• {t('orders.automatic_adjustments')}</p>
              <p>• {t('orders.category_based_pricing')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Products Section */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t('orders.products')}
            </CardTitle>
            <CardDescription>{t('orders.select_products_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedCustomer ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{t('orders.select_customer_first')}</AlertDescription>
              </Alert>
            ) : productsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </div>
            ) : customerProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">{t('orders.no_products')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('orders.no_products_description')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {t('orders.loading_products')}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addProduct}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {t('orders.add_product')}
                  </Button>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <h4 className="font-medium mb-2">{t('orders.add_first_product')}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('orders.add_first_product_description')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product, index) => (
                      <Card key={index} className="p-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="md:col-span-2">
                            <Label className="text-sm font-medium">{t('orders.select_product')}</Label>
                            <Select
                              value={product.productId ? product.productId.toString() : ""}
                              onValueChange={(value) => {
                                if (value && value !== "") {
                                  updateProduct(index, 'productId', parseInt(value));
                                }
                              }}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder={t('orders.select_product')} />
                              </SelectTrigger>
                              <SelectContent className="max-h-60 overflow-y-auto">
                                {customerProducts.map((p) => {
                                  const itemName = getItemName(p.itemId);
                                  const categoryName = getCategoryName(p.categoryId);
                                  const masterBatchName = p.masterBatchId ? getMasterBatchName(p.masterBatchId) : '';
                                  const rawMaterial = p.rawMaterial || '';
                                  const cuttingLength = p.cuttingLength || '';
                                  
                                  const displayText = safeSync(
                                    () => {
                                      const sizeCaption = safeStringAccess(p, 'sizeCaption', 'Product');
                                      const width = safeStringAccess(p, 'width', '');
                                      const lengthCm = safeStringAccess(p, 'lengthCm', '');
                                      return `${sizeCaption}${width ? ` (${width}x${lengthCm})` : ''}`;
                                    },
                                    "Unknown Product",
                                    { productId: p.id }
                                  );
                                  return (
                                    <SelectItem key={p.id} value={p.id.toString()}>
                                      <div className="flex flex-col gap-1 py-1">
                                        <div className="font-medium">{displayText}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {itemName}{rawMaterial && ` • ${rawMaterial}`}
                                        </div>
                                        <div className="text-xs text-muted-foreground flex flex-wrap gap-2">
                                          <span className="font-medium">{t('orders.category')}:</span>
                                          <span>{categoryName}</span>
                                          {masterBatchName && (
                                            <>
                                              <span>•</span>
                                              <span className="font-medium">{t('orders.master_batch')}:</span>
                                              <span>{masterBatchName}</span>
                                            </>
                                          )}
                                          {cuttingLength && (
                                            <>
                                              <span>•</span>
                                              <span className="font-medium">{t('orders.cutting_length')}:</span>
                                              <span>{cuttingLength}</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <Label className="text-sm font-medium">{t('orders.quantity')}</Label>
                              <Input
                                type="number"
                                min="1"
                                value={product.quantity}
                                onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                                className="mt-1"
                                placeholder={t('orders.enter_quantity')}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeProduct(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Product Details */}
                        {product.productId && (
                          <ProductDetailsDisplay 
                            productId={product.productId} 
                            getProductDetails={getProductDetails}
                            getItemName={getItemName}
                            getCategoryName={getCategoryName}
                            t={t}
                          />
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Form */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('orders.order_details')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('orders.notes')}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={t('orders.notes_placeholder')}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/orders')}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        {t('orders.creating')}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        {t('orders.create_order')}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
    </NewOrderErrorBoundary>
  );
}