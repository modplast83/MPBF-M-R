import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CustomerForm } from "@/components/setup/customer-form";
import { API_ENDPOINTS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Customer, User } from "@shared/schema";
import { useTranslation } from "react-i18next";

export default function Customers() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  // Fetch customers and related data
  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: [API_ENDPOINTS.CUSTOMERS],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: [API_ENDPOINTS.USERS],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `${API_ENDPOINTS.CUSTOMERS}/${id}`, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.CUSTOMERS] });
      toast({
        title: t("setup.customers.customer_deleted"),
        description: t("setup.customers.customer_deleted_success"),
      });
      setDeletingCustomer(null);
    },
    onError: (error) => {
      toast({
        title: t("common.error"),
        description: t("setup.customers.delete_failed", { error }),
        variant: "destructive",
      });
    },
  });

  const handleEdit = (customer: Customer) => {
    setEditCustomer(customer);
    setFormOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setDeletingCustomer(customer);
  };

  const confirmDelete = () => {
    if (deletingCustomer) {
      deleteMutation.mutate(deletingCustomer.id);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditCustomer(null);
  };

  // Helper function to get user name from userId - using firstName instead of username
  const getUserName = (userId: string | null) => {
    if (!userId) return t("common.none");
    const user = users?.find(u => u.id === userId);
    if (user) {
      return user.firstName || user.username || userId;
    }
    return userId || t("common.unknown");
  };

  const columns = [
    {
      header: t("setup.customers.id"),
      accessorKey: "id",
    },
    {
      header: t("setup.customers.code"),
      accessorKey: "code",
    },
    {
      header: t("setup.customers.name"),
      accessorKey: "name",
    },
    {
      header: t("setup.customers.name_ar"),
      accessorKey: "nameAr",
      cell: (row: { nameAr: string | null }) => row.nameAr || "-",
    },
    {
      header: t("setup.customers.sales_person"),
      accessorKey: "userId",
      cell: (row: { userId: string | null }) => getUserName(row.userId),
    },
    {
      header: t("setup.customers.plate_drawer_code"),
      accessorKey: "plateDrawerCode",
      cell: (row: { plateDrawerCode: string | null }) => row.plateDrawerCode || "-",
    },
    {
      header: t("setup.customers.actions"),
      cell: (row: Customer) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row)} className="text-primary-500 hover:text-primary-700">
            <span className="material-icons text-sm">edit</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row)} className="text-red-500 hover:text-red-700">
            <span className="material-icons text-sm">delete</span>
          </Button>
        </div>
      ),
    },
  ];

  const tableActions = (
    <Button onClick={() => setFormOpen(true)}>
      <span className="material-icons text-sm mr-1">add</span>
      {t("setup.customers.add_customer")}
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">{t("setup.customers.title")}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{t("setup.customers.description")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            data={customers || []}
            columns={columns}
            isLoading={isLoading}
            actions={tableActions}
          />
        </CardContent>
      </Card>
      {/* Add/Edit Customer Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editCustomer ? t("setup.customers.edit_customer") : t("setup.customers.add_new")}
            </DialogTitle>
          </DialogHeader>
          <CustomerForm 
            customer={editCustomer || undefined}
            onSuccess={handleFormClose}
          />
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCustomer} onOpenChange={(open) => !open && setDeletingCustomer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("setup.customers.are_you_sure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("setup.customers.delete_confirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("setup.customers.cancel")}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {t("setup.customers.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
