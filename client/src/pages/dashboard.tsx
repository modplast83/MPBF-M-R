import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Grid3X3 } from "lucide-react";
import { RoleBasedDashboard } from "@/components/dashboard/role-based-dashboard";
import { EnhancedCustomizableDashboard } from "@/components/dashboard/enhanced-customizable-dashboard";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<"standard" | "customizable">(
    "customizable",
  );
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className={`space-y-6 animate-fade-in ${isMobile ? "px-1" : ""}`}>
      <div className={`flex ${isMobile ? "flex-col space-y-4" : "justify-between items-center"} ${
        isMobile ? "p-4" : "p-6"
      } rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20`}>
        <div>
          <h1 className={`${
            isMobile ? "text-2xl" : "text-3xl"
          } font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`}>
            {t("dashboard.title")}
          </h1>
          <p className={`text-muted-foreground mt-1 ${isMobile ? "text-sm" : ""}`}>
            {isMobile ? "Production dashboard" : "Welcome back to your production dashboard"}
          </p>
        </div>
        <div className={`flex items-center gap-2 p-1 rounded-lg bg-background/50 backdrop-blur-sm ${
          isMobile ? "w-full" : ""
        }`}>
          <Button
            variant={viewMode === "standard" ? "default" : "ghost"}
            size={isMobile ? "sm" : "sm"}
            onClick={() => setViewMode("standard")}
            className={`transition-all duration-300 ${isMobile ? "flex-1" : ""} ${
              viewMode === "standard" ? "bg-gradient-to-r from-primary to-accent text-white" : ""
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
            {!isMobile && <span className="ml-1">{t("dashboard.standard")}</span>}
            {isMobile && <span className="ml-1 text-xs">Standard</span>}
          </Button>
          <Button
            variant={viewMode === "customizable" ? "default" : "ghost"}
            size={isMobile ? "sm" : "sm"}
            onClick={() => setViewMode("customizable")}
            className={`transition-all duration-300 ${isMobile ? "flex-1" : ""} ${
              viewMode === "customizable" ? "bg-gradient-to-r from-primary to-accent text-white" : ""
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            {!isMobile && <span className="ml-1">{t("dashboard.customizable")}</span>}
            {isMobile && <span className="ml-1 text-xs">Custom</span>}
          </Button>
        </div>
      </div>

      {viewMode === "customizable" ? (
        <EnhancedCustomizableDashboard />
      ) : (
        <RoleBasedDashboard />
      )}
    </div>
  );
}
