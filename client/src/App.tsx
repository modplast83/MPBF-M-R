import { Switch, Route, useLocation } from "wouter";
import { lazy } from "react";
import { PageTransition, SmoothScroll } from "@/components/ui/page-transition";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/hooks/use-page-transition";
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
// Quality Module imports
import QualityIndex from "@/pages/quality/index";
import QualityCheckTypes from "@/pages/quality/check-types";
import QualityChecks from "@/pages/quality/checks";
import QualityReports from "@/pages/quality/reports";
import QualityViolations from "@/pages/quality/violations";
import QualityPenalties from "@/pages/quality/penalties";
import QualityCorrectiveActions from "@/pages/quality/corrective-actions";
import UnifiedQualityDashboard from "@/pages/quality/unified-dashboard";
import QualityTraining from "@/pages/quality/training";
// HR Training imports
import HRTrainingPage from "@/pages/hr/training";
import Database from "@/pages/system/database";
import Permissions from "@/pages/system/permissions-section-based";
import ImportExport from "@/pages/system/import-export";
import SmsIndex from "@/pages/system/sms/index";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/not-found";
import CustomerInfoPage from "@/pages/public/customer-info";
import NotificationsPage from "@/pages/notifications";
import MainLayout from "@/components/layout/main-layout";
import { AuthProvider } from "@/hooks/use-auth-v2";
import { PermissionsProvider } from "@/hooks/use-permissions";
import { ProtectedRoute } from "@/components/auth/protected-route-v2";

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
// Documents Module imports
import ProfessionalDocumentsIndex from "@/pages/documents/professional-index";
import DocumentsByType from "@/pages/documents/by-type";
import DocumentView from "@/pages/documents/view";
import DocumentEdit from "@/pages/documents/edit";
import DocumentNew from "@/pages/documents/new";
import DocumentTemplates from "@/pages/documents/templates";
import DocumentArchive from "@/pages/documents/archive";
// HR Module imports
import HRIndex from "@/pages/hr/index";
import EmployeeOfMonthPage from "@/pages/hr/employee-of-month";
import AttendancePage from "@/pages/hr/attendance";
import EnhancedAttendancePage from "@/pages/hr/enhanced-attendance";

import OvertimeLeave from "@/pages/hr/overtime-leave";
import GeofenceManagement from "@/pages/hr/geofences";
// Quality Training and Certificates
import QualityTrainingPage from "@/pages/quality/training";
import QualityCertificatesPage from "@/pages/quality/certificates";
// Maintenance Module imports
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
import AnimationDemo from "@/pages/animation-demo";
import { User } from "@shared/schema";

function App() {
  const [location] = useLocation();
  const transitionState = usePageTransition();

  // Remove any existing demo data flag
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("demoDataInitialized");
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        {(authContext) => (
          <PermissionsProvider user={authContext.user}>
            <SmoothScroll>
              <AnimatedBackground variant="gradient">
                <Switch>
                  <Route path="/auth">
                    <PageTransition variant="fade" duration={0.5}>
                      <AuthPage />
                    </PageTransition>
                  </Route>
                  <Route path="/customer-info">
                    <PageTransition variant="slide" duration={0.4}>
                      <CustomerInfoPage />
                    </PageTransition>
                  </Route>
                  <Route path="*">
                    <MainLayout>
                    <Switch>
                      <ProtectedRoute path="/" component={Dashboard} />
                      <ProtectedRoute
                        path="/ai-assistant"
                        component={AIAssistantPage}
                        module="AI Assistant"
                      />
                      <ProtectedRoute
                        path="/animation-demo"
                        component={AnimationDemo}
                        module="Animation Demo"
                      />
                      <ProtectedRoute
                        path="/my-dashboard"
                        component={MyDashboard}
                        module="My Dashboard"
                      />
                      <ProtectedRoute
                        path="/setup"
                        component={SetupIndex}
                        module="Setup"
                      />
                      <ProtectedRoute
                        path="/setup/categories"
                        component={Categories}
                        module="Categories"
                      />
                      <ProtectedRoute
                        path="/setup/products"
                        component={Products}
                        module="Products"
                      />
                      <ProtectedRoute
                        path="/setup/customers"
                        component={Customers}
                        module="Customers"
                      />
                      <ProtectedRoute
                        path="/setup/items"
                        component={Items}
                        module="Items"
                      />
                      <ProtectedRoute
                        path="/setup/sections"
                        component={Sections}
                        module="Sections"
                      />
                      <ProtectedRoute
                        path="/setup/machines"
                        component={Machines}
                        module="Machines"
                      />
                      <ProtectedRoute
                        path="/setup/machine-parts"
                        component={MachineParts}
                        module="Machine Parts"
                      />
                      <ProtectedRoute
                        path="/setup/users"
                        component={Users}
                        module="Users"
                      />
                      <ProtectedRoute
                        path="/setup/aba-formulas"
                        component={AbaFormulas}
                        module="ABA Formulas"
                      />
                      <ProtectedRoute
                        path="/orders"
                        component={OrdersIndex}
                        module="Orders"
                      />
                      <ProtectedRoute
                        path="/orders/new"
                        component={NewOrderPage}
                        module="Orders"
                      />
                      <ProtectedRoute
                        path="/orders/:id"
                        component={OrderDetails}
                        module="Orders"
                      />
                      <ProtectedRoute
                        path="/workflow"
                        component={WorkflowIndex}
                        module="Workflow"
                      />
                      <ProtectedRoute
                        path="/production"
                        component={ProductionIndex}
                        module="Production"
                      />
                      <ProtectedRoute
                        path="/warehouse"
                        component={WarehouseIndex}
                        module="Warehouse"
                      />
                      <ProtectedRoute
                        path="/warehouse/raw-materials"
                        component={RawMaterials}
                        module="Raw Materials"
                      />
                      <ProtectedRoute
                        path="/warehouse/final-products"
                        component={FinalProducts}
                        module="Final Products"
                      />
                      <ProtectedRoute
                        path="/reports"
                        component={ReportsIndex}
                        module="Reports"
                      />
                      <ProtectedRoute
                        path="/reports/performance"
                        component={PerformancePage}
                        module="Performance Metrics"
                      />
                      <ProtectedRoute
                        path="/reports/production"
                        component={ProductionReportsPage}
                        module="Production Reports"
                      />
                      <ProtectedRoute
                        path="/reports/warehouse"
                        component={WarehouseReportsPage}
                        module="Warehouse Reports"
                      />
                      <ProtectedRoute
                        path="/reports/quality"
                        component={QualityReportsPage}
                        module="Quality Reports"
                      />
                      <ProtectedRoute
                        path="/reports/workflow"
                        component={WorkflowReportsPage}
                        module="Workflow Reports"
                      />
                      <ProtectedRoute
                        path="/reports/jo-mix"
                        component={JoMixReports}
                        module="JO Mix Reports"
                      />
                      <ProtectedRoute
                        path="/reports/customer-info-report"
                        component={CustomerInfoReport}
                        module="Customer Information Reports"
                      />
                      <ProtectedRoute
                        path="/quality"
                        component={QualityIndex}
                        module="Quality"
                      />
                      <ProtectedRoute
                        path="/quality/unified-dashboard"
                        component={UnifiedQualityDashboard}
                        module="Unified Dashboard"
                      />
                      <ProtectedRoute
                        path="/quality/check-types"
                        component={QualityCheckTypes}
                        module="Check Types"
                      />
                      <ProtectedRoute
                        path="/quality/checks"
                        component={QualityChecks}
                        module="Checks"
                      />
                      <ProtectedRoute
                        path="/quality/violations"
                        component={QualityViolations}
                        module="Violations"
                      />
                      <ProtectedRoute
                        path="/quality/corrective-actions"
                        component={QualityCorrectiveActions}
                        module="Corrective Actions"
                      />
                      <ProtectedRoute
                        path="/quality/penalties"
                        component={QualityPenalties}
                        module="Penalties"
                      />
                      <ProtectedRoute
                        path="/quality/training"
                        component={QualityTraining}
                        module="Quality Training"
                      />
                      <ProtectedRoute
                        path="/quality/reports"
                        component={QualityReports}
                        module="Quality Reports"
                      />
                      <ProtectedRoute
                        path="/system"
                        component={SystemIndex}
                        module="System Settings"
                      />
                      <ProtectedRoute
                        path="/system/database"
                        component={Database}
                        module="Database"
                      />
                      <ProtectedRoute
                        path="/system/permissions"
                        component={Permissions}
                        module="Permissions"
                      />
                      <ProtectedRoute
                        path="/system/import-export"
                        component={ImportExport}
                        module="Import & Export"
                      />
                      <ProtectedRoute
                        path="/system/sms"
                        component={SmsIndex}
                        module="SMS Management"
                      />
                      <ProtectedRoute
                        path="/notifications"
                        component={NotificationsPage}
                        module="Notifications"
                      />
                      <ProtectedRoute
                        path="/system/email-config"
                        component={EmailConfiguration}
                        module="Email Configuration"
                      />
                      <ProtectedRoute
                        path="/system/server-restart"
                        component={ServerRestart}
                        module="Server Management"
                      />
                      <ProtectedRoute
                        path="/tools"
                        component={ToolsPage}
                        module="Tools"
                      />
                      <ProtectedRoute
                        path="/tools/order-design"
                        component={OrderDesignPage}
                        module="Order Design"
                      />
                      <ProtectedRoute
                        path="/tools/bag-weight"
                        component={BagWeightCalculator}
                        module="Bag Weight Calculator"
                      />
                      <ProtectedRoute
                        path="/tools/ink-consumption"
                        component={InkConsumptionCalculator}
                        module="Ink Consumption"
                      />
                      <ProtectedRoute
                        path="/tools/utilities"
                        component={UtilityTools}
                        module="Utility Tools"
                      />
                      <ProtectedRoute
                        path="/tools/cost-calculator"
                        component={CostCalculatorPage}
                        module="Cost Calculator"
                      />
                      <ProtectedRoute
                        path="/tools/mix-colors"
                        component={MixColorsCalculator}
                        module="Mix Colors"
                      />
                      <ProtectedRoute
                        path="/cliches"
                        component={ClichePage}
                        module="Cliches"
                      />
                      
                      {/* Documents Module Routes */}
                      <ProtectedRoute
                        path="/documents"
                        component={ProfessionalDocumentsIndex}
                        module="Documents"
                      />
                      <ProtectedRoute
                        path="/documents/new"
                        component={DocumentNew}
                        module="New Document"
                      />
                      <ProtectedRoute
                        path="/documents/templates"
                        component={DocumentTemplates}
                        module="Document Templates"
                      />
                      <ProtectedRoute
                        path="/documents/archive"
                        component={DocumentArchive}
                        module="Document Archive"
                      />
                      <ProtectedRoute
                        path="/documents/:type"
                        component={DocumentsByType}
                        module="Documents by Type"
                      />
                      <ProtectedRoute
                        path="/documents/:id/view"
                        component={DocumentView}
                        module="Document View"
                      />
                      <ProtectedRoute
                        path="/documents/:id/edit"
                        component={DocumentEdit}
                        module="Document Edit"
                      />
                      
                      {/* HR Module Routes */}
                      <ProtectedRoute
                        path="/hr"
                        component={HRIndex}
                        module="HR"
                      />
                      <ProtectedRoute
                        path="/hr/enhanced-attendance"
                        component={EnhancedAttendancePage}
                        module="Attendance"
                      />

                      <ProtectedRoute
                        path="/hr/overtime-leave"
                        component={OvertimeLeave}
                        module="Overtime & Leave"
                      />
                      <ProtectedRoute
                        path="/hr/geofences"
                        component={GeofenceManagement}
                        module="Geofence Management"
                      />

                      <ProtectedRoute
                        path="/hr/employee-of-month"
                        component={EmployeeOfMonthPage}
                        module="Employee of the Month"
                      />
                      <ProtectedRoute
                        path="/hr/violations-complaints"
                        component={ViolationsComplaintsPage}
                        module="Violation and Complaint"
                      />
                      <ProtectedRoute
                        path="/hr/violation-trends"
                        component={ViolationTrendsPage}
                        module="Violation Trends"
                      />
                      <ProtectedRoute
                        path="/hr/training"
                        component={HRTrainingPage}
                        module="HR Training"
                      />
                      {/* Quality Module Routes */}
                      <ProtectedRoute
                        path="/quality/training"
                        component={QualityTrainingPage}
                        module="Training"
                      />
                      <ProtectedRoute
                        path="/quality/certificates"
                        component={QualityCertificatesPage}
                        module="Certificates"
                      />
                      {/* Maintenance Module Routes */}
                      <ProtectedRoute
                        path="/maintenance"
                        component={MaintenancePage}
                        module="Maintenance"
                      />
                      <ProtectedRoute
                        path="/maintenance/requests"
                        component={MaintenanceRequestsPage}
                        module="Maintenance Requests"
                      />
                      <ProtectedRoute
                        path="/maintenance/actions"
                        component={MaintenanceActionsPage}
                        module="Maintenance Actions"
                      />
                      <ProtectedRoute
                        path="/maintenance/schedule"
                        component={MaintenanceSchedulePage}
                        module="Maintenance Schedule"
                      />
                      <ProtectedRoute
                        path="/maintenance/dashboard"
                        component={MaintenanceDashboard}
                        module="Dashboard"
                      />
                      {/* Production Module Routes */}
                      <ProtectedRoute
                        path="/production/job-orders"
                        component={JobOrdersPage}
                        module="Job Orders"
                      />
                      <ProtectedRoute
                        path="/production/job-orders-monitor"
                        component={JobOrdersMonitorPage}
                        module="Job Orders Monitor"
                      />
                      <ProtectedRoute
                        path="/production/jo-mix"
                        component={JoMixPage}
                        module="JO Mix"
                      />
                      <ProtectedRoute
                        path="/production/rolls-pro"
                        component={RollsProPage}
                        module="Rolls-Pro"
                      />
                      <ProtectedRoute
                        path="/production/mix-materials"
                        component={MixMaterialsPage}
                        module="Mix Materials"
                      />
                      <ProtectedRoute
                        path="/production/bottleneck-dashboard"
                        component={BottleneckDashboard}
                        module="Bottleneck Monitor"
                      />
                      <ProtectedRoute
                        path="/production/metrics-input"
                        component={MetricsInputPage}
                        module="Production Metrics"
                      />
                      {/* IoT Integration Module Routes */}
                      <ProtectedRoute
                        path="/production/iot-monitor"
                        component={IoTMonitor}
                        module="IoT Monitor"
                      />

                      {/* Notifications Route */}
                      <ProtectedRoute
                        path="/notifications"
                        component={NotificationsPage}
                        module="Notifications"
                      />

                      {/* Employee Dashboard Route */}
                      <ProtectedRoute
                        path="/employee-dashboard"
                        component={EmployeeDashboard}
                        module="Employee Dashboard"
                      />

                      <Route component={NotFound} />
                    </Switch>
                  </MainLayout>
                </Route>
              </Switch>
              </AnimatedBackground>
            </SmoothScroll>
          </PermissionsProvider>
        )}
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
