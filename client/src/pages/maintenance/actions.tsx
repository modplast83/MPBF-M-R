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
import { useIsMobile } from "@/hooks/use-mobile";
import { QuickActions } from "@/components/ui/quick-actions";
import { Plus, RefreshCw, Filter, Search, Wrench, FileText, DollarSign, Eye, Printer, Edit, Trash2 } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";

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
      minute: '2-digit' 
    });
  }
  return d.toLocaleDateString();
};

// Simple translation function
const t = (key: string): string => {
  const translations: Record<string, string> = {
    // Maintenance action translations
    'maintenance.title': 'Maintenance Actions',
    'maintenance.actions.title': 'Maintenance Actions',
    'maintenance.actions.description': 'Manage maintenance actions and repairs',
    'maintenance.actions.add': 'Add Action',
    'maintenance.actions.edit': 'Edit Action',
    'maintenance.actions.delete': 'Delete Action',
    'maintenance.actions.view': 'View Action',
    'maintenance.actions.print': 'Print Action',
    
    // Action types
    'maintenance.action_types.repair': 'Repair',
    'maintenance.action_types.change_parts': 'Change Parts',
    'maintenance.action_types.workshop': 'Workshop',
    
    // Damage types
    'maintenance.damage_types.electrical': 'Electrical Problem',
    'maintenance.damage_types.mechanical': 'Mechanical Issue',
    'maintenance.damage_types.hydraulic': 'Hydraulic Problem',
    'maintenance.damage_types.pneumatic': 'Pneumatic Issue',
    'maintenance.damage_types.software': 'Software Problem',
    'maintenance.damage_types.hardware': 'Hardware Issue',
    'maintenance.damage_types.structural': 'Structural Problem',
    'maintenance.damage_types.thermal': 'Thermal Issue',
    'maintenance.damage_types.corrosion': 'Corrosion Problem',
    'maintenance.damage_types.wear': 'Wear Issue',
    'maintenance.damage_types.contamination': 'Contamination Problem',
    'maintenance.damage_types.vibration': 'Vibration Issue',
    'maintenance.damage_types.noise': 'Noise Problem',
    'maintenance.damage_types.leakage': 'Leakage Issue',
    'maintenance.damage_types.blockage': 'Blockage Problem',
    'maintenance.damage_types.overheating': 'Overheating Issue',
    'maintenance.damage_types.overcooling': 'Overcooling Problem',
    'maintenance.damage_types.alignment': 'Alignment Issue',
    'maintenance.damage_types.calibration': 'Calibration Problem',
    'maintenance.damage_types.lubrication': 'Lubrication Issue',
    
    // Common translations
    'common.name': 'Name',
    'common.actions': 'Actions',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.print': 'Print',
    'common.view': 'View',
    'common.add': 'Add',
    'common.required': 'Required'
  };
  
  return translations[key] || key.split('.').pop() || key;
};

const ACTION_TYPES = ["Repair", "Change Parts", "Workshop"];

interface MaintenanceAction {
  id: number;
  actionDate: string;
  requestId: number;
  requestNumber: string;
  machineName: string;
  damageType: string;
  actionType: string;
  description: string;
  partsCost: number;
  laborCost: number;
  totalCost: number;
  performedBy: string;
  completedDate?: string;
  status: string;
  notes?: string;
}

interface MaintenanceRequest {
  id: number;
  requestNumber: string;
  machineName: string;
  damageType: string;
  description: string;
  priority: string;
  status: string;
  requestDate: string;
  requestedBy: string;
}

export default function MaintenanceActionsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterActionType, setFilterActionType] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<MaintenanceAction | null>(null);

  // Fetch maintenance actions
  const { data: actions = [], isLoading: isLoadingActions, refetch: refetchActions } = useQuery({
    queryKey: ['/api/maintenance/actions'],
    queryFn: () => apiRequest('GET', '/api/maintenance/actions')
  });

  // Fetch maintenance requests
  const { data: requests = [] } = useQuery({
    queryKey: ['/api/maintenance/requests'],
    queryFn: () => apiRequest('GET', '/api/maintenance/requests')
  });

  // Create maintenance action mutation
  const createActionMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/maintenance/actions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/maintenance/actions'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Maintenance action created successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create maintenance action",
        variant: "destructive"
      });
    }
  });

  // Update maintenance action mutation
  const updateActionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest('PUT', `/api/maintenance/actions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/maintenance/actions'] });
      setIsEditDialogOpen(false);
      setSelectedAction(null);
      toast({
        title: "Success",
        description: "Maintenance action updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update maintenance action",
        variant: "destructive"
      });
    }
  });

  // Delete maintenance action mutation
  const deleteActionMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/maintenance/actions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/maintenance/actions'] });
      toast({
        title: "Success",
        description: "Maintenance action deleted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete maintenance action",
        variant: "destructive"
      });
    }
  });

  // Filter and search actions
  const filteredActions = actions.filter((action: MaintenanceAction) => {
    const matchesSearch = !searchTerm || 
      action.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.performedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || action.status === filterStatus;
    const matchesActionType = !filterActionType || action.actionType === filterActionType;
    
    return matchesSearch && matchesStatus && matchesActionType;
  });

  // Group actions by request
  const groupedActions = filteredActions.reduce((groups: Record<string, MaintenanceAction[]>, action: MaintenanceAction) => {
    const key = action.requestId.toString();
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(action);
    return groups;
  }, {});

  const handlePrint = (action: MaintenanceAction) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Maintenance Action Report - ${action.requestNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; color: #065f46; }
              .info-box { background: linear-gradient(135deg, #065f46 0%, #059669 100%); color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
              .content { line-height: 1.6; }
              .footer { margin-top: 30px; text-align: center; color: #666; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="/assets/company-logo.png" alt="Company Logo" style="height: 60px; margin-bottom: 10px;">
              <h1>Modern Plastic Bag Factory</h1>
              <h2>مصنع أكياس البلاستيك الحديث</h2>
              <h3>Maintenance Action Report</h3>
            </div>
            
            <div class="info-box">
              <h3>Action Information</h3>
              <p><strong>Request Number:</strong> ${action.requestNumber}</p>
              <p><strong>Machine:</strong> ${action.machineName}</p>
              <p><strong>Action Date:</strong> ${formatDate(action.actionDate)}</p>
            </div>
            
            <div class="content">
              <table>
                <tr><th>Field</th><th>Value</th></tr>
                <tr><td>Action Type</td><td>${action.actionType}</td></tr>
                <tr><td>Damage Type</td><td>${action.damageType}</td></tr>
                <tr><td>Description</td><td>${action.description}</td></tr>
                <tr><td>Performed By</td><td>${action.performedBy}</td></tr>
                <tr><td>Parts Cost</td><td>$${action.partsCost.toFixed(2)}</td></tr>
                <tr><td>Labor Cost</td><td>$${action.laborCost.toFixed(2)}</td></tr>
                <tr><td>Total Cost</td><td>$${action.totalCost.toFixed(2)}</td></tr>
                <tr><td>Status</td><td>${action.status}</td></tr>
                <tr><td>Completed Date</td><td>${action.completedDate ? formatDate(action.completedDate) : 'Not completed'}</td></tr>
                <tr><td>Notes</td><td>${action.notes || 'No notes'}</td></tr>
              </table>
            </div>
            
            <div class="footer">
              <p>Generated on ${formatDate(new Date(), 'dd/MM/yyyy HH:mm')} | Modern Plastic Bag Factory</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (isLoadingActions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading maintenance actions...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title={t('maintenance.actions.title')}
        description={t('maintenance.actions.description')}
      />

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterActionType} onValueChange={setFilterActionType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {ACTION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('maintenance.actions.add')}
        </Button>
      </div>

      {/* Actions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedActions).map(([requestId, requestActions]) => {
              const firstAction = requestActions[0];
              return (
                <div key={requestId} className="border rounded-lg p-4">
                  {/* Request Header */}
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <h3 className="font-semibold text-blue-900">
                      Request #{firstAction.requestNumber} - {firstAction.machineName}
                    </h3>
                    <p className="text-sm text-blue-700">
                      Damage Type: {firstAction.damageType}
                    </p>
                  </div>
                  
                  {/* Actions for this request */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action Date</TableHead>
                          <TableHead>Action Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Performed By</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requestActions.map((action) => (
                          <TableRow key={action.id}>
                            <TableCell>
                              {formatDate(action.actionDate)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{action.actionType}</Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {action.description}
                            </TableCell>
                            <TableCell>{action.performedBy}</TableCell>
                            <TableCell>
                              <span className="font-medium">
                                ${action.totalCost.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  action.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                  action.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }
                              >
                                {action.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAction(action);
                                    setIsViewDialogOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handlePrint(action)}
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAction(action);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    if (confirm('Are you sure you want to delete this action?')) {
                                      deleteActionMutation.mutate(action.id);
                                    }
                                  }}
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
                </div>
              );
            })}
            
            {filteredActions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No maintenance actions found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}