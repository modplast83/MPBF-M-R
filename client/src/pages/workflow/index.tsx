import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RollCard } from "@/components/workflow/roll-card";
import { CollapsibleJobOrdersForExtrusion } from "@/components/workflow/collapsible-job-orders";
import { GroupedRolls } from "@/components/workflow/grouped-rolls";
import { API_ENDPOINTS } from "@/lib/constants";
import { Roll } from "@shared/schema";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuth } from "@/hooks/use-auth-v2";

export default function WorkflowIndex() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string | null>("extrusion");
  const isMobile = useIsMobile();
  const { hasWorkflowTabPermission } = usePermissions();
  const { user } = useAuth();

  // Determine which tabs should be visible based on permissions
  const showExtrusionTab = hasWorkflowTabPermission("extrusion");
  const showPrintingTab = hasWorkflowTabPermission("printing");
  const showCuttingTab = hasWorkflowTabPermission("cutting");

  // Set a valid default tab based on permissions
  useEffect(() => {
    if (activeTab === "extrusion" && !showExtrusionTab) {
      if (showPrintingTab) {
        setActiveTab("printing");
      } else if (showCuttingTab) {
        setActiveTab("cutting");
      } else {
        // Fallback if no tabs are allowed - shouldn't happen with proper route protection
        setActiveTab("extrusion"); // Use first tab as fallback instead of null
      }
    }
  }, [showExtrusionTab, showPrintingTab, showCuttingTab, activeTab]);

  // Calculate number of visible tabs for grid layout
  const visibleTabsCount = [
    showExtrusionTab,
    showPrintingTab,
    showCuttingTab,
  ].filter(Boolean).length;

  // Fetch rolls by stage - only fetch what we need based on permissions and active tab
  const { data: extrusionRolls, isLoading: extrusionLoading } = useQuery<
    Roll[]
  >({
    queryKey: [`${API_ENDPOINTS.ROLLS}/stage/extrusion`],
    enabled:
      showExtrusionTab && (activeTab === "extrusion" || activeTab === null),
  });

  const { data: printingRolls, isLoading: printingLoading } = useQuery<Roll[]>({
    queryKey: [`${API_ENDPOINTS.ROLLS}/stage/printing`],
    enabled:
      showPrintingTab && (activeTab === "printing" || activeTab === null),
  });

  const { data: cuttingRolls, isLoading: cuttingLoading } = useQuery<Roll[]>({
    queryKey: [`${API_ENDPOINTS.ROLLS}/stage/cutting`],
    enabled: showCuttingTab && (activeTab === "cutting" || activeTab === null),
  });

  // If no tabs are visible, show a message
  if (visibleTabsCount === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-secondary-500">
          <div className="material-icons text-4xl mb-2">lock</div>
          <h2 className="text-xl font-medium mb-1">No Access</h2>
          <p>You don't have permission to access any workflow tabs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header Section - Mobile optimized */}
      <div className="page-header">
        <h1 className="page-title">
          {t("production.workflow")}
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size={isMobile ? "lg" : "default"}
            className="mobile-button flex items-center justify-center"
          >
            <span className="material-icons text-lg mr-2">filter_list</span>
            {t("common.filter")}
          </Button>
          <Button
            variant="outline"
            size={isMobile ? "lg" : "default"}
            className="mobile-button flex items-center justify-center"
          >
            <span className="material-icons text-lg mr-2">file_download</span>
            {t("common.export")}
          </Button>
        </div>
      </div>
      <Card className="rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-sm text-card-foreground shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:scale-[1.02] hover:border-slate-300/80 mobile-card pl-[32px] pr-[32px] ml-[-26px] mr-[-26px]">
        <CardHeader className="p-4 sm:p-6 border-b border-slate-200/50">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900">
            {t("production.roll_management.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-4 lg:p-6">
          <Tabs
            defaultValue={activeTab || undefined}
            onValueChange={setActiveTab}
          >
            {/* Mobile-optimized TabsList */}
            <TabsList className="h-auto min-h-[48px] sm:min-h-[50px] items-center justify-center rounded-xl text-muted-foreground w-full flex mb-4 sm:mb-6 p-1.5 sm:p-2 gap-1 sm:gap-2 bg-slate-100/80 overflow-x-auto">
              {showExtrusionTab && (
                <TabsTrigger
                  value="extrusion"
                  className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md min-w-[60px]"
                >
                  <span className="material-icons text-primary-500 text-lg sm:text-lg">
                    merge_type
                  </span>
                  <span className="sm:text-sm text-[18px] font-extrabold">
                    {isMobile ? "Extr" : t("rolls.extrusion")}
                  </span>
                  <span className="h-4 w-4 sm:h-6 sm:w-6 flex-shrink-0 rounded-full bg-primary-100 sm:text-xs font-bold flex items-center justify-center text-primary-700 text-[17px]">
                    {extrusionLoading ? "-" : extrusionRolls?.length || 0}
                  </span>
                </TabsTrigger>
              )}

              {showPrintingTab && (
                <TabsTrigger
                  value="printing"
                  className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md min-w-[60px]"
                >
                  <span className="material-icons text-orange-500 text-lg sm:text-lg">
                    format_color_fill
                  </span>
                  <span className="sm:text-sm text-[17px] font-extrabold">
                    {isMobile ? "Print" : t("rolls.printing")}
                  </span>
                  <span className="h-4 w-4 sm:h-6 sm:w-6 flex-shrink-0 rounded-full bg-orange-100 sm:text-xs font-bold flex items-center justify-center text-orange-700 text-[17px]">
                    {printingLoading ? "-" : printingRolls?.length || 0}
                  </span>
                </TabsTrigger>
              )}

              {showCuttingTab && (
                <TabsTrigger
                  value="cutting"
                  className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md min-w-[60px]"
                >
                  <span className="material-icons text-green-500 text-lg sm:text-lg">
                    content_cut
                  </span>
                  <span className="sm:text-sm text-[17px] font-extrabold">
                    {isMobile ? "Cut" : t("rolls.cutting")}
                  </span>
                  <span className="h-4 w-4 sm:h-6 sm:w-6 flex-shrink-0 rounded-full bg-green-100 sm:text-xs font-bold flex items-center justify-center text-green-700 text-[17px]">
                    {cuttingLoading
                      ? "-"
                      : cuttingRolls?.filter(
                          (roll) => roll.status !== "completed",
                        ).length || 0}
                  </span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* Extrusion Tab Content - Mobile optimized */}
            {showExtrusionTab && (
              <TabsContent value="extrusion" className="space-y-4 sm:space-y-6">
                <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-lg pl-[0px] pr-[0px] ml-[-29px] mr-[-29px]">
                  <div className="flex items-start sm:items-center mb-4 sm:mb-6">
                    <div className="rounded-full bg-primary-100 p-3 mr-4 shrink-0">
                      <span className="material-icons text-primary-600 text-xl">
                        merge_type
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-base sm:text-lg text-slate-900 mb-1">
                        {t("production.roll_management.extrusion_stage")}
                      </h4>
                      <p className="text-sm sm:text-base text-slate-600">
                        {t("production.roll_management.create_rolls")}
                      </p>
                    </div>
                  </div>

                  {/* Job Orders for Extrusion - Collapsible by Order ID */}
                  <CollapsibleJobOrdersForExtrusion />

                  {/* Active Extrusion Rolls */}
                  <div className="mt-6 sm:mt-8">
                    <h5 className="font-semibold text-base sm:text-lg text-slate-900 mb-4 sm:mb-6">
                      {t("production.roll_management.rolls_in_extrusion")}
                    </h5>
                    <div className="space-y-4 sm:space-y-6">
                      {extrusionLoading ? (
                        <div className="space-y-4">
                          <div className="animate-pulse bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-blue-200/50 h-32 sm:h-40"></div>
                          <div className="animate-pulse bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-blue-200/50 h-32 sm:h-40"></div>
                        </div>
                      ) : extrusionRolls && extrusionRolls.length > 0 ? (
                        // Sort rolls by job order ID first, then by roll ID
                        ([...extrusionRolls]
                          .sort((a, b) => {
                            // First sort by job order ID
                            if (a.jobOrderId !== b.jobOrderId) {
                              return a.jobOrderId - b.jobOrderId;
                            }
                            // Then sort by roll ID
                            return a.id.localeCompare(b.id);
                          })
                          .map((roll) => <RollCard key={roll.id} roll={roll} />))
                      ) : (
                        <div className="py-8 sm:py-12 text-center text-slate-500 bg-white/80 backdrop-blur-sm rounded-xl border border-dashed border-blue-200">
                          <span className="material-icons text-4xl sm:text-5xl mb-3 text-blue-300">
                            hourglass_empty
                          </span>
                          <p className="text-sm sm:text-base font-medium">
                            {t("production.roll_management.no_rolls_extrusion")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}

            {/* Printing Tab Content - Mobile optimized */}
            {showPrintingTab && (
              <TabsContent value="printing" className="space-y-4 sm:space-y-6">
                <div className="p-4 sm:p-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/50 rounded-lg pl-[0px] pr-[0px] ml-[-17px] mr-[-17px]">
                  <div className="flex items-start sm:items-center mb-4 sm:mb-6">
                    <div className="rounded-full bg-orange-100 p-3 mr-4 shrink-0">
                      <span className="material-icons text-orange-600 text-xl">
                        format_color_fill
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-base sm:text-lg text-slate-900 mb-1">
                        {t("production.roll_management.printing_stage")}
                      </h4>
                      <p className="text-sm sm:text-base text-slate-600 mb-2">
                        {printingLoading
                          ? t("production.roll_management.loading")
                          : `${printingRolls?.length || 0} ${t("production.roll_management.rolls_ready_printing")}`}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500">
                        {t("production.roll_management.printing_note")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    {printingLoading ? (
                      <div className="space-y-4">
                        <div className="animate-pulse bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-orange-200/50 h-32 sm:h-40"></div>
                        <div className="animate-pulse bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-orange-200/50 h-32 sm:h-40"></div>
                      </div>
                    ) : printingRolls && printingRolls.length > 0 ? (
                      <GroupedRolls rolls={printingRolls} stage="printing" />
                    ) : (
                      <div className="py-8 sm:py-12 text-center text-slate-500 bg-white/80 backdrop-blur-sm rounded-xl border border-dashed border-orange-200">
                        <span className="material-icons text-4xl sm:text-5xl mb-3 text-orange-300">
                          hourglass_empty
                        </span>
                        <p className="text-sm sm:text-base font-medium">
                          {t("production.roll_management.no_rolls_printing")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            )}

            {/* Cutting Tab Content - Mobile optimized */}
            {showCuttingTab && (
              <TabsContent value="cutting" className="space-y-4 sm:space-y-6">
                <div className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-lg ml-[-21px] mr-[-21px] pl-[11px] pr-[11px]">
                  <div className="flex items-start sm:items-center mb-4 sm:mb-6">
                    <div className="rounded-full bg-green-100 p-3 mr-4 shrink-0">
                      <span className="material-icons text-green-600 text-xl">
                        content_cut
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-base sm:text-lg text-slate-900 mb-1">
                        {t("production.roll_management.cutting_stage")}
                      </h4>
                      <p className="text-sm sm:text-base text-slate-600 mb-2">
                        {cuttingLoading
                          ? t("production.roll_management.loading")
                          : `${cuttingRolls?.filter((roll) => roll.status !== "completed").length || 0} ${t("production.roll_management.rolls_ready_cutting")}`}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500">
                        {t("production.roll_management.cutting_note")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    {cuttingLoading ? (
                      <div className="space-y-4">
                        <div className="animate-pulse bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-green-200/50 h-32 sm:h-40"></div>
                        <div className="animate-pulse bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-green-200/50 h-32 sm:h-40"></div>
                      </div>
                    ) : cuttingRolls && cuttingRolls.length > 0 ? (
                      <GroupedRolls rolls={cuttingRolls} stage="cutting" />
                    ) : (
                      <div className="py-8 sm:py-12 text-center text-slate-500 bg-white/80 backdrop-blur-sm rounded-xl border border-dashed border-green-200">
                        <span className="material-icons text-4xl sm:text-5xl mb-3 text-green-300">
                          hourglass_empty
                        </span>
                        <p className="text-sm sm:text-base font-medium">
                          {t("production.roll_management.no_rolls_cutting")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
