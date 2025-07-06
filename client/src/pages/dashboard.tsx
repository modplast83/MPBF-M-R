import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Grid3X3 } from "lucide-react";
import { RoleBasedDashboard } from "@/components/dashboard/role-based-dashboard";
import { CustomizableDashboardV2 } from "@/components/dashboard/customizable-dashboard-v2";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<"standard" | "customizable">(
    "customizable",
  );
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t("dashboard.title")}
          </h1>
          <p className="text-muted-foreground mt-1">Welcome back to your production dashboard</p>
        </div>
        <div className="flex items-center gap-2 p-1 rounded-lg bg-background/50 backdrop-blur-sm">
          <Button
            variant={viewMode === "standard" ? "gradient" : "ghost"}
            size="sm"
            onClick={() => setViewMode("standard")}
            className="transition-all duration-300"
          >
            <Grid3X3 className="h-4 w-4 mr-1" />
            {t("dashboard.standard")}
          </Button>
          <Button
            variant={viewMode === "customizable" ? "gradient" : "ghost"}
            size="sm"
            onClick={() => setViewMode("customizable")}
            className="transition-all duration-300"
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            {t("dashboard.customizable")}
          </Button>
        </div>
      </div>

      {viewMode === "customizable" ? (
        <CustomizableDashboardV2 />
      ) : (
        <RoleBasedDashboard />
      )}
    </div>
  );
}
