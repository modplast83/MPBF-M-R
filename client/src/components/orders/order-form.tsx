import React, { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Fuse from "fuse.js";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronsUpDown, Plus, Trash2, Package, User, FileText, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  insertOrderSchema,
  Customer,
  CustomerProduct,
  Item,
  Category,
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
// @ts-ignore
import { useTranslation } from "react-i18next";

// Extended schema for the form
const orderFormSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  note: z.string().optional(),
  jobOrders: z.array(
    z.object({
      customerProductId: z.number().positive("Product is required"),
      quantity: z.number().min(0.01, "Quantity must be greater than 0"),
    }),
  ).min(1, "At least one product is required"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export function OrderForm() {
  const { t } = useTranslation();
  const [_, navigate] = useLocation();
  const queryClient = useQueryClient();

  // Fetch customers
  const { data: customers = [], isLoading: customersLoading } = useQuery<
    Customer[]
  >({
    queryKey: [API_ENDPOINTS.CUSTOMERS],
  });

  // State to track selected customer
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Setup fuzzy search with Fuse.js
  const fuseRef = useRef<Fuse<Customer> | null>(null);

  // When customers data is loaded, initialize Fuse
  useEffect(() => {
    console.log("Customers data:", customers);
    try {
      if (customers && customers.length > 0) {
        // Enhanced Fuse.js configuration for bilingual search
        fuseRef.current = new Fuse(customers, {
          keys: ["name", "nameAr", "code"],
          threshold: 0.4, // Balanced matching
          includeScore: true,
          ignoreLocation: true,
          useExtendedSearch: true,
        });
      }
    } catch (error) {
      console.error("Error initializing Fuse:", error);
      fuseRef.current = null;
    }
  }, [customers]);

  // Advanced search function to handle both Arabic and English inputs
  const getFilteredCustomers = (): Customer[] => {
    try {
      if (!customers || !customers.length) {
        console.log("No customers available");
        return [];
      }

      // If no search query, return all customers (limit to prevent performance issues)
      const trimmedQuery = searchQuery.trim();
      if (!trimmedQuery) {
        return customers.slice(0, 50); // Limit to first 50 customers for performance
      }

      console.log("Search query:", trimmedQuery);

      // Enhanced bilingual search for both Arabic and English
      if (trimmedQuery.length === 1) {
        // For single character searches, match start of words in both languages
        const char = trimmedQuery.toLowerCase();
        const filteredCustomers = customers.filter((customer) => {
          if (!customer) return false;

          // Match start of English name words
          const nameStartsWithMatch =
            customer.name &&
            (customer.name.toLowerCase().startsWith(char) ||
              customer.name
                .toLowerCase()
                .split(" ")
                .some((word) => word.startsWith(char)));

          // Match start of Arabic name words
          const nameArStartsWithMatch =
            customer.nameAr &&
            (customer.nameAr.startsWith(trimmedQuery) ||
              customer.nameAr
                .split(" ")
                .some((word) => word.startsWith(trimmedQuery)));

          // Match code
          const codeMatch =
            customer.code && customer.code.toLowerCase().startsWith(char);

          return nameStartsWithMatch || nameArStartsWithMatch || codeMatch;
        });

        return filteredCustomers;
      }

      // For normal searches, normalize query and split into terms
      const searchTerms = trimmedQuery.split(/\s+/);

      // Enhanced multi-term search approach
      const filteredCustomers = customers.filter((customer) => {
        if (!customer) return false;

        // Check each search term separately to improve matching
        for (const term of searchTerms) {
          const termLower = term.toLowerCase();

          // Skip very short terms unless they are numbers
          if (termLower.length < 2 && !/^\d+$/.test(termLower)) {
            continue;
          }

          // Check if name contains term (case insensitive)
          const nameMatch =
            customer.name && customer.name.toLowerCase().includes(termLower);

          // For Arabic names, try different matching approaches
          // 1. Direct match
          const directArMatch =
            customer.nameAr && customer.nameAr.includes(term);

          // 2. Match without whitespace (for connected Arabic words)
          const noSpaceArMatch =
            customer.nameAr &&
            term.length > 1 &&
            customer.nameAr.replace(/\s+/g, "").includes(term);

          // 3. Check if customer code contains the term
          const codeMatch =
            customer.code && customer.code.toLowerCase().includes(termLower);

          // If any term matches, include this customer
          if (nameMatch || directArMatch || noSpaceArMatch || codeMatch) {
            return true;
          }
        }

        return false;
      });

      // Log results
      console.log("Filtered customers:", filteredCustomers.length);

      // If there are too many results, limit them for better performance
      const MAX_RESULTS = 100;
      if (filteredCustomers.length > MAX_RESULTS) {
        console.log(`Showing only the first ${MAX_RESULTS} results`);
        return filteredCustomers.slice(0, MAX_RESULTS);
      }

      return filteredCustomers;
    } catch (error) {
      console.error("Error in customer filtering:", error);
      return customers || [];
    }
  };

  // Fetch customer products when a customer is selected
  const { data: customerProducts = [], isLoading: productsLoading } = useQuery<
    CustomerProduct[]
  >({
    queryKey: [`${API_ENDPOINTS.CUSTOMERS}/${selectedCustomerId}/products`],
    enabled: !!selectedCustomerId,
  });

  // Fetch all items to have their names available
  const { data: items = [] } = useQuery<Item[]>({
    queryKey: [API_ENDPOINTS.ITEMS],
    enabled: !!selectedCustomerId,
  });

  // Fetch all categories to display category names
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: [API_ENDPOINTS.CATEGORIES],
    enabled: !!selectedCustomerId,
  });

  // Define form with default values
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerId: "",
      note: "",
      jobOrders: [],
    },
  });

  // Setup field array for job orders
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "jobOrders",
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderFormValues) => {
      // First create the order
      const orderResponse = await apiRequest("POST", API_ENDPOINTS.ORDERS, {
        customerId: data.customerId,
        note: data.note,
      });

      // Then create job orders with adjusted quantities based on category
      for (const jobOrder of data.jobOrders) {
        // Find the customer product to get its category
        const customerProduct = customerProducts?.find(
          (cp) => cp.id === jobOrder.customerProductId,
        );

        if (customerProduct) {
          // Get the category
          const category = categories?.find(
            (cat) => cat.id === customerProduct.categoryId,
          );

          // Calculate adjusted quantity based on category
          let adjustedQuantity = jobOrder.quantity;

          if (category) {
            if (category.name === "T-Shirt Bag") {
              // Add 20% to quantity for T-Shirt Bags
              adjustedQuantity = jobOrder.quantity * 1.2;
            } else if (category.name === "Calendar Bag") {
              // Add 10% to quantity for Calendar Bags
              adjustedQuantity = jobOrder.quantity * 1.1;
            } else {
              // Add 5% to quantity for all other categories
              adjustedQuantity = jobOrder.quantity * 1.05;
            }
          }

          // Create job order with adjusted quantity
          await apiRequest("POST", API_ENDPOINTS.JOB_ORDERS, {
            orderId: orderResponse.id,
            customerProductId: jobOrder.customerProductId,
            quantity: adjustedQuantity,
          });
        } else {
          // Fallback if customer product is not found
          await apiRequest("POST", API_ENDPOINTS.JOB_ORDERS, {
            orderId: orderResponse.id,
            ...jobOrder,
          });
        }
      }

      return orderResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ORDERS] });
      toast({
        title: t("orders.order_created"),
        description: t("orders.order_created_success", { id: data.id }),
      });
      navigate("/orders");
    },
    onError: (error) => {
      toast({
        title: t("orders.error"),
        description: t("orders.order_creation_failed", { error }),
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: OrderFormValues) => {
    createOrderMutation.mutate(data);
  };

  // Update customer ID when selected
  const handleCustomerChange = (value: string) => {
    setSelectedCustomerId(value);
    form.setValue("customerId", value);
    
    // Reset job orders when customer changes
    form.setValue("jobOrders", []);
  };

  // Get filtered customers with memoization to prevent infinite loops
  const filteredCustomers = React.useMemo(() => {
    try {
      if (!customers || customers.length === 0) return [];
      return getFilteredCustomers();
    } catch (error) {
      console.error("Error getting filtered customers:", error);
      return [];
    }
  }, [customers, searchQuery]);

  return (
    <div className="page-container form-container-overflow">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="page-title">{t("orders.new_order")}</h1>
            <p className="page-subtitle">Create a new order with products and specifications</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-visible relative">
          <div className="grid gap-6 lg:grid-cols-3 overflow-visible relative">
            {/* Customer Selection Card */}
            <Card className="mobile-card lg:col-span-2 overflow-visible">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {t("orders.customer")}
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-visible">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative z-[50]">
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between h-12 bg-background hover:bg-accent/50 border-2"
                          onClick={() => setOpen(!open)}
                        >
                          {field.value ? (
                            <div className="flex flex-col items-start">
                              <span className="font-medium">
                                {customers.find((customer) => customer.id === field.value)?.name}
                              </span>
                              {customers.find((customer) => customer.id === field.value)?.code && (
                                <Badge variant={"secondary" as any} className="text-xs mt-1">
                                  #{customers.find((customer) => customer.id === field.value)?.code}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              {t("orders.select_customer")}
                            </span>
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>

                        {open && (
                          <div className="customer-dropdown absolute top-full left-0 right-0 w-full mt-2 overflow-hidden">
                            <div className="p-3 border-b bg-muted/30">
                              <Input
                                type="text"
                                className="border-2"
                                placeholder={t("orders.search_customer_placeholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                              />
                            </div>

                            <div className="max-h-[300px] overflow-y-auto">
                              {!filteredCustomers || filteredCustomers.length === 0 ? (
                                <div className="py-8 text-center">
                                  <User className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                                  <p className="font-medium">{t("orders.no_matching_customer")}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {t("orders.try_different_search")}
                                  </p>
                                </div>
                              ) : (
                                <div className="p-2">
                                  {filteredCustomers.map((customer) => {
                                    if (!customer || !customer.id) return null;
                                    return (
                                      <div
                                        key={customer.id}
                                        className={`p-3 cursor-pointer hover:bg-accent/70 rounded-lg transition-colors border-2 border-transparent mb-2 ${
                                          field.value === customer.id ? "bg-accent border-primary/20" : ""
                                        }`}
                                        onClick={() => {
                                          handleCustomerChange(customer.id);
                                          setOpen(false);
                                          setSearchQuery("");
                                        }}
                                      >
                                        <div className="flex items-center">
                                          <Check
                                            className={cn(
                                              "mr-3 h-4 w-4 text-primary",
                                              field.value === customer.id ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                          <div className="flex flex-col w-full">
                                            <div className="flex items-center justify-between">
                                              <span className="font-medium" dir="auto">
                                                {customer.name}
                                              </span>
                                              {customer.code && (
                                                <Badge variant={"outline" as any} className="text-xs">
                                                  #{customer.code}
                                                </Badge>
                                              )}
                                            </div>
                                            {customer.nameAr && (
                                              <div className="mt-2 pt-2 border-t border-dashed border-muted">
                                                <span className="text-sm text-muted-foreground block text-right" dir="rtl">
                                                  {customer.nameAr}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Customer Info Display */}
                {selectedCustomerId && (
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg border">
                    <div className="text-xs text-muted-foreground mb-1">Selected Customer</div>
                    <div className="font-medium">
                      {customers.find(c => c.id === selectedCustomerId)?.name}
                    </div>
                    {customers.find(c => c.id === selectedCustomerId)?.nameAr && (
                      <div className="text-sm text-muted-foreground mt-1" dir="rtl">
                        {customers.find(c => c.id === selectedCustomerId)?.nameAr}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Details Card */}
            <Card className="mobile-card lg:col-span-1">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {t("orders.order_details")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">{t("orders.order_note")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("orders.order_note_placeholder")}
                          className="min-h-[100px] border-2"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <Card className="mobile-card relative z-10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  {t("orders.products")}
                  {fields.length > 0 && (
                    <Badge variant={"secondary" as any} className="ml-2">
                      {fields.length} {fields.length === 1 ? 'Product' : 'Products'}
                    </Badge>
                  )}
                </CardTitle>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => {
                    const firstProductId = customerProducts?.[0]?.id;
                    if (firstProductId) {
                      append({ customerProductId: firstProductId, quantity: 1 });
                    }
                  }}
                  disabled={!selectedCustomerId || !customerProducts?.length}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("orders.add_product")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="relative">

              {selectedCustomerId ? (
                fields.length > 0 ? (
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="border-2 border-muted hover:border-accent transition-colors relative z-20">
                        <CardContent className="p-4 relative">
                          <div className="grid gap-4 md:grid-cols-12 items-end">
                            <div className="md:col-span-7 relative z-[100]">
                              <FormField
                                control={form.control}
                                name={`jobOrders.${index}.customerProductId`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                      {t("orders.product")}
                                    </FormLabel>
                                    <Select
                                      onValueChange={(value) => {
                                        if (value !== "no-products") {
                                          field.onChange(parseInt(value));
                                        }
                                      }}
                                      value={field.value ? field.value.toString() : ""}
                                      disabled={productsLoading}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="h-12 border-2">
                                          <SelectValue placeholder={t("orders.select_product")} />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="dropdown-portal">
                                        {customerProducts?.map((product) => {
                                          const item = items?.find(i => i.id === product.itemId);
                                          const category = categories?.find(c => c.id === product.categoryId);
                                          
                                          const display = `${category?.name || "Unknown"} - ${item?.name || "Unknown"}${product.sizeCaption ? ` (${product.sizeCaption})` : ""}`;
                                          
                                          return (
                                            <SelectItem key={product.id} value={product.id.toString()}>
                                              <div className="flex flex-col">
                                                <span className="font-medium">{display}</span>
                                                {product.thickness && (
                                                  <span className="text-xs text-muted-foreground">
                                                    Thickness: {product.thickness}μm
                                                  </span>
                                                )}
                                              </div>
                                            </SelectItem>
                                          );
                                        })}
                                        {(!customerProducts || customerProducts.length === 0) && (
                                          <SelectItem value="no-products" disabled>
                                            {productsLoading ? "Loading..." : "No products"}
                                          </SelectItem>
                                        )}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="md:col-span-4">
                              <FormField
                                control={form.control}
                                name={`jobOrders.${index}.quantity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                      {t("orders.quantity")} (كجم)
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="h-12 border-2 text-center font-medium"
                                        value={field.value || ""}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (value === "" || value === null) {
                                            field.onChange(1);
                                          } else {
                                            const parsed = parseFloat(value);
                                            field.onChange(isNaN(parsed) ? 1 : Math.max(0.01, parsed));
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="md:col-span-1 flex justify-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="h-12 w-12 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg bg-muted/20">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium text-muted-foreground">
                      {t("orders.add_products_to_order")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click the "Add Product" button to start building your order
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg bg-muted/20">
                  <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium text-muted-foreground">
                    {t("orders.select_customer_first")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please select a customer to view available products
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate("/orders")}
              className="min-w-[120px]"
            >
              {t("orders.cancel")}
            </Button>
            <Button 
              type="submit" 
              disabled={createOrderMutation.isPending}
              size="lg"
              className="min-w-[160px] bg-primary hover:bg-primary/90"
            >
              {createOrderMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("orders.creating")}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  {t("orders.create_order")}
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
