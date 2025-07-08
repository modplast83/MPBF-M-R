import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { Roll, JobOrder, CustomerProduct } from "@shared/schema";
import { UpdateRollDialog } from "./update-roll-dialog";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth-v2";

interface RollCardProps {
  roll: Roll;
}

export function RollCard({ roll }: RollCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Fetch related data
  const { data: jobOrder } = useQuery<JobOrder>({
    queryKey: [`${API_ENDPOINTS.JOB_ORDERS}/${roll.jobOrderId}`],
  });

  const { data: customerProduct } = useQuery<CustomerProduct>({
    queryKey: [
      `${API_ENDPOINTS.CUSTOMER_PRODUCTS}/${jobOrder?.customerProductId}`,
    ],
    enabled: !!jobOrder?.customerProductId,
  });

  // Fetch order and customer data
  const { data: order } = useQuery<any>({
    queryKey: [jobOrder ? `${API_ENDPOINTS.ORDERS}/${jobOrder.orderId}` : null],
    enabled: !!jobOrder?.orderId,
  });

  const { data: customer } = useQuery<any>({
    queryKey: [order ? `${API_ENDPOINTS.CUSTOMERS}/${order.customerId}` : null],
    enabled: !!order?.customerId,
  });

  // Fetch item data for the product
  const { data: item } = useQuery<any>({
    queryKey: [
      customerProduct
        ? `${API_ENDPOINTS.ITEMS}/${customerProduct.itemId}`
        : null,
    ],
    enabled: !!customerProduct?.itemId,
  });

  // Fetch creator, printer, and cutter user data
  const { data: creator } = useQuery<any>({
    queryKey: [
      roll.createdById ? `${API_ENDPOINTS.USERS}/${roll.createdById}` : null,
    ],
    enabled: !!roll.createdById,
  });

  const { data: printer } = useQuery<any>({
    queryKey: [
      roll.printedById ? `${API_ENDPOINTS.USERS}/${roll.printedById}` : null,
    ],
    enabled: !!roll.printedById,
  });

  const { data: cutter } = useQuery<any>({
    queryKey: [roll.cutById ? `${API_ENDPOINTS.USERS}/${roll.cutById}` : null],
    enabled: !!roll.cutById,
  });

  // Mutations for updating roll status
  const updateRollMutation = useMutation({
    mutationFn: async (updateData: Partial<Roll>) => {
      await apiRequest("PUT", `${API_ENDPOINTS.ROLLS}/${roll.id}`, updateData);
    },
    onSuccess: () => {
      // Invalidate all necessary queries to keep data consistent
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ROLLS] });
      queryClient.invalidateQueries({
        queryKey: [`${API_ENDPOINTS.ROLLS}/${roll.id}`],
      });

      // Invalidate all stage queries to ensure progress is calculated properly
      queryClient.invalidateQueries({
        queryKey: [`${API_ENDPOINTS.ROLLS}/stage/extrusion`],
      });
      queryClient.invalidateQueries({
        queryKey: [`${API_ENDPOINTS.ROLLS}/stage/printing`],
      });
      queryClient.invalidateQueries({
        queryKey: [`${API_ENDPOINTS.ROLLS}/stage/cutting`],
      });

      // Also invalidate job order rolls to update calculations
      queryClient.invalidateQueries({
        queryKey: [`${API_ENDPOINTS.JOB_ORDERS}/${roll.jobOrderId}/rolls`],
      });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.JOB_ORDERS] });
    },
  });

  // Function to check if the current user has permission to complete this stage
  const canCompleteStage = () => {
    // If there's no authenticated user or no roll data, deny permission
    if (!user || !roll) return false;

    // Admin and Supervisor roles always have permission
    if (user.role === "administrator" || user.role === "supervisor")
      return true;

    // For specific stages, check if the current user matches the stage's owner
    if (roll.currentStage === "extrusion") {
      // Only the user who created the roll can complete extrusion
      return roll.createdById === user.id;
    } else if (roll.currentStage === "printing") {
      // Only the user who started printing can complete printing
      return roll.printedById === user.id;
    } else if (roll.currentStage === "cutting") {
      // Only the user who started cutting can complete cutting
      return roll.cutById === user.id;
    }

    // Default case
    return false;
  };

  // Function to check if current user can start this stage
  const canStartStage = () => {
    // If there's no authenticated user or no roll data, deny permission
    if (!user || !roll) return false;

    // Admin and Supervisor roles always have permission
    if (user.role === "administrator" || user.role === "supervisor")
      return true;

    // For specific stages, check permissions
    if (roll.currentStage === "extrusion") {
      // Only the user who created the roll can start extrusion
      return roll.createdById === user.id;
    } else if (roll.currentStage === "printing") {
      // In this case, we allow the user to claim the printing stage when they start it
      return true;
    } else if (roll.currentStage === "cutting") {
      // In this case, we allow the user to claim the cutting stage when they start it
      return true;
    }

    // Default case
    return false;
  };

  const handleComplete = async () => {
    // Define next stage based on current stage
    let nextStage = roll.currentStage;
    let nextStatus = "completed";

    // Get the current user ID from auth context
    const currentUserId = user?.id;

    // If there's no user ID, show an error and return
    if (!currentUserId) {
      toast({
        title: t("common.error"),
        description: t("production.roll_management.auth_required"),
        variant: "destructive",
      });
      return;
    }

    // Check if the user has permission to complete this stage
    if (!canCompleteStage()) {
      toast({
        title: t("common.unauthorized"),
        description: t("production.roll_management.cannot_complete_stage"),
        variant: "destructive",
      });
      return;
    }

    // If we're in the cutting stage, just open the dialog to input cutting quantity
    if (roll.currentStage === "cutting") {
      setIsDialogOpen(true);
      return;
    }

    if (roll.currentStage === "extrusion") {
      nextStage = "printing";
      nextStatus = "pending";

      // Ensure we have a valid printing quantity when moving to printing stage
      const printingQty = roll.extrudingQty || 0;

      updateRollMutation.mutate({
        status: nextStatus,
        currentStage: nextStage,
        printingQty: printingQty,
        // Do not set printedById here - it should be set when printing actually starts
      });
    } else if (roll.currentStage === "printing") {
      nextStage = "cutting";
      nextStatus = "pending";

      // Ensure we have a valid cutting quantity when moving to cutting stage
      const cuttingQty = roll.printingQty || roll.extrudingQty || 0;

      updateRollMutation.mutate({
        status: nextStatus,
        currentStage: nextStage,
        cuttingQty: cuttingQty,
        // Do not set cutById here - it should be set when cutting actually starts
      });
    } else {
      // Default case - just update status
      updateRollMutation.mutate({
        status: nextStatus,
        currentStage: nextStage,
      });
      return; // Skip the toast
    }

    // Get translated stage names
    const currentStageName = t(`rolls.${roll.currentStage}`);
    const nextStageName = t(`rolls.${nextStage}`);

    // Add toast notification for better feedback
    toast({
      title: t("production.roll_management.stage_completed", {
        stage: currentStageName,
      }),
      description: t("production.roll_management.roll_moved", {
        rollNumber: roll.serialNumber,
        nextStage: nextStageName,
      }),
    });
  };

  const handleStart = () => {
    // Check if the user has permission to start this stage
    if (!canStartStage()) {
      toast({
        title: t("common.unauthorized"),
        description: t("production.roll_management.cannot_start_stage"),
        variant: "destructive",
      });
      return;
    }

    // Get the current user ID from auth context
    const currentUserId = user?.id;

    // If there's no user ID, show an error and return
    if (!currentUserId) {
      toast({
        title: t("common.error"),
        description: t("production.roll_management.auth_required"),
        variant: "destructive",
      });
      return;
    }

    const updateData: Partial<Roll> = { status: "processing" };

    // If this is the printing stage, always set the current user as the printer
    if (roll.currentStage === "printing") {
      updateData.printedById = currentUserId;
      // Make sure the printing quantity is set if it's null
      if (roll.printingQty === null) {
        updateData.printingQty = roll.extrudingQty;
      }
      // We don't need to set printedAt as the server will handle this with the current timestamp
    }

    // If this is the cutting stage, always set the current user as the cutter
    if (roll.currentStage === "cutting") {
      updateData.cutById = currentUserId;
      // Make sure the cutting quantity is set if it's null
      if (roll.cuttingQty === null) {
        updateData.cuttingQty = roll.printingQty;
      }
      // We don't need to set cutAt as the server will handle this with the current timestamp
    }

    // Execute the update mutation
    updateRollMutation.mutate(updateData);

    // Get translated stage name
    const stageName = t(`rolls.${roll.currentStage}`);

    toast({
      title: t("production.roll_management.started_stage", {
        stage: stageName,
      }),
      description: t("production.roll_management.processing_begun", {
        rollNumber: roll.serialNumber,
      }),
    });
  };

  const openEditDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card
        className="mobile-card bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/60 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        onClick={openEditDialog}
      >
        <CardContent className="p-4 sm:p-5 pl-[21px] pr-[21px] ml-[-68px] mr-[-68px]">
          {/* Mobile-optimized header */}
          <div className="mb-3 sm:mb-4">
            <p className="font-bold text-base sm:text-lg text-slate-900 break-words leading-tight ml-[-55px] mr-[-55px] pl-[15px] pr-[15px]">
              {customer?.name || t("common.loading")}
              {customer?.nameAr && (
                <span className="text-slate-600 font-medium"> - {customer.nameAr}</span>
              )}
            </p>
          </div>

          {/* Job order and status row */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <span className="font-semibold text-sm sm:text-base text-red-600 break-words">
              JO #{roll.jobOrderId} - {t("rolls.title")} #{roll.serialNumber}
            </span>
            <div className="self-start sm:self-center">
              <StatusBadge status={roll.status} />
            </div>
          </div>

          {/* Mobile-optimized content grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-slate-700">
            <div className="space-y-2">
              <p className="break-words">
                <span className="font-semibold text-slate-900">{t("orders.title")}:</span> #{jobOrder?.orderId}
              </p>
              <p className="break-words">
                <span className="font-semibold text-slate-900">{t("orders.product")}:</span>
                {item?.name || customerProduct?.itemId}
                <span className="ml-1">({customerProduct?.sizeCaption})</span>
              </p>
              <p>
                <span className="font-semibold text-slate-900">{t("orders.quantity")}:</span>{" "}
                {roll.currentStage === "extrusion"
                  ? roll.extrudingQty
                  : roll.currentStage === "printing"
                    ? roll.printingQty
                    : roll.cuttingQty}{" "}
                Kg
              </p>
              {roll.currentStage === "printing" && customerProduct?.printingCylinder && (
                <p>
                  <span className="font-semibold text-slate-900">
                    {t("production.printing_cylinder")}:
                  </span>{" "}
                  {customerProduct.printingCylinder} {t("common.inch")}
                </p>
              )}
            </div>
            
            {/* Operator information section */}
            <div className="bg-slate-50 p-3 rounded-lg space-y-1">
              <h6 className="font-semibold text-slate-900 text-xs sm:text-sm mb-2">Operators</h6>
              <div className="text-xs sm:text-sm text-slate-600 space-y-1">
                <p>
                  <span className="font-medium">{t("production.roll_management.created_by")}:</span>{" "}
                  {creator?.firstName || roll.createdById || t("common.unknown")}
                </p>

                {roll.printedAt && roll.printedById && (
                  <p>
                    <span className="font-medium">{t("production.roll_management.printed_by")}:</span>{" "}
                    {printer?.firstName || roll.printedById}
                  </p>
                )}

                {roll.cutAt && roll.cutById && (
                  <p>
                    <span className="font-medium">{t("production.roll_management.cut_by")}:</span>{" "}
                    {cutter?.firstName || roll.cutById}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile-optimized action buttons */}
          <div className="mt-4 sm:mt-5 flex justify-end border-t pt-3 sm:pt-4 border-slate-200">
            {roll.status === "pending" ? (
              <Button
                size={isMobile ? "lg" : "default"}
                variant="default"
                className="mobile-button bg-green-600 hover:bg-green-700 text-white font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStart();
                }}
                disabled={updateRollMutation.isPending}
              >
                <span className="material-icons mr-2 text-sm">play_arrow</span>
                {t(isMobile ? "common.start" : "production.roll_management.start_process")}
              </Button>
            ) : roll.status === "processing" ? (
              <Button
                size={isMobile ? "lg" : "default"}
                variant="default"
                className="mobile-button bg-blue-600 hover:bg-blue-700 text-white font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete();
                }}
                disabled={updateRollMutation.isPending}
              >
                <span className="material-icons mr-2 text-sm">check_circle</span>
                {t(isMobile ? "common.complete" : "production.roll_management.complete_stage")}
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
      <UpdateRollDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        roll={roll}
      />
    </>
  );
}
