import { Switch, Route } from "wouter";
import Dashboard from "@/pages/dashboard";
import MyDashboard from "@/pages/my-dashboard";
import SetupIndex from "@/pages/setup/index";
import Categories from "@/pages/setup/categories";
import Products from "@/pages/setup/products";
import Customers from "@/pages/setup/customers";
import Items from "@/pages/setup/items";
import Sections from "@/pages/setup/sections";
import Machines from "@/pages/setup/machines";
import MachineParts from "@/pages/setup/machine-parts";
import Users from "@/pages/setup/users";
import AbaFormulas from "@/pages/setup/aba-formulas";
import OrdersIndex from "@/pages/orders/index";
import OrderDetails from "@/pages/orders/[id]";
import NewOrderPage from "@/pages/orders/new";
import WorkflowIndex from "@/pages/workflow/index";
import ProductionIndex from "@/pages/production/index";
import MixMaterialsPage from "@/pages/production/mix-materials";
import JobOrdersPage from "@/pages/production/job-orders";
import JobOrdersMonitorPage from "@/pages/production/job-orders-monitor";
import JoMixPage from "@/pages/production/jo-mix";
import RollsProPage from "@/pages/production/rolls-pro";
import WarehouseIndex from "@/pages/warehouse/index";
import RawMaterials from "@/pages/warehouse/raw-materials";
import FinalProducts from "@/pages/warehouse/final-products";
import ReportsIndex from "@/pages/reports/index";
import PerformancePage from "@/pages/reports/performance";
import ProductionReportsPage from "@/pages/reports/production";
import WarehouseReportsPage from "@/pages/reports/warehouse";
import QualityReportsPage from "@/pages/reports/quality";
import WorkflowReportsPage from "@/pages/reports/workflow";
import JoMixReports from "@/pages/reports/jo-mix";
import CustomerInfoReport from "@/pages/reports/customer-info-report";
import SystemIndex from "@/pages/system/index";
import QualityIndex from "@/pages/quality/index";
import QualityCheckTypes from "@/pages/quality/check-types";
import QualityChecks from "@/pages/quality/checks";
import QualityReports from "@/pages/quality/reports";
import QualityViolations from "@/pages/quality/violations";
import QualityPenalties from "@/pages/quality/penalties";
import QualityCorrectiveActions from "@/pages/quality/corrective-actions";
import UnifiedQualityDashboard from "@/pages/quality/unified-dashboard";
import QualityTraining from "@/pages/quality/training";
import HRTrainingPage from "@/pages/hr/training";
import Database from "@/pages/system/database";
import Permissions from "@/pages/system/permissions-section-based";
import ImportExport from "@/pages/system/import-export";
import SmsIndex from "@/pages/system/sms/index";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";
import CustomerInfoPage from "@/pages/public/customer-info";
import NotificationsPage from "@/pages/notifications";
import MainLayout from "@/components/layout/main-layout";
import { useAuth } from "@/hooks/useAuth";
import { PermissionsProvider } from "@/hooks/use-permissions";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useEffect } from "react";
import ToolsPage from "@/pages/tools/ToolsPage";
import BagWeightCalculator from "@/pages/tools/bag-weight";
import InkConsumptionCalculator from "@/pages/tools/ink-consumption";
import UtilityTools from "@/pages/tools/utilities";
import CostCalculatorPage from "@/pages/tools/cost-calculator";
import MixColorsCalculator from "@/pages/tools/mix-colors";
import OrderDesignPage from "@/pages/tools/order-design";
import ClichePage from "@/pages/cliches/index";
import ProfessionalDocumentsIndex from "@/pages/documents/professional-index";
import DocumentsByType from "@/pages/documents/by-type";
import DocumentView from "@/pages/documents/view";
import DocumentEdit from "@/pages/documents/edit";
import DocumentNew from "@/pages/documents/new";
import DocumentTemplates from "@/pages/documents/templates";
import DocumentArchive from "@/pages/documents/archive";
import HRIndex from "@/pages/hr/index";
import EmployeeOfMonthPage from "@/pages/hr/employee-of-month";
import AttendancePage from "@/pages/hr/attendance";
import EnhancedAttendancePage from "@/pages/hr/enhanced-attendance";
import OvertimeLeave from "@/pages/hr/overtime-leave";
import GeofenceManagement from "@/pages/hr/geofences";
import QualityTrainingPage from "@/pages/quality/training";
import QualityCertificatesPage from "@/pages/quality/certificates";
import MaintenancePage from "@/pages/maintenance/index";
import MaintenanceRequestsPage from "@/pages/maintenance/requests";
import MaintenanceActionsPage from "@/pages/maintenance/actions";
import MaintenanceSchedulePage from "@/pages/maintenance/schedule";
import MaintenanceDashboard from "@/pages/maintenance/dashboard";
import ViolationsComplaintsPage from "@/pages/hr/violations-complaints";
import ViolationTrendsPage from "@/pages/hr/violation-trends";
import BottleneckDashboard from "@/pages/production/bottleneck-dashboard";
import MetricsInputPage from "@/pages/production/metrics-input";
import IoTMonitor from "@/pages/production/iot-monitor";
import EmployeeDashboard from "@/pages/employee-dashboard";
import ServerRestart from "@/pages/system/server-restart";
import EmailConfiguration from "@/pages/system/email-config";
import AIAssistantPage from "@/pages/ai-assistant";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/ai-assistant" component={AIAssistantPage} />
          <Route path="/my-dashboard" component={MyDashboard} />
          <Route path="/setup" component={SetupIndex} />
          <Route path="/setup/categories" component={Categories} />
          <Route path="/setup/products" component={Products} />
          <Route path="/setup/customers" component={Customers} />
          <Route path="/setup/items" component={Items} />
          <Route path="/setup/sections" component={Sections} />
          <Route path="/setup/machines" component={Machines} />
          <Route path="/setup/machine-parts" component={MachineParts} />
          <Route path="/setup/users" component={Users} />
          <Route path="/setup/aba-formulas" component={AbaFormulas} />
          <Route path="/orders" component={OrdersIndex} />
          <Route path="/orders/new" component={NewOrderPage} />
          <Route path="/orders/:id" component={OrderDetails} />
          <Route path="/workflow" component={WorkflowIndex} />
          <Route path="/production" component={ProductionIndex} />
          <Route path="/warehouse" component={WarehouseIndex} />
          <Route path="/warehouse/raw-materials" component={RawMaterials} />
          <Route path="/warehouse/final-products" component={FinalProducts} />
          <Route path="/reports" component={ReportsIndex} />
          <Route path="/reports/performance" component={PerformancePage} />
          <Route path="/reports/production" component={ProductionReportsPage} />
          <Route path="/reports/warehouse" component={WarehouseReportsPage} />
          <Route path="/reports/quality" component={QualityReportsPage} />
          <Route path="/reports/workflow" component={WorkflowReportsPage} />
          <Route path="/reports/jo-mix" component={JoMixReports} />
          <Route path="/reports/customer-info-report" component={CustomerInfoReport} />
          <Route path="/quality" component={QualityIndex} />
          <Route path="/quality/unified-dashboard" component={UnifiedQualityDashboard} />
          <Route path="/quality/check-types" component={QualityCheckTypes} />
          <Route path="/quality/checks" component={QualityChecks} />
          <Route path="/quality/violations" component={QualityViolations} />
          <Route path="/quality/corrective-actions" component={QualityCorrectiveActions} />
          <Route path="/quality/penalties" component={QualityPenalties} />
          <Route path="/quality/training" component={QualityTraining} />
          <Route path="/quality/reports" component={QualityReports} />
          <Route path="/system" component={SystemIndex} />
          <Route path="/system/database" component={Database} />
          <Route path="/system/permissions" component={Permissions} />
          <Route path="/system/import-export" component={ImportExport} />
          <Route path="/system/sms" component={SmsIndex} />
          <Route path="/notifications" component={NotificationsPage} />
          <Route path="/system/email-config" component={EmailConfiguration} />
          <Route path="/system/server-restart" component={ServerRestart} />
          <Route path="/tools" component={ToolsPage} />
          <Route path="/tools/order-design" component={OrderDesignPage} />
          <Route path="/tools/bag-weight" component={BagWeightCalculator} />
          <Route path="/tools/ink-consumption" component={InkConsumptionCalculator} />
          <Route path="/tools/utilities" component={UtilityTools} />
          <Route path="/tools/cost-calculator" component={CostCalculatorPage} />
          <Route path="/tools/mix-colors" component={MixColorsCalculator} />
          <Route path="/cliches" component={ClichePage} />
          <Route path="/documents" component={ProfessionalDocumentsIndex} />
          <Route path="/documents/by-type/:type" component={DocumentsByType} />
          <Route path="/documents/view/:id" component={DocumentView} />
          <Route path="/documents/edit/:id" component={DocumentEdit} />
          <Route path="/documents/new" component={DocumentNew} />
          <Route path="/documents/templates" component={DocumentTemplates} />
          <Route path="/documents/archive" component={DocumentArchive} />
          <Route path="/hr" component={HRIndex} />
          <Route path="/hr/employee-of-month" component={EmployeeOfMonthPage} />
          <Route path="/hr/attendance" component={AttendancePage} />
          <Route path="/hr/enhanced-attendance" component={EnhancedAttendancePage} />
          <Route path="/hr/overtime-leave" component={OvertimeLeave} />
          <Route path="/hr/geofences" component={GeofenceManagement} />
          <Route path="/hr/training" component={HRTrainingPage} />
          <Route path="/hr/violations-complaints" component={ViolationsComplaintsPage} />
          <Route path="/hr/violation-trends" component={ViolationTrendsPage} />
          <Route path="/maintenance" component={MaintenancePage} />
          <Route path="/maintenance/requests" component={MaintenanceRequestsPage} />
          <Route path="/maintenance/actions" component={MaintenanceActionsPage} />
          <Route path="/maintenance/schedule" component={MaintenanceSchedulePage} />
          <Route path="/maintenance/dashboard" component={MaintenanceDashboard} />
          <Route path="/production/mix-materials" component={MixMaterialsPage} />
          <Route path="/production/job-orders" component={JobOrdersPage} />
          <Route path="/production/job-orders-monitor" component={JobOrdersMonitorPage} />
          <Route path="/production/jo-mix" component={JoMixPage} />
          <Route path="/production/rolls-pro" component={RollsProPage} />
          <Route path="/production/bottleneck-dashboard" component={BottleneckDashboard} />
          <Route path="/production/metrics-input" component={MetricsInputPage} />
          <Route path="/production/iot-monitor" component={IoTMonitor} />
          <Route path="/quality/certificates" component={QualityCertificatesPage} />
          <Route path="/employee-dashboard" component={EmployeeDashboard} />
        </>
      )}
      <Route path="/customer-info" component={CustomerInfoPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { user } = useAuth();

  // Remove any existing demo data flag
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("demoDataInitialized");
    }
  }, []);

  return (
    <ErrorBoundary>
      <PermissionsProvider user={user}>
        <div>
          <Switch>
            <Route path="/customer-info" component={CustomerInfoPage} />
            <Route path="*">
              <MainLayout>
                <Router />
              </MainLayout>
            </Route>
          </Switch>
        </div>
      </PermissionsProvider>
    </ErrorBoundary>
  );
}

export default App;