import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_ENDPOINTS } from "@/lib/constants";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { User, Section, insertUserSchema } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Eye,
  Award, 
  Clock, 
  Calendar,
  TrendingUp,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Briefcase
} from "lucide-react";

// Enhanced form schema for comprehensive user management
const userFormSchema = insertUserSchema.extend({
  id: z.string().optional(),
  workSchedule: z.object({
    startTime: z.string().default("08:00"),
    endTime: z.string().default("17:00"),
    workingDays: z.array(z.string()).default(["monday", "tuesday", "wednesday", "thursday", "friday"]),
    breakDuration: z.number().default(1)
  }).optional(),
  emergencyContact: z.object({
    name: z.string().default(""),
    phone: z.string().default(""),
    relationship: z.string().default("")
  }).optional(),
  bankDetails: z.object({
    accountNumber: z.string().default(""),
    bankName: z.string().default(""),
    branchName: z.string().default("")
  }).optional(),
  allowances: z.object({
    transport: z.number().default(0),
    housing: z.number().default(0),
    food: z.number().default(0),
    other: z.number().default(0)
  }).optional()
});

type UserFormData = z.infer<typeof userFormSchema>;

export default function UsersPage() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);

  // Fetch users and sections
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: [API_ENDPOINTS.USERS],
  });

  const { data: sections = [] } = useQuery<Section[]>({
    queryKey: [API_ENDPOINTS.SECTIONS],
  });

  // Form setup
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      sectionId: "",
      position: "",
      hireDate: "",
      contractType: "full_time",
      isAdmin: false,
      isActive: true,
      workSchedule: {
        startTime: "08:00",
        endTime: "17:00",
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        breakDuration: 1
      },
      emergencyContact: {
        name: "",
        phone: "",
        relationship: ""
      },
      bankDetails: {
        accountNumber: "",
        bankName: "",
        branchName: ""
      },
      allowances: {
        transport: 0,
        housing: 0,
        food: 0,
        other: 0
      }
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `${API_ENDPOINTS.USERS}/${id}`, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.USERS] });
      toast({
        title: "User Deleted",
        description: "The user has been deleted successfully.",
      });
      setDeletingUser(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete user: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (userData: UserFormData) => {
      const cleanData = { ...userData };
      if (cleanData.id === "") {
        delete cleanData.id;
      }
      
      // Handle "none" section value
      if (cleanData.sectionId === "none") {
        cleanData.sectionId = "";
      }
      
      if (editUser) {
        return apiRequest("PUT", `${API_ENDPOINTS.USERS}/${editUser.id}`, cleanData);
      } else {
        return apiRequest("POST", API_ENDPOINTS.USERS, cleanData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.USERS] });
      toast({
        title: editUser ? "User Updated" : "User Created",
        description: `The user profile has been ${editUser ? "updated" : "created"} successfully.`,
      });
      handleFormClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to ${editUser ? "update" : "create"} user: ${error.message || error}`,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (user: User) => {
    setEditUser(user);
    
    // Reset form with user data
    form.reset({
      id: user.id,
      username: user.username || "",
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      sectionId: user.sectionId || "none",
      position: user.position || "",
      hireDate: user.hireDate ? new Date(user.hireDate).toISOString().split('T')[0] : "",
      contractType: user.contractType || "full_time",
      isAdmin: user.isAdmin || false,
      isActive: user.isActive !== false,
      workSchedule: user.workSchedule || {
        startTime: "08:00",
        endTime: "17:00",
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        breakDuration: 1
      },
      emergencyContact: user.emergencyContact || {
        name: "",
        phone: "",
        relationship: ""
      },
      bankDetails: user.bankDetails || {
        accountNumber: "",
        bankName: "",
        branchName: ""
      },
      allowances: user.allowances || {
        transport: 0,
        housing: 0,
        food: 0,
        other: 0
      }
    });
    
    setFormOpen(true);
  };

  const handleDelete = (user: User) => {
    setDeletingUser(user);
  };

  const confirmDelete = () => {
    if (deletingUser) {
      deleteMutation.mutate(deletingUser.id);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditUser(null);
    form.reset();
  };

  const handleFormSubmit = (data: UserFormData) => {
    saveMutation.mutate(data);
  };

  const handleNewUser = () => {
    setEditUser(null);
    form.reset();
    setFormOpen(true);
  };

  // Helper function to get section name
  const getSectionName = (sectionId: string | null) => {
    if (!sectionId) return "None";
    return sections?.find(s => s.id === sectionId)?.name || "Unknown";
  };

  // Function to format admin status for display
  const formatAdminStatus = (isAdmin: boolean) => {
    return isAdmin ? "Administrator" : "User";
  };

  const formatWorkingDays = (days: string[]) => {
    if (!days || days.length === 0) return "Not set";
    return days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(", ");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-2xl font-bold">User Management</CardTitle>
                <p className="text-gray-600 mt-1">Manage user accounts and employee profiles</p>
              </div>
            </div>
            <Button onClick={handleNewUser} className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>Add New User</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>
                      {`${user.firstName || ''} ${user.lastName || ''}`.trim() || '-'}
                    </TableCell>
                    <TableCell>{user.email || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getSectionName(user.sectionId)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.position || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={user.isAdmin ? "default" : "secondary"}>
                        {formatAdminStatus(user.isAdmin)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive !== false ? "default" : "destructive"}>
                        {user.isActive !== false ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user)}
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
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editUser ? "Edit User Profile" : "Create New User Profile"}
            </DialogTitle>
            <DialogDescription>
              {editUser ? "Update user information and employee details" : "Add a new user with comprehensive profile information"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="work">Work Details</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="emergency">Emergency</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter username" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="Enter email" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter first name" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter last name" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter phone number" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="isAdmin"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Administrator Access</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Account Active</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Work Details Tab */}
                <TabsContent value="work" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sectionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select section" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">No Section</SelectItem>
                              {sections.map((section) => (
                                <SelectItem key={section.id} value={section.id}>
                                  {section.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter position/job title" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hireDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hire Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contractType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contract Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="full_time">Full Time</SelectItem>
                              <SelectItem value="part_time">Part Time</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="intern">Intern</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Work Schedule Tab */}
                <TabsContent value="schedule" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="workSchedule.startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="workSchedule.endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="workSchedule.breakDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Break Duration (hours)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              step="0.5"
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <Label>Working Days</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                        <FormField
                          key={day}
                          control={form.control}
                          name="workSchedule.workingDays"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value?.includes(day) || false}
                                  onChange={(e) => {
                                    const currentDays = field.value || [];
                                    if (e.target.checked) {
                                      field.onChange([...currentDays, day]);
                                    } else {
                                      field.onChange(currentDays.filter(d => d !== day));
                                    }
                                  }}
                                />
                              </FormControl>
                              <Label className="text-sm capitalize">{day}</Label>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Emergency Contact Tab */}
                <TabsContent value="emergency" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="emergencyContact.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter contact name" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergencyContact.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Phone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter contact phone" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergencyContact.relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Spouse, Parent, Sibling" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Financial Tab */}
                <TabsContent value="financial" className="space-y-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Bank Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="bankDetails.accountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Number</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter account number" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bankDetails.bankName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bank Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter bank name" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bankDetails.branchName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Branch Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter branch name" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Allowances</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="allowances.transport"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transport Allowance</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="allowances.housing"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Housing Allowance</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="allowances.food"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Food Allowance</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="allowances.other"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Other Allowance</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleFormClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Saving..." : (editUser ? "Update User" : "Create User")}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Profile Details</DialogTitle>
            <DialogDescription>
              Complete profile information for {viewUser?.firstName} {viewUser?.lastName}
            </DialogDescription>
          </DialogHeader>

          {viewUser && (
            <div className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="work">Work Details</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="emergency">Emergency</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Username</Label>
                      <p className="font-medium">{viewUser.username}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="font-medium">{viewUser.email || "Not provided"}</p>
                    </div>
                    <div>
                      <Label>Full Name</Label>
                      <p className="font-medium">
                        {`${viewUser.firstName || ''} ${viewUser.lastName || ''}`.trim() || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="font-medium">{viewUser.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Badge variant={viewUser.isAdmin ? "default" : "secondary"}>
                        {formatAdminStatus(viewUser.isAdmin)}
                      </Badge>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge variant={viewUser.isActive !== false ? "default" : "destructive"}>
                        {viewUser.isActive !== false ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="work" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Section</Label>
                      <p className="font-medium">{getSectionName(viewUser.sectionId)}</p>
                    </div>
                    <div>
                      <Label>Position</Label>
                      <p className="font-medium">{viewUser.position || "Not specified"}</p>
                    </div>
                    <div>
                      <Label>Hire Date</Label>
                      <p className="font-medium">
                        {viewUser.hireDate ? new Date(viewUser.hireDate).toLocaleDateString() : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <Label>Contract Type</Label>
                      <p className="font-medium capitalize">{viewUser.contractType?.replace('_', ' ') || "Not specified"}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  {viewUser.workSchedule ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Work Hours</Label>
                        <p className="font-medium">
                          {viewUser.workSchedule.startTime} - {viewUser.workSchedule.endTime}
                        </p>
                      </div>
                      <div>
                        <Label>Break Duration</Label>
                        <p className="font-medium">{viewUser.workSchedule.breakDuration} hours</p>
                      </div>
                      <div className="col-span-2">
                        <Label>Working Days</Label>
                        <p className="font-medium">{formatWorkingDays(viewUser.workSchedule.workingDays)}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Work schedule not configured</p>
                  )}
                </TabsContent>

                <TabsContent value="emergency" className="space-y-4">
                  {viewUser.emergencyContact ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Contact Name</Label>
                        <p className="font-medium">{viewUser.emergencyContact.name || "Not provided"}</p>
                      </div>
                      <div>
                        <Label>Contact Phone</Label>
                        <p className="font-medium">{viewUser.emergencyContact.phone || "Not provided"}</p>
                      </div>
                      <div>
                        <Label>Relationship</Label>
                        <p className="font-medium">{viewUser.emergencyContact.relationship || "Not specified"}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Emergency contact information not provided</p>
                  )}
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Bank Details</h3>
                      {viewUser.bankDetails ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Account Number</Label>
                            <p className="font-medium">{viewUser.bankDetails.accountNumber || "Not provided"}</p>
                          </div>
                          <div>
                            <Label>Bank Name</Label>
                            <p className="font-medium">{viewUser.bankDetails.bankName || "Not provided"}</p>
                          </div>
                          <div>
                            <Label>Branch Name</Label>
                            <p className="font-medium">{viewUser.bankDetails.branchName || "Not provided"}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">Bank details not provided</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Allowances</h3>
                      {viewUser.allowances ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Transport</Label>
                            <p className="font-medium">${viewUser.allowances.transport || 0}</p>
                          </div>
                          <div>
                            <Label>Housing</Label>
                            <p className="font-medium">${viewUser.allowances.housing || 0}</p>
                          </div>
                          <div>
                            <Label>Food</Label>
                            <p className="font-medium">${viewUser.allowances.food || 0}</p>
                          </div>
                          <div>
                            <Label>Other</Label>
                            <p className="font-medium">${viewUser.allowances.other || 0}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">Allowances not configured</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user "{deletingUser?.username}" and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}