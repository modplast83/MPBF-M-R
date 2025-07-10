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

// Order form validation schema
const orderFormSchema = z.object({
  customerId: z.string().min(1, "Please select a customer"),
  notes: z.string().optional(),
  products: z.array(z.object({
    productId: z.string().min(1, "Product is required"),
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
  id: string;
  productName: string;
  productCode?: string;
  size?: string;
  category?: string;
  thickness?: string;
  color?: string;
  length?: number;
  width?: number;
  cuttingUnit?: string;
  packageKg?: number;
}

export default function NewOrderPage() {
  const { t } = useTranslation();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<{ productId: string; quantity: number }[]>([]);

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

  // Fetch products for selected customer
  const { data: customerProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/customer-products', selectedCustomer?.id],
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

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderFormValues) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create order');
      return response.json();
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

  // Add product to order
  const addProduct = () => {
    const newProduct = { productId: "", quantity: 1 };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    form.setValue('products', updatedProducts);
  };

  // Remove product from order
  const removeProduct = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    form.setValue('products', updatedProducts);
  };

  // Update product in order
  const updateProduct = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    if (index < 0 || index >= products.length) return;
    
    const updatedProducts = [...products];
    if (field === 'productId') {
      updatedProducts[index] = { ...updatedProducts[index], productId: value as string };
    } else if (field === 'quantity') {
      updatedProducts[index] = { ...updatedProducts[index], quantity: value as number };
    }
    setProducts(updatedProducts);
    form.setValue('products', updatedProducts);
  };

  // Get product details
  const getProductDetails = (productId: string) => {
    try {
      return customerProducts.find(p => p.id === productId);
    } catch (error) {
      console.error('Error getting product details:', error);
      return null;
    }
  };

  // Submit form
  const onSubmit = (data: OrderFormValues) => {
    createOrderMutation.mutate(data);
  };

  return (
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
                              value={product.productId}
                              onValueChange={(value) => updateProduct(index, 'productId', value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder={t('orders.select_product')} />
                              </SelectTrigger>
                              <SelectContent>
                                {customerProducts.map((p) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    {p.productName} {p.size ? `(${p.size})` : ''}
                                  </SelectItem>
                                ))}
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
                          <div className="mt-4 p-3 bg-muted rounded-md">
                            {(() => {
                              const details = getProductDetails(product.productId);
                              return details ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                  {details.productCode && (
                                    <div>
                                      <span className="font-medium">{t('common.code')}: </span>
                                      {details.productCode}
                                    </div>
                                  )}
                                  {details.category && (
                                    <div>
                                      <span className="font-medium">{t('common.category')}: </span>
                                      {details.category}
                                    </div>
                                  )}
                                  {details.thickness && (
                                    <div>
                                      <span className="font-medium">{t('setup.products.thickness')}: </span>
                                      {details.thickness}
                                    </div>
                                  )}
                                  {details.color && (
                                    <div>
                                      <span className="font-medium">{t('setup.products.color')}: </span>
                                      {details.color}
                                    </div>
                                  )}
                                </div>
                              ) : null;
                            })()}
                          </div>
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
  );
}