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

// Create Action Form Component
function CreateActionForm({ requests, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    requestId: '',
    machineId: '',
    actionsTaken: [],
    description: '',
    actionBy: '',
    laborHours: '',
    partsCost: '',
    partReplaced: '',
    readyToWork: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.requestId || !formData.description) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="requestId">Maintenance Request</Label>
        <Select value={formData.requestId} onValueChange={(value) => setFormData(prev => ({ ...prev, requestId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select maintenance request" />
          </SelectTrigger>
          <SelectContent>
            {requests.map((request) => (
              <SelectItem key={request.id} value={request.id.toString()}>
                {request.requestNumber} - {request.machineName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="actionsTaken">Actions Taken</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['Repair', 'Change Parts', 'Workshop', 'Cleaning', 'Inspection', 'Adjustment'].map((action) => (
            <div key={action} className="flex items-center space-x-2">
              <Checkbox 
                id={action}
                checked={formData.actionsTaken.includes(action)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData(prev => ({ ...prev, actionsTaken: [...prev.actionsTaken, action] }));
                  } else {
                    setFormData(prev => ({ ...prev, actionsTaken: prev.actionsTaken.filter(a => a !== action) }));
                  }
                }}
              />
              <Label htmlFor={action} className="text-sm">{action}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the maintenance action performed..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="actionBy">Performed By</Label>
          <Input 
            id="actionBy"
            value={formData.actionBy}
            onChange={(e) => setFormData(prev => ({ ...prev, actionBy: e.target.value }))}
            placeholder="Technician name"
          />
        </div>
        <div>
          <Label htmlFor="laborHours">Labor Hours</Label>
          <Input 
            id="laborHours"
            type="number"
            step="0.5"
            value={formData.laborHours}
            onChange={(e) => setFormData(prev => ({ ...prev, laborHours: e.target.value }))}
            placeholder="0.0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="partsCost">Parts Cost</Label>
          <Input 
            id="partsCost"
            type="number"
            step="0.01"
            value={formData.partsCost}
            onChange={(e) => setFormData(prev => ({ ...prev, partsCost: e.target.value }))}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="partReplaced">Part Replaced</Label>
          <Input 
            id="partReplaced"
            value={formData.partReplaced}
            onChange={(e) => setFormData(prev => ({ ...prev, partReplaced: e.target.value }))}
            placeholder="Part name/number"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="readyToWork"
          checked={formData.readyToWork}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, readyToWork: checked }))}
        />
        <Label htmlFor="readyToWork">Ready to Work (Complete maintenance request)</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Recording...' : 'Record Action'}
        </Button>
      </div>
    </form>
  );
}

// Edit Action Form Component
function EditActionForm({ action, requests, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    requestId: action.requestId?.toString() || '',
    machineId: action.machineId || '',
    actionsTaken: action.actionType?.split(', ') || [],
    description: action.description || '',
    actionBy: action.performedBy || '',
    laborHours: action.hours?.toString() || '',
    partsCost: action.cost?.toString() || '',
    partReplaced: action.partReplaced || '',
    readyToWork: action.status === 'completed'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.requestId || !formData.description) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="requestId">Maintenance Request</Label>
        <Select value={formData.requestId} onValueChange={(value) => setFormData(prev => ({ ...prev, requestId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select maintenance request" />
          </SelectTrigger>
          <SelectContent>
            {requests.map((request) => (
              <SelectItem key={request.id} value={request.id.toString()}>
                {request.requestNumber} - {request.machineName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="actionsTaken">Actions Taken</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['Repair', 'Change Parts', 'Workshop', 'Cleaning', 'Inspection', 'Adjustment'].map((action) => (
            <div key={action} className="flex items-center space-x-2">
              <Checkbox 
                id={action}
                checked={formData.actionsTaken.includes(action)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData(prev => ({ ...prev, actionsTaken: [...prev.actionsTaken, action] }));
                  } else {
                    setFormData(prev => ({ ...prev, actionsTaken: prev.actionsTaken.filter(a => a !== action) }));
                  }
                }}
              />
              <Label htmlFor={action} className="text-sm">{action}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the maintenance action performed..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="actionBy">Performed By</Label>
          <Input 
            id="actionBy"
            value={formData.actionBy}
            onChange={(e) => setFormData(prev => ({ ...prev, actionBy: e.target.value }))}
            placeholder="Technician name"
          />
        </div>
        <div>
          <Label htmlFor="laborHours">Labor Hours</Label>
          <Input 
            id="laborHours"
            type="number"
            step="0.5"
            value={formData.laborHours}
            onChange={(e) => setFormData(prev => ({ ...prev, laborHours: e.target.value }))}
            placeholder="0.0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="partsCost">Parts Cost</Label>
          <Input 
            id="partsCost"
            type="number"
            step="0.01"
            value={formData.partsCost}
            onChange={(e) => setFormData(prev => ({ ...prev, partsCost: e.target.value }))}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="partReplaced">Part Replaced</Label>
          <Input 
            id="partReplaced"
            value={formData.partReplaced}
            onChange={(e) => setFormData(prev => ({ ...prev, partReplaced: e.target.value }))}
            placeholder="Part name/number"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="readyToWork"
          checked={formData.readyToWork}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, readyToWork: checked }))}
        />
        <Label htmlFor="readyToWork">Ready to Work (Complete maintenance request)</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Action'}
        </Button>
      </div>
    </form>
  );
}

// View Action Details Component
function ViewActionDetails({ action }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Request Number</Label>
          <p className="text-sm">{action.requestNumber}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Machine</Label>
          <p className="text-sm">{action.machineName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Action Type</Label>
          <p className="text-sm">{action.actionType}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Status</Label>
          <Badge className={action.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
            {action.status}
          </Badge>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-600">Description</Label>
        <p className="text-sm bg-gray-50 p-3 rounded">{action.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Performed By</Label>
          <p className="text-sm">{action.performedBy}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Action Date</Label>
          <p className="text-sm">{formatDate(action.actionDate, 'dd/MM/yyyy HH:mm')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Labor Hours</Label>
          <p className="text-sm">{action.hours || 0} hours</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Total Cost</Label>
          <p className="text-sm font-medium">${(action.totalCost || action.cost || 0).toFixed(2)}</p>
        </div>
      </div>

      {action.partReplaced && (
        <div>
          <Label className="text-sm font-medium text-gray-600">Part Replaced</Label>
          <p className="text-sm">{action.partReplaced}</p>
        </div>
      )}
    </div>
  );
}

export default function MaintenanceActionsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterActionType, setFilterActionType] = useState("all");
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
  const { data: allRequests = [] } = useQuery({
    queryKey: ['/api/maintenance/requests'],
    queryFn: () => apiRequest('GET', '/api/maintenance/requests')
  });

  // Filter requests to show only uncompleted ones for the create form
  const uncompletedRequests = allRequests.filter(request => request.status !== 'completed');
  
  // Debug logging
  console.log('All requests:', allRequests);
  console.log('Uncompleted requests:', uncompletedRequests);

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
    
    const matchesStatus = filterStatus === "all" || action.status === filterStatus;
    const matchesActionType = filterActionType === "all" || action.actionType === filterActionType;
    
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
                <tr><td>Parts Cost</td><td>$${(action.partsCost || action.cost || 0).toFixed(2)}</td></tr>
                <tr><td>Labor Hours</td><td>${action.hours || 0} hours</td></tr>
                <tr><td>Total Cost</td><td>$${(action.totalCost || action.cost || 0).toFixed(2)}</td></tr>
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
              <SelectItem value="all">All Status</SelectItem>
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
              <SelectItem value="all">All Types</SelectItem>
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
                                ${(action.totalCost || action.cost || 0).toFixed(2)}
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

      {/* Create Action Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Maintenance Action</DialogTitle>
            <DialogDescription>
              Record a new maintenance action for a request.
            </DialogDescription>
          </DialogHeader>
          <CreateActionForm 
            requests={uncompletedRequests}
            onSubmit={(data) => createActionMutation.mutate(data)}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={createActionMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Action Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Maintenance Action</DialogTitle>
            <DialogDescription>
              Update maintenance action details.
            </DialogDescription>
          </DialogHeader>
          {selectedAction && (
            <EditActionForm 
              action={selectedAction}
              requests={allRequests}
              onSubmit={(data) => updateActionMutation.mutate({ id: selectedAction.id, data })}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedAction(null);
              }}
              isLoading={updateActionMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Action Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Maintenance Action Details</DialogTitle>
            <DialogDescription>
              Complete information about this maintenance action.
            </DialogDescription>
          </DialogHeader>
          {selectedAction && (
            <ViewActionDetails action={selectedAction} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}