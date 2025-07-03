// @ts-nocheck
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/ui/page-header";
import { useToast } from "@/hooks/use-toast";
// import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
// import { format } from "date-fns";

// Simple date formatting function
const formatDate = (date: Date | string, formatStr: string = 'dd/MM/yyyy') => {
  const d = new Date(date);
  if (formatStr === 'dd/MM/yyyy') {
    return d.toLocaleDateString('en-GB');
  } else if (formatStr === 'dd/MM/yyyy HH:mm') {
    return d.toLocaleString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  } else if (formatStr === 'MMM dd, yyyy') {
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    });
  }
  return d.toLocaleDateString();
};

// Translation function for maintenance actions
const t = (key: string): string => {
  const translations: Record<string, string> = {
    // Page titles and headers
    'maintenance.actions.title': 'Maintenance Actions',
    'maintenance.actions.description': 'Manage and track all maintenance actions performed on equipment',
    'maintenance.actions.add_action': 'Add New Action',
    'maintenance.actions.no_actions': 'No maintenance actions found',
    'maintenance.actions.create_first': 'Create your first maintenance action to get started',
    
    // Table headers
    'maintenance.actions.table.id': 'ID',
    'maintenance.actions.table.date': 'Date',
    'maintenance.actions.table.request': 'Request',
    'maintenance.actions.table.machine': 'Machine',
    'maintenance.actions.table.type': 'Action Type',
    'maintenance.actions.table.performed_by': 'Performed By',
    'maintenance.actions.table.hours': 'Hours',
    'maintenance.actions.table.cost': 'Cost',
    'maintenance.actions.table.status': 'Status',
    'maintenance.actions.table.description': 'Description',
    'maintenance.actions.table.actions': 'Actions',
    
    // Action types
    'maintenance.actions.types.repair': 'Repair',
    'maintenance.actions.types.replacement': 'Replacement',
    'maintenance.actions.types.maintenance': 'Maintenance',
    'maintenance.actions.types.inspection': 'Inspection',
    'maintenance.actions.types.cleaning': 'Cleaning',
    'maintenance.actions.types.calibration': 'Calibration',
    'maintenance.actions.types.change_parts': 'Change Parts',
    'maintenance.actions.types.workshop': 'Workshop',
    
    // Status types
    'maintenance.actions.status.completed': 'Completed',
    'maintenance.actions.status.in_progress': 'In Progress',
    'maintenance.actions.status.pending': 'Pending',
    
    // Dialog titles and descriptions
    'maintenance.actions.view.title': 'Maintenance Action Details',
    'maintenance.actions.view.description': 'View detailed information about this maintenance action',
    'maintenance.actions.edit.title': 'Edit Maintenance Action',
    'maintenance.actions.edit.description': 'Update the maintenance action details',
    'maintenance.actions.add.title': 'Add Maintenance Action',
    'maintenance.actions.add.description': 'Record a new maintenance action performed on equipment',
    
    // Form labels
    'maintenance.actions.form.request': 'Maintenance Request',
    'maintenance.actions.form.machine': 'Machine',
    'maintenance.actions.form.action_type': 'Action Type',
    'maintenance.actions.form.status': 'Status',
    'maintenance.actions.form.description': 'Description',
    'maintenance.actions.form.cost': 'Parts Cost ($)',
    'maintenance.actions.form.hours': 'Labor Hours',
    'maintenance.actions.form.part_replaced': 'Part Replaced',
    'maintenance.actions.form.performed_by': 'Performed By',
    
    // Placeholders
    'maintenance.actions.placeholder.select_request': 'Select Request',
    'maintenance.actions.placeholder.select_machine': 'Select Machine',
    'maintenance.actions.placeholder.select_type': 'Select Action Type',
    'maintenance.actions.placeholder.select_status': 'Select Status',
    'maintenance.actions.placeholder.select_user': 'Select User',
    'maintenance.actions.placeholder.description': 'Describe the action taken',
    'maintenance.actions.placeholder.cost': '0.00',
    'maintenance.actions.placeholder.hours': '0.0',
    'maintenance.actions.placeholder.part': 'Part name or description',
    
    // Buttons and actions
    'maintenance.actions.button.view': 'View Action Details',
    'maintenance.actions.button.print': 'Print Action',
    'maintenance.actions.button.edit': 'Edit Action',
    'maintenance.actions.button.delete': 'Delete Action',
    'maintenance.actions.button.add': 'Add Action',
    'maintenance.actions.button.save': 'Save Action',
    'maintenance.actions.button.update': 'Update Action',
    'maintenance.actions.button.cancel': 'Cancel',
    'maintenance.actions.button.filter': 'Filter Actions',
    'maintenance.actions.button.refresh': 'Refresh',
    'maintenance.actions.record': 'Add Action',
    'maintenance.actions.create': 'Add Maintenance Action',
    'maintenance.actions.maintenanceRequest': 'Maintenance Request',
    'maintenance.actions.selectMaintenanceRequest': 'Select Request',
    'maintenance.actions.actionsTaken': 'Actions Taken',
    'maintenance.actions.partsCost': 'Parts Cost',
    'maintenance.actions.laborHours': 'Labor Hours',
    'maintenance.actions.notes': 'Notes',
    'maintenance.actions.readyToWork': 'Machine ready to work after repair',
    'maintenance.actions.recording': 'Recording...',
    'maintenance.actions.recordAction': 'Record Action',
    'maintenance.actions.table_title': 'Maintenance Actions ({count})',
    'maintenance.actions.table_description': 'Complete list of all maintenance actions',
    
    // Table headers
    'maintenance.actions.id': 'Action ID',
    'maintenance.actions.date': 'Date',
    'maintenance.actions.request': 'Request',
    'maintenance.actions.machine': 'Machine',
    'maintenance.actions.actionBy': 'Performed By',
    'maintenance.actions.status': 'Status',
    'maintenance.actions.description': 'Description',
    'maintenance.actions.actions': 'Actions',
    
    // Button tooltips
    'maintenance.actions.tooltip.view': 'View Action Details',
    'maintenance.actions.tooltip.print': 'Print Action',
    'maintenance.actions.tooltip.edit': 'Edit Action',
    'maintenance.actions.tooltip.delete': 'Delete Action',
    
    // Mobile view labels
    'maintenance.actions.mobile.machine': 'Machine:',
    'maintenance.actions.mobile.performed_by': 'Performed By:',
    'maintenance.actions.mobile.date': 'Date:',
    'maintenance.actions.mobile.hours': 'Hours:',
    'maintenance.actions.mobile.cost': 'Cost:',
    
    // Edit form placeholders
    'maintenance.actions.edit.selectMachine': 'Select Machine',
    'maintenance.actions.edit.selectActionType': 'Select Action Type',
    'maintenance.actions.edit.selectStatus': 'Select Status',
    
    // Additional dialog descriptions
    'maintenance.actions.view.dialog_description': 'View detailed information about this maintenance action.',
    
    // Messages
    'maintenance.actions.creating': 'Creating...',
    'maintenance.actions.updating': 'Updating...',
    'maintenance.actions.deleting': 'Deleting...',
    'maintenance.actions.success.created': 'Action created successfully',
    'maintenance.actions.success.updated': 'Action updated successfully',
    'maintenance.actions.success.deleted': 'Action deleted successfully',
    'maintenance.actions.error.create': 'Failed to create action',
    'maintenance.actions.error.update': 'Failed to update action',
    'maintenance.actions.error.delete': 'Failed to delete action',
    'maintenance.actions.error.load': 'Failed to load actions',
    'maintenance.actions.confirm.delete': 'Are you sure you want to delete this action?',
    'maintenance.actions.loading': 'Loading actions...',
    
    // Search and filters
    'maintenance.actions.search_placeholder': 'Search actions...',
    'maintenance.actions.filter_status': 'Filter by status',
    'maintenance.actions.filter_all': 'All Status',
    'maintenance.actions.filter_pending': 'Pending',
    'maintenance.actions.filter_progress': 'In Progress',
    'maintenance.actions.filter_completed': 'Completed',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.print': 'Print',
    'common.view': 'View',
    'common.add': 'Add',
    'common.actions': 'Actions',
    'common.required': 'Required'
  };
  
  return translations[key] || key.split('.').pop() || key;
};
import { QuickActions } from "@/components/ui/quick-actions";
import { Plus, RefreshCw, Filter, Search, Wrench, FileText, DollarSign, Eye, Printer, Edit, Trash2 } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";

const ACTION_TYPES = ["Repair", "Change Parts", "Workshop"];

interface MaintenanceAction {
  id: number;
  actionDate: string;
  requestId: number;
  machineId: string;
  performedBy: string;
  actionType: string;
  description: string;
  cost: number;
  hours: number;
  status: string;
  partReplaced?: string;
  partId?: number;
}

interface MaintenanceRequest {
  id: number;
  requestNumber: string;
  machineId: string;
  damageType: string;
  severity: string;
  description: string;
  status: string;
  createdAt?: string;
}

interface Machine {
  id: string;
  name: string;
  sectionId: string;
}

interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export default function MaintenanceActionsPage() {
  // const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<MaintenanceAction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedRequestId = urlParams.get('requestId');

  const [formData, setFormData] = useState({
    requestId: "",
    machineId: "",
    actionsTaken: [] as string[],
    description: "",
    partsCost: "",
    laborHours: "",
    notes: "",
    readyToWork: false,
  });

  const [editFormData, setEditFormData] = useState({
    requestId: "",
    machineId: "",
    actionType: "",
    description: "",
    cost: "",
    hours: "",
    status: "pending",
    partReplaced: "",
  });

  // Fetch maintenance actions
  const { data: actions = [], isLoading: actionsLoading, refetch: refetchActions } = useQuery({
    queryKey: [API_ENDPOINTS.MAINTENANCE_ACTIONS],
    queryFn: () => apiRequest('GET', API_ENDPOINTS.MAINTENANCE_ACTIONS)
  });

  // Fetch maintenance requests
  const { data: requests = [] } = useQuery({
    queryKey: [API_ENDPOINTS.MAINTENANCE_REQUESTS],
    queryFn: () => apiRequest('GET', API_ENDPOINTS.MAINTENANCE_REQUESTS)
  });

  // Fetch machines
  const { data: machines = [] } = useQuery({
    queryKey: ['/api/machines'],
    queryFn: () => apiRequest('GET', '/api/machines')
  });

  // Fetch users
  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => apiRequest('GET', '/api/users')
  });

  // Helper functions
  const getMachineName = (machineId: string) => {
    const machine = machines.find((m: Machine) => m.id === machineId);
    return machine ? machine.name : machineId;
  };

  const getUserName = (userId: string) => {
    const user = users.find((u: User) => u.id === userId);
    return user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : userId;
  };

  // Auto-populate form when requestId is provided in URL
  useEffect(() => {
    if (preSelectedRequestId && requests.length > 0) {
      const selectedRequest = requests.find((r: MaintenanceRequest) => r.id.toString() === preSelectedRequestId);
      if (selectedRequest) {
        setFormData(prev => ({
          ...prev,
          requestId: selectedRequest.id.toString(),
          machineId: selectedRequest.machineId
        }));
        setIsDialogOpen(true); // Auto-open the dialog
      }
    }
  }, [preSelectedRequestId, requests]);

  // Create action mutation
  const createActionMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', API_ENDPOINTS.MAINTENANCE_ACTIONS, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Maintenance action recorded successfully",
      });
      setIsDialogOpen(false);
      resetForm();
      refetchActions();
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MAINTENANCE_ACTIONS] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MAINTENANCE_REQUESTS] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record maintenance action",
        variant: "destructive",
      });
    },
  });

  // Update action mutation
  const updateActionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest('PUT', `${API_ENDPOINTS.MAINTENANCE_ACTIONS}/${id}`, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Maintenance action updated successfully",
      });
      setIsEditDialogOpen(false);
      refetchActions();
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MAINTENANCE_ACTIONS] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update maintenance action",
        variant: "destructive",
      });
    },
  });

  // Delete action mutation
  const deleteActionMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `${API_ENDPOINTS.MAINTENANCE_ACTIONS}/${id}`),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Maintenance action deleted successfully",
      });
      refetchActions();
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MAINTENANCE_ACTIONS] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete maintenance action",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      requestId: "",
      machineId: "",
      actionsTaken: [],
      description: "",
      partsCost: "",
      laborHours: "",
      notes: "",
      readyToWork: false,
    });
    // Clear URL parameters when form is reset
    if (preSelectedRequestId) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.requestId || !formData.machineId || formData.actionsTaken.length === 0 || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const actionData = {
      ...formData,
      requestId: parseInt(formData.requestId),
      partsCost: formData.partsCost ? parseFloat(formData.partsCost) : 0,
      laborHours: formData.laborHours ? parseFloat(formData.laborHours) : 0,
    };

    createActionMutation.mutate(actionData);
  };

  const handleActionTypeToggle = (actionType: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        actionsTaken: [...formData.actionsTaken, actionType]
      });
    } else {
      setFormData({
        ...formData,
        actionsTaken: formData.actionsTaken.filter(type => type !== actionType)
      });
    }
  };

  const handleRequestChange = (requestId: string) => {
    const request = requests.find((r: MaintenanceRequest) => r.id.toString() === requestId);
    if (request) {
      setFormData({
        ...formData,
        requestId,
        machineId: request.machineId,
      });
    }
  };

  // Handler functions for new CRUD operations
  const handleViewAction = (action: MaintenanceAction) => {
    setSelectedAction(action);
    setIsViewDialogOpen(true);
  };

  const handleEditAction = (action: MaintenanceAction) => {
    setSelectedAction(action);
    setEditFormData({
      requestId: action.requestId.toString(),
      machineId: action.machineId,
      actionType: action.actionType,
      description: action.description,
      cost: action.cost.toString(),
      hours: action.hours.toString(),
      status: action.status,
      partReplaced: action.partReplaced || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteAction = (actionId: number) => {
    if (window.confirm('Are you sure you want to delete this maintenance action?')) {
      deleteActionMutation.mutate(actionId);
    }
  };

  const handlePrint = (action: MaintenanceAction) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Maintenance Action Report</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #065f46;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 20px;
            }
            .logo {
              width: 80px;
              height: 80px;
            }
            .company-info {
              text-align: center;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #065f46;
              margin: 0;
            }
            .company-name-ar {
              font-size: 20px;
              font-weight: bold;
              color: #059669;
              margin: 5px 0 0 0;
            }
            .content {
              max-width: 800px;
              margin: 0 auto;
            }
            .action-header {
              background: linear-gradient(135deg, #065f46, #059669);
              color: white;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              text-align: center;
            }
            .action-title {
              font-size: 28px;
              font-weight: bold;
              margin: 0;
            }
            .action-subtitle {
              font-size: 16px;
              margin: 10px 0 0 0;
              opacity: 0.9;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .detail-item {
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #059669;
            }
            .detail-label {
              font-weight: bold;
              color: #065f46;
              margin-bottom: 5px;
            }
            .detail-value {
              color: #374151;
            }
            .description-section {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border-left: 4px solid #059669;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #065f46;
              margin-bottom: 15px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/assets/company-logo.png" alt="Company Logo" class="logo" />
            <div class="company-info">
              <h1 class="company-name">Modern Plastic Bag Factory</h1>
              <h2 class="company-name-ar">مصنع أكياس البلاستيك الحديث</h2>
            </div>
          </div>

          <div class="content">
            <div class="action-header">
              <h1 class="action-title">Maintenance Action Report</h1>
              <p class="action-subtitle">Action ID: #${action.id} | Date: ${formatDate(new Date(action.actionDate), 'MMM dd, yyyy')}</p>
            </div>

            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Request ID:</div>
                <div class="detail-value">#${action.requestId}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Machine:</div>
                <div class="detail-value">${getMachineName(action.machineId)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Action Type:</div>
                <div class="detail-value">${action.actionType}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Performed By:</div>
                <div class="detail-value">${getUserName(action.performedBy)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Status:</div>
                <div class="detail-value">${action.status.charAt(0).toUpperCase() + action.status.slice(1)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Hours Spent:</div>
                <div class="detail-value">${action.hours.toFixed(2)} hours</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Cost:</div>
                <div class="detail-value">$${action.cost.toLocaleString()}</div>
              </div>
              ${action.partReplaced ? `
              <div class="detail-item">
                <div class="detail-label">Part Replaced:</div>
                <div class="detail-value">${action.partReplaced}</div>
              </div>
              ` : ''}
            </div>

            <div class="description-section">
              <div class="section-title">Action Description</div>
              <div>${action.description}</div>
            </div>
          </div>

          <div class="footer">
            <p>Generated on ${formatDate(new Date(), 'dd/MM/yyyy HH:mm')} | Modern Plastic Bag Factory</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;

    const updateData = {
      requestId: parseInt(editFormData.requestId),
      machineId: editFormData.machineId,
      actionType: editFormData.actionType,
      description: editFormData.description,
      cost: parseFloat(editFormData.cost),
      hours: parseFloat(editFormData.hours),
      status: editFormData.status,
      partReplaced: editFormData.partReplaced || undefined,
    };

    updateActionMutation.mutate({ id: selectedAction.id, data: updateData });
  };

  // Filter actions
  const filteredActions = actions.filter((action: MaintenanceAction) => {
    const matchesSearch = searchQuery === "" || 
      action.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.actionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.machineId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || action.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getRequestInfo = (requestId: number) => {
    const request = requests.find((r: MaintenanceRequest) => r.id === requestId);
    return request ? `${request.requestNumber || '#' + request.id} - ${request.damageType}` : `#${requestId}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">{status}</Badge>;
      case "in_progress":
        return <Badge variant="secondary">{status}</Badge>;
      case "pending":
        return <Badge variant="outline">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get all maintenance requests for dropdown (sorted by most recent first)
  const availableRequests = requests.filter((r: MaintenanceRequest) => 
    r.status !== 'completed' && r.status !== 'cancelled'
  ).sort((a: any, b: any) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

  return (
    <div className={`container mx-auto space-y-6 ${isMobile ? "p-3" : "p-4"}`}>
      <PageHeader
        title={t("maintenance.actions.title")}
        description={t("maintenance.actions.description")}
      />

      {/* Action Bar */}
      <div className={`flex gap-4 items-start justify-between ${isMobile ? "flex-col" : "flex-col sm:flex-row sm:items-center"}`}>
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("maintenance.actions.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("maintenance.actions.filter_status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("maintenance.actions.filter_all")}</SelectItem>
              <SelectItem value="pending">{t("maintenance.actions.filter_pending")}</SelectItem>
              <SelectItem value="in_progress">{t("maintenance.actions.filter_progress")}</SelectItem>
              <SelectItem value="completed">{t("maintenance.actions.filter_completed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("maintenance.actions.record")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("maintenance.actions.create")}</DialogTitle>
              <DialogDescription>
                {t("maintenance.actions.description")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="requestId">{t("maintenance.actions.maintenanceRequest")} *</Label>
                <Select 
                  value={formData.requestId} 
                  onValueChange={handleRequestChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("maintenance.actions.selectMaintenanceRequest")} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRequests.map((request: MaintenanceRequest) => (
                      <SelectItem key={request.id} value={request.id.toString()}>
                        {request.requestNumber || '#' + request.id} - {getMachineName(request.machineId)} ({request.damageType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="machineId">{t("maintenance.actions.machine")} *</Label>
                <Select 
                  value={formData.machineId} 
                  onValueChange={(value) => setFormData({...formData, machineId: value})}
                  disabled={!!formData.requestId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("common.select_machine")} />
                  </SelectTrigger>
                  <SelectContent>
                    {machines.map((machine: Machine) => (
                      <SelectItem key={machine.id} value={machine.id}>
                        {machine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t("maintenance.actions.actionsTaken")} *</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {ACTION_TYPES.map((actionType) => (
                    <div key={actionType} className="flex items-center space-x-2">
                      <Checkbox
                        id={actionType}
                        checked={formData.actionsTaken.includes(actionType)}
                        onCheckedChange={(checked) => handleActionTypeToggle(actionType, checked as boolean)}
                      />
                      <Label htmlFor={actionType} className="cursor-pointer">
                        {actionType === "Repair" ? t("maintenance.actions.repairAction") : 
                         actionType === "Change Parts" ? t("maintenance.actions.changePartsAction") :
                         actionType === "Workshop" ? t("maintenance.actions.workshopAction") : actionType}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="description">{t("maintenance.actions.description")} *</Label>
                <Textarea
                  id="description"
                  placeholder={t("maintenance.actions.description")}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partsCost">{t("maintenance.actions.partsCost")} ($)</Label>
                  <Input
                    id="partsCost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.partsCost}
                    onChange={(e) => setFormData({...formData, partsCost: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="laborHours">{t("maintenance.actions.laborHours")}</Label>
                  <Input
                    id="laborHours"
                    type="number"
                    step="0.5"
                    placeholder="0.0"
                    value={formData.laborHours}
                    onChange={(e) => setFormData({...formData, laborHours: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">{t("maintenance.actions.notes")}</Label>
                <Textarea
                  id="notes"
                  placeholder={t("maintenance.actions.additionalNotes")}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="readyToWork"
                  checked={formData.readyToWork}
                  onCheckedChange={(checked) => setFormData({...formData, readyToWork: !!checked})}
                />
                <Label htmlFor="readyToWork" className="text-sm font-medium">
                  {t("maintenance.actions.readyToWork")}
                </Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={createActionMutation.isPending}>
                  {createActionMutation.isPending ? t("maintenance.actions.recording") : t("maintenance.actions.recordAction")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Actions Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("maintenance.actions.table_title", { count: filteredActions.length })}</CardTitle>
          <CardDescription>
            {t("maintenance.actions.table_description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {actionsLoading ? (
            <div className="text-center py-4">{t("common.loading")}</div>
          ) : filteredActions.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {t("maintenance.actions.no_actions")}
            </div>
          ) : isMobile ? (
            <div className="space-y-3">
              {filteredActions.map((action: MaintenanceAction) => (
                <Card key={action.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">#{action.id}</span>
                      <Badge variant="secondary" className="text-xs">
                        {action.actionType}
                      </Badge>
                    </div>
                    {getStatusBadge(action.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("maintenance.actions.mobile.date")}</span>
                      <span>{formatDate(new Date(action.actionDate), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("maintenance.actions.mobile.machine")}</span>
                      <span className="font-medium">{getMachineName(action.machineId)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("maintenance.actions.request")}:</span>
                      <span>{getRequestInfo(action.requestId)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("maintenance.actions.mobile.performed_by")}</span>
                      <span>{getUserName(action.performedBy)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("maintenance.actions.mobile.hours")}</span>
                      <span>{action.hours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("maintenance.actions.mobile.cost")}</span>
                      <span>${action.cost}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-700" title={action.description}>
                      {action.description.length > 80 ? `${action.description.substring(0, 80)}...` : action.description}
                    </p>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewAction(action)}
                      title={t("maintenance.actions.tooltip.view")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePrint(action)}
                      title={t("maintenance.actions.tooltip.print")}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditAction(action)}
                      title={t("maintenance.actions.tooltip.edit")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteAction(action.id)}
                      title={t("maintenance.actions.tooltip.delete")}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">{t("maintenance.actions.id")}</TableHead>
                    <TableHead className="text-center">{t("maintenance.actions.date")}</TableHead>
                    <TableHead className="text-center">{t("maintenance.actions.request")}</TableHead>
                    <TableHead className="text-center">{t("maintenance.actions.machine")}</TableHead>
                    <TableHead className="text-center">{t("maintenance.actions.actionsTaken")}</TableHead>
                    <TableHead className="text-center">{t("maintenance.actions.actionBy")}</TableHead>
                    <TableHead className="text-center">{t("maintenance.actions.laborHours")}</TableHead>
                    <TableHead className="text-center">{t("maintenance.actions.partsCost")}</TableHead>
                    <TableHead className="text-center">{t("maintenance.actions.status")}</TableHead>
                    <TableHead className="text-center">{t("maintenance.actions.description")}</TableHead>
                    <TableHead className="text-center">{t("maintenance.actions.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActions.map((action: MaintenanceAction) => (
                    <TableRow key={action.id}>
                      <TableCell className="font-medium text-center">#{action.id}</TableCell>
                      <TableCell className="text-center">{formatDate(new Date(action.actionDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-center">{getRequestInfo(action.requestId)}</TableCell>
                      <TableCell className="text-center">{getMachineName(action.machineId)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {action.actionType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{getUserName(action.performedBy)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <FileText className="w-4 h-4 mr-1 text-gray-400" />
                          {action.hours}h
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                          ${action.cost.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(action.status)}</TableCell>
                      <TableCell className="max-w-xs truncate text-center" title={action.description}>
                        {action.description}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewAction(action)}
                            title={t("maintenance.actions.tooltip.view")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrint(action)}
                            title={t("maintenance.actions.tooltip.print")}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAction(action)}
                            title={t("maintenance.actions.tooltip.edit")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAction(action.id)}
                            title={t("maintenance.actions.tooltip.delete")}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Action Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("maintenance.actions.view.title")}</DialogTitle>
            <DialogDescription>
              {t("maintenance.actions.view.dialog_description")}
            </DialogDescription>
          </DialogHeader>
          {selectedAction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.action_id")}</Label>
                  <p className="text-sm font-medium">#{selectedAction.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.date")}</Label>
                  <p className="text-sm">{formatDate(new Date(selectedAction.actionDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.machine")}</Label>
                  <p className="text-sm">{getMachineName(selectedAction.machineId)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.request")}</Label>
                  <p className="text-sm">{getRequestInfo(selectedAction.requestId)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.action_type")}</Label>
                  <Badge variant="secondary" className="text-xs">
                    {selectedAction.actionType}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.status")}</Label>
                  {getStatusBadge(selectedAction.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.performed_by")}</Label>
                  <p className="text-sm">{getUserName(selectedAction.performedBy)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.labor_hours")}</Label>
                  <p className="text-sm">{selectedAction.hours}h</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.parts_cost")}</Label>
                  <p className="text-sm">${selectedAction.cost.toFixed(2)}</p>
                </div>
                {selectedAction.partReplaced && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.part_replaced")}</Label>
                    <p className="text-sm">{selectedAction.partReplaced}</p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.description")}</Label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{selectedAction.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Action Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Maintenance Action</DialogTitle>
            <DialogDescription>
              Update the maintenance action details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-requestId">Maintenance Request *</Label>
                <Select value={editFormData.requestId} onValueChange={(value) => setEditFormData({...editFormData, requestId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Request" />
                  </SelectTrigger>
                  <SelectContent>
                    {requests.map((request: MaintenanceRequest) => (
                      <SelectItem key={request.id} value={request.id.toString()}>
                        {request.requestNumber || `#${request.id}`} - {request.damageType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-machineId">Machine *</Label>
                <Select value={editFormData.machineId} onValueChange={(value) => setEditFormData({...editFormData, machineId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Machine" />
                  </SelectTrigger>
                  <SelectContent>
                    {machines.map((machine: Machine) => (
                      <SelectItem key={machine.id} value={machine.id}>
                        {machine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-actionType">Action Type *</Label>
                <Select value={editFormData.actionType} onValueChange={(value) => setEditFormData({...editFormData, actionType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Action Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="replacement">Replacement</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="calibration">Calibration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-status">Status *</Label>
                <Select value={editFormData.status} onValueChange={(value) => setEditFormData({...editFormData, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe the action taken"
                value={editFormData.description}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-cost">Parts Cost ($)</Label>
                <Input
                  id="edit-cost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={editFormData.cost}
                  onChange={(e) => setEditFormData({...editFormData, cost: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-hours">Labor Hours</Label>
                <Input
                  id="edit-hours"
                  type="number"
                  step="0.5"
                  placeholder="0.0"
                  value={editFormData.hours}
                  onChange={(e) => setEditFormData({...editFormData, hours: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-partReplaced">Part Replaced</Label>
              <Input
                id="edit-partReplaced"
                placeholder="Part name or description"
                value={editFormData.partReplaced}
                onChange={(e) => setEditFormData({...editFormData, partReplaced: e.target.value})}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateActionMutation.isPending}>
                {updateActionMutation.isPending ? "Updating..." : "Update Action"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}