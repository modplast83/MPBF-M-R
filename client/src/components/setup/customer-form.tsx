import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
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
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "@/lib/constants";
import { insertCustomerSchema, Customer, User } from "@shared/schema";
import { useTranslation } from "react-i18next";

interface CustomerFormProps {
  customer?: Customer;
  onSuccess?: () => void;
}

export function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isEditing = !!customer;

  // Fetch users (for sales person) - filter to only show users from SEC003 section
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: [API_ENDPOINTS.USERS],
    select: (data) => data?.filter(user => user.sectionId === "SEC003") || [],
  });

  // Set up the form
  const form = useForm<z.infer<typeof insertCustomerSchema>>({
    resolver: zodResolver(insertCustomerSchema),
    defaultValues: {
      id: customer?.id || "",
      code: customer?.code || "",
      name: customer?.name || "",
      nameAr: customer?.nameAr || "",
      userId: customer?.userId || null,
      plateDrawerCode: customer?.plateDrawerCode || "",
    },
  });

  // Create mutation for adding/updating customer
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof insertCustomerSchema>) => {
      try {
        console.log("Starting customer mutation with values:", values);
        if (isEditing) {
          return await apiRequest(
            "PUT",
            `${API_ENDPOINTS.CUSTOMERS}/${customer!.id}`,
            values,
          );
        } else {
          return await apiRequest("POST", API_ENDPOINTS.CUSTOMERS, values);
        }
      } catch (error) {
        console.error("Error in customer mutation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.CUSTOMERS] });
      toast({
        title: `Customer ${isEditing ? "Updated" : "Created"}`,
        description: `The customer has been ${isEditing ? "updated" : "created"} successfully.`,
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} customer: ${errorMessage}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof insertCustomerSchema>) => {
    // Make a fresh copy to avoid mutations
    const updatedValues = { ...values };

    // Server will handle ID generation with proper CID#### format
    // We don't need to generate IDs client-side anymore

    // Handle user ID field correctly
    if (updatedValues.userId === "null") {
      // Set to null if "null" string was selected
      updatedValues.userId = null;
    } else if (updatedValues.userId) {
      // Ensure proper format if user ID was provided
      // Some users have "00U" prefix, others have "0U" - ensure consistency
      if (!updatedValues.userId.match(/^(0U|00U)/)) {
        updatedValues.userId = `0U${updatedValues.userId.replace(/^0+U/, "")}`;
      }
      console.log("Formatted userId:", updatedValues.userId);
    }

    // Ensure all empty strings are converted to empty strings (not null or undefined)
    // This is important because the schema expects strings for string fields
    if (updatedValues.nameAr === "") updatedValues.nameAr = "";
    if (updatedValues.plateDrawerCode === "")
      updatedValues.plateDrawerCode = "";

    console.log("Submitting customer form with final values:", updatedValues);
    mutation.mutate(updatedValues);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {isEditing ? t("setup.customers.edit_customer") : t("setup.customers.add_customer")}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {isEditing ? t("setup.customers.customer_details_description") : t("setup.customers.description")}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Hidden fields for ID and Code - they will be auto-generated */}
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <input type="hidden" {...field} />
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <input type="hidden" {...field} />
            )}
          />

          {/* Customer Names Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              <h4 className="text-md font-medium text-gray-900">{t("setup.customers.customer_name")}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">{t("setup.customers.customer_name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("setup.customers.customer_name_placeholder")}
                        {...field}
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("setup.customers.arabic_name_optional")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("setup.customers.arabic_name_placeholder")}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || "")}
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Sales and Operations Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h4 className="text-md font-medium text-gray-900">{t("setup.customers.sales_person")}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">{t("setup.customers.sales_person")}</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "null" ? null : value)
                      }
                      value={field.value || "null"}
                      disabled={usersLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <SelectValue
                            placeholder={t("setup.customers.sales_person_placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">
                          {t("setup.customers.none")}
                        </SelectItem>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName || user.username || user.id}
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
                name="plateDrawerCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">{t("setup.customers.plate_drawer_code")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("setup.customers.enter_plate_drawer_code")}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || "")}
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            {onSuccess && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onSuccess}
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {t("setup.customers.cancel")}
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {mutation.isPending
                ? isEditing
                  ? t("common.updating")
                  : t("common.creating")
                : isEditing
                  ? t("common.update")
                  : t("setup.customers.create_customer")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
