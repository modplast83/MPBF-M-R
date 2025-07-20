import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { MachinePartForm } from "@/components/setup/machine-part-form";
import { API_ENDPOINTS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { MachinePart, Section } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Plus, Edit, Trash2, Settings, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function MachineParts() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editMachinePart, setEditMachinePart] = useState<MachinePart | null>(null);
  const [deletingMachinePart, setDeletingMachinePart] = useState<MachinePart | null>(null);

  // Fetch machine parts and sections
  const { data: machinePartsData, isLoading } = useQuery<MachinePart[]>({
    queryKey: [API_ENDPOINTS.MACHINE_PARTS],
  });

  const { data: sections } = useQuery<Section[]>({
    queryKey: [API_ENDPOINTS.SECTIONS],
  });

  // Create machine part mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest(API_ENDPOINTS.MACHINE_PARTS, {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MACHINE_PARTS] });
      setFormOpen(false);
      toast({
        title: t("setup.machine_parts.form.create_success"),
        description: t("setup.machine_parts.form.create_success"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("setup.machine_parts.form.create_error"),
        description: error?.message || t("setup.machine_parts.form.create_error"),
        variant: "destructive",
      });
    },
  });

  // Update machine part mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest(`${API_ENDPOINTS.MACHINE_PARTS}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MACHINE_PARTS] });
      setFormOpen(false);
      setEditMachinePart(null);
      toast({
        title: t("setup.machine_parts.form.update_success"),
        description: t("setup.machine_parts.form.update_success"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("setup.machine_parts.form.update_error"),
        description: error?.message || t("setup.machine_parts.form.update_error"),
        variant: "destructive",
      });
    },
  });

  // Delete machine part mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`${API_ENDPOINTS.MACHINE_PARTS}/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MACHINE_PARTS] });
      setDeletingMachinePart(null);
      toast({
        title: t("setup.machine_parts.form.delete_success"),
        description: t("setup.machine_parts.form.delete_success"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("setup.machine_parts.form.delete_error"),
        description: error?.message || t("setup.machine_parts.form.delete_error"),
        variant: "destructive",
      });
    },
  });

  const getSectionName = (sectionId: string | null) => {
    if (!sectionId || !sections) return t("common.not_available");
    const section = sections.find((s) => s.id === sectionId);
    return section?.name || t("common.not_available");
  };

  const getPartTypeBadge = (partType: string) => {
    const variant = partType === "Mechanic" ? "default" : "secondary";
    return (
      <Badge variant={variant}>
        {partType === "Mechanic" 
          ? t("setup.machine_parts.part_type_mechanic")
          : t("setup.machine_parts.part_type_electronic")
        }
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("common.not_available");
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return t("common.not_available");
    }
  };

  const columns = [
    {
      key: "machineName",
      label: t("setup.machine_parts.machine_name"),
      sortable: true,
    },
    {
      key: "name",
      label: t("setup.machine_parts.part_name"),
      sortable: true,
    },
    {
      key: "code",
      label: t("setup.machine_parts.part_code"),
      sortable: true,
    },
    {
      key: "partType",
      label: t("setup.machine_parts.part_type"),
      render: (row: MachinePart) => getPartTypeBadge(row.partType),
    },
    {
      key: "section",
      label: t("common.section"),
      render: (row: MachinePart) => getSectionName(row.sectionId),
    },
    {
      key: "serialNumber",
      label: t("setup.machine_parts.serial_number"),
      render: (row: MachinePart) => row.serialNumber || t("common.not_available"),
    },
    {
      key: "size",
      label: t("setup.machine_parts.size"),
      render: (row: MachinePart) => {
        if (!row.size && !row.sizeValue) return t("common.not_available");
        if (row.sizeValue && row.sizeUnit) {
          return `${row.sizeValue} ${row.sizeUnit}${row.size ? ` (${row.size})` : ""}`;
        }
        return row.size || t("common.not_available");
      },
    },
    {
      key: "lastMaintenanceDate",
      label: t("setup.machine_parts.last_maintenance_date"),
      render: (row: MachinePart) => formatDate(row.lastMaintenanceDate),
    },
    {
      key: "actions",
      label: t("common.actions"),
      render: (row: MachinePart) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditMachinePart(row);
              setFormOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeletingMachinePart(row)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleSubmit = (data: any) => {
    if (editMachinePart) {
      updateMutation.mutate({ id: editMachinePart.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCancel = () => {
    setFormOpen(false);
    setEditMachinePart(null);
  };

  const handleDelete = () => {
    if (deletingMachinePart) {
      deleteMutation.mutate(deletingMachinePart.id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t("setup.machine_parts.table_header")}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                {t("setup.machine_parts.description")}
              </p>
            </div>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("setup.machine_parts.add_new")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={machinePartsData || []}
            columns={columns}
            loading={isLoading}
            searchPlaceholder={t("common.search_placeholder")}
            emptyMessage={t("common.not_found")}
          />
        </CardContent>
      </Card>

      {/* Machine Part Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editMachinePart
                ? t("setup.machine_parts.edit_machine_part")
                : t("setup.machine_parts.add_machine_part")}
            </DialogTitle>
          </DialogHeader>
          <MachinePartForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={editMachinePart}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingMachinePart}
        onOpenChange={() => setDeletingMachinePart(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.are_you_sure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("common.delete_confirmation_message", {
                item: deletingMachinePart?.name || t("setup.machine_parts.part_name"),
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? t("common.deleting") : t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}