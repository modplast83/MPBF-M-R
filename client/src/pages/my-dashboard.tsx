import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/ui/page-header';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth-v2';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
// @ts-ignore - Date-fns import compatibility
import { format } from 'date-fns';
// @ts-ignore - Type assertion for react-i18next
import { useTranslation } from 'react-i18next';
import {
  Clock,
  User,
  MapPin,
  Calendar as CalendarIcon,
  AlertTriangle,
  GraduationCap,
  Wrench,
  CheckCircle,
  Activity,
  Zap,
  LogIn,
  LogOut,
  PauseCircle,
  PlayCircle,
  Plus,
  Eye
} from 'lucide-react';

interface AttendanceRecord {
  id: number;
  userId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  breakStartTime?: string;
  breakEndTime?: string;
  workingHours: number;
  overtimeHours: number;
  breakDuration: number;
  status: string;
  isAutoCheckedOut: boolean;
}

interface Violation {
  id: number;
  violationNumber: string;
  userId: string;
  violationType: string;
  severity: string;
  title: string;
  status: string;
  incidentDate: string;
  actionTaken: string;
}

interface Training {
  id: number;
  title: string;
  category: string;
  status: string;
  scheduledDate: string;
  duration: number;
  traineeId: string;
}

interface MaintenanceRequest {
  id: number;
  machineId: string;
  damageType: string;
  severity: string;
  status: string;
  createdAt: string;
  reportedBy: string;
}

export default function MyDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const { t } = useTranslation();
  
  // State management
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [timeRange, setTimeRange] = useState("30");
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Maintenance request form
  const [maintenanceForm, setMaintenanceForm] = useState({
    machineId: '',
    damageType: '',
    severity: 'normal',
    description: '',
    priority: 1
  });

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch user's attendance data
  const { data: attendanceData = [] } = useQuery({
    queryKey: ['/api/hr/time-attendance', user?.id],
    queryFn: () => apiRequest('GET', `/api/hr/time-attendance?userId=${user?.id}`),
    enabled: !!user?.id
  });

  // Fetch today's attendance
  const { data: todayAttendance } = useQuery({
    queryKey: ['/api/hr/time-attendance', user?.id, 'today'],
    queryFn: async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const allAttendance = await apiRequest('GET', '/api/hr/time-attendance');
      return allAttendance.find((att: AttendanceRecord) => 
        att.userId === user?.id && format(new Date(att.date), 'yyyy-MM-dd') === today
      );
    },
    enabled: !!user?.id
  });

  // Fetch user's violations
  const { data: violations = [] } = useQuery({
    queryKey: ['/api/hr/violations', user?.id],
    queryFn: async () => {
      const allViolations = await apiRequest('GET', '/api/hr/violations');
      return allViolations.filter((v: Violation) => v.userId === user?.id);
    },
    enabled: !!user?.id
  });

  // Fetch user's trainings
  const { data: trainings = [] } = useQuery({
    queryKey: ['/api/trainings', user?.id],
    queryFn: async () => {
      const allTrainings = await apiRequest('GET', '/api/trainings');
      return allTrainings.filter((t: Training) => t.traineeId === user?.id);
    },
    enabled: !!user?.id
  });

  // Fetch user's maintenance requests
  const { data: maintenanceRequests = [] } = useQuery({
    queryKey: ['/api/maintenance-requests', user?.id],
    queryFn: async () => {
      const allRequests = await apiRequest('GET', '/api/maintenance-requests');
      return allRequests.filter((r: MaintenanceRequest) => r.reportedBy === user?.id);
    },
    enabled: !!user?.id
  });

  // Fetch machines for maintenance requests
  const { data: machines = [] } = useQuery({
    queryKey: ['/api/machines'],
    queryFn: () => apiRequest('GET', '/api/machines')
  });

  // Check-in mutation
  const checkInMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/hr/check-in', {
      userId: user?.id,
      latitude: 0,
      longitude: 0,
      manualEntry: true
    }),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('my_dashboard.checked_in_successfully')
      });
      queryClient.invalidateQueries({ queryKey: ['/api/hr/time-attendance'] });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('my_dashboard.failed_to_check_in'),
        variant: "destructive"
      });
    }
  });

  // Check-out mutation
  const checkOutMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/hr/check-out', {
      userId: user?.id,
      latitude: 0,
      longitude: 0,
      manualEntry: true
    }),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('my_dashboard.checked_out_successfully')
      });
      queryClient.invalidateQueries({ queryKey: ['/api/hr/time-attendance'] });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('my_dashboard.failed_to_check_out'),
        variant: "destructive"
      });
    }
  });

  // Break start mutation
  const breakStartMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/hr/break-start', {
      userId: user?.id
    }),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('my_dashboard.break_started')
      });
      queryClient.invalidateQueries({ queryKey: ['/api/hr/time-attendance'] });
    }
  });

  // Break end mutation
  const breakEndMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/hr/break-end', {
      userId: user?.id
    }),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('my_dashboard.break_ended')
      });
      queryClient.invalidateQueries({ queryKey: ['/api/hr/time-attendance'] });
    }
  });

  // Maintenance request mutation
  const createMaintenanceRequestMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/maintenance-requests', {
      ...data,
      reportedBy: user?.id,
      requestedBy: user?.id
    }),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('my_dashboard.maintenance_request_submitted')
      });
      setShowMaintenanceDialog(false);
      setMaintenanceForm({
        machineId: '',
        damageType: '',
        severity: 'normal',
        description: '',
        priority: 1
      });
      queryClient.invalidateQueries({ queryKey: ['/api/maintenance-requests'] });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('my_dashboard.failed_to_submit_maintenance'),
        variant: "destructive"
      });
    }
  });

  // Calculate user statistics
  const calculateStats = () => {
    const endDate = new Date();
    const daysAgo = parseInt(timeRange);
    const startDate = new Date(endDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    const filteredAttendance = attendanceData.filter((att: AttendanceRecord) => {
      const attDate = new Date(att.date);
      return attDate >= startDate && attDate <= endDate;
    });

    const totalWorkingHours = filteredAttendance.reduce((sum: number, att: AttendanceRecord) => sum + (att.workingHours || 0), 0);
    const totalOvertimeHours = filteredAttendance.reduce((sum: number, att: AttendanceRecord) => sum + (att.overtimeHours || 0), 0);
    const presentDays = filteredAttendance.filter((att: AttendanceRecord) => att.status === 'present').length;
    const absentDays = filteredAttendance.filter((att: AttendanceRecord) => att.status === 'absent').length;

    return {
      totalWorkingHours,
      totalOvertimeHours,
      averageWorkingHours: filteredAttendance.length > 0 ? totalWorkingHours / filteredAttendance.length : 0,
      presentDays,
      absentDays,
      violations: violations.length,
      trainings: trainings.length,
      maintenanceRequests: maintenanceRequests.length
    };
  };

  const stats = calculateStats();

  // Get current work status
  const getCurrentWorkStatus = () => {
    if (!todayAttendance) {
      return { status: 'not_checked_in', message: t('my_dashboard.ready_to_check_in'), color: 'text-gray-500' };
    }

    if (todayAttendance.checkOutTime) {
      return { status: 'checked_out', message: t('my_dashboard.work_day_completed'), color: 'text-green-600' };
    }

    if (todayAttendance.breakStartTime && !todayAttendance.breakEndTime) {
      return { status: 'on_break', message: t('my_dashboard.on_break'), color: 'text-orange-500' };
    }

    if (todayAttendance.checkInTime) {
      return { status: 'working', message: t('my_dashboard.currently_working'), color: 'text-blue-600' };
    }

    return { status: 'unknown', message: t('my_dashboard.status_unknown'), color: 'text-gray-500' };
  };

  const workStatus = getCurrentWorkStatus();

  // Calculate current working time
  const getCurrentWorkingTime = () => {
    if (!todayAttendance?.checkInTime) return '0h 0m';
    
    const startTime = new Date(todayAttendance.checkInTime);
    const endTime = todayAttendance.checkOutTime ? new Date(todayAttendance.checkOutTime) : currentTime;
    
    const diffMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  // Quick actions
  const quickActions = [];

  // Time attendance actions
  if (!todayAttendance?.checkInTime) {
    quickActions.push({
      id: 'check_in',
      title: t('my_dashboard.check_in'),
      description: t('my_dashboard.start_work_day'),
      icon: LogIn,
      action: () => checkInMutation.mutate(),
      color: 'bg-green-500',
      enabled: !checkInMutation.isPending
    });
  }

  if (todayAttendance?.checkInTime && !todayAttendance?.checkOutTime) {
    if (!todayAttendance.breakStartTime || todayAttendance.breakEndTime) {
      quickActions.push({
        id: 'start_break',
        title: t('my_dashboard.start_break'),
        description: t('my_dashboard.take_break'),
        icon: PauseCircle,
        action: () => breakStartMutation.mutate(),
        color: 'bg-orange-500',
        enabled: !breakStartMutation.isPending
      });
    }

    if (todayAttendance.breakStartTime && !todayAttendance.breakEndTime) {
      quickActions.push({
        id: 'end_break',
        title: t('my_dashboard.end_break'),
        description: t('my_dashboard.return_to_work'),
        icon: PlayCircle,
        action: () => breakEndMutation.mutate(),
        color: 'bg-blue-500',
        enabled: !breakEndMutation.isPending
      });
    }

    quickActions.push({
      id: 'check_out',
      title: t('my_dashboard.check_out'),
      description: t('my_dashboard.end_work_day'),
      icon: LogOut,
      action: () => checkOutMutation.mutate(),
      color: 'bg-red-500',
      enabled: !checkOutMutation.isPending
    });
  }

  // Other quick actions
  quickActions.push({
    id: 'maintenance_request',
    title: t('my_dashboard.report_issue'),
    description: t('my_dashboard.submit_maintenance_request'),
    icon: Wrench,
    action: () => setShowMaintenanceDialog(true),
    color: 'bg-yellow-500',
    enabled: true
  });

  quickActions.push({
    id: 'view_schedule',
    title: t('my_dashboard.my_schedule'),
    description: t('my_dashboard.view_work_schedule'),
    icon: CalendarIcon,
    action: () => setLocation('/hr/enhanced-attendance'),
    color: 'bg-purple-500',
    enabled: true
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('my_dashboard.page_header_title', { name: user?.firstName || user?.username })}
        description={t('my_dashboard.page_header_description')}
      />

      {/* Current Status Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">{t('my_dashboard.current_status')}</CardTitle>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">{format(currentTime, 'EEEE, MMMM d, yyyy')}</div>
              <div className="text-lg font-mono">{format(currentTime, 'HH:mm:ss')}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${workStatus.status === 'working' ? 'bg-green-500' : workStatus.status === 'on_break' ? 'bg-orange-500' : 'bg-gray-400'}`} />
              <div>
                <div className={`font-medium ${workStatus.color}`}>{workStatus.message}</div>
                <div className="text-sm text-gray-500">{t('my_dashboard.work_status')}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium">{getCurrentWorkingTime()}</div>
                <div className="text-sm text-gray-500">{t('my_dashboard.todays_time')}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">{user?.sectionId || t('my_dashboard.not_assigned')}</div>
                <div className="text-sm text-gray-500">{t('my_dashboard.section')}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>{t('my_dashboard.quick_actions')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action: any) => (
              <Button
                key={action.id}
                onClick={action.action}
                disabled={!action.enabled}
                className={`h-20 flex flex-col items-center justify-center space-y-2 ${action.color} hover:opacity-90 text-white`}
              >
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-xs">{action.title}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('my_dashboard.working_hours')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkingHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Avg: {stats.averageWorkingHours.toFixed(1)}h/day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('my_dashboard.attendance')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presentDays}</div>
            <p className="text-xs text-muted-foreground">
              Present days (Last {timeRange} days)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('my_dashboard.violations')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.violations}</div>
            <p className="text-xs text-muted-foreground">
              {t('my_dashboard.total_violations')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('my_dashboard.trainings')}</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.trainings}</div>
            <p className="text-xs text-muted-foreground">
              {t('my_dashboard.training_sessions')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="attendance">{t('my_dashboard.tabs.attendance')}</TabsTrigger>
          <TabsTrigger value="violations">{t('my_dashboard.tabs.violations')}</TabsTrigger>
          <TabsTrigger value="trainings">{t('my_dashboard.tabs.trainings')}</TabsTrigger>
          <TabsTrigger value="maintenance">{t('my_dashboard.tabs.maintenance')}</TabsTrigger>
          <TabsTrigger value="overview">{t('my_dashboard.tabs.overview')}</TabsTrigger>
        </TabsList>

        {/* Attendance History */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Your recent attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Working Hours</TableHead>
                        <TableHead>Overtime</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceData
                        .filter((att: AttendanceRecord) => {
                          const attDate = new Date(att.date);
                          const endDate = new Date();
                          const daysAgo = parseInt(timeRange);
                          const startDate = new Date(endDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
                          return attDate >= startDate && attDate <= endDate;
                        })
                        .sort((a: AttendanceRecord, b: AttendanceRecord) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 10)
                        .map((attendance: AttendanceRecord) => (
                          <TableRow key={attendance.id}>
                            <TableCell>
                              <div className="font-medium">
                                {format(new Date(attendance.date), 'MMM dd, yyyy')}
                              </div>
                              <div className="text-sm text-gray-500">
                                {format(new Date(attendance.date), 'EEEE')}
                              </div>
                            </TableCell>
                            <TableCell>
                              {attendance.checkInTime ? format(new Date(attendance.checkInTime), 'HH:mm') : '-'}
                            </TableCell>
                            <TableCell>
                              {attendance.checkOutTime ? format(new Date(attendance.checkOutTime), 'HH:mm') : '-'}
                            </TableCell>
                            <TableCell>{attendance.workingHours.toFixed(1)}h</TableCell>
                            <TableCell>
                              {attendance.overtimeHours > 0 ? (
                                <span className="text-orange-600">{attendance.overtimeHours.toFixed(1)}h</span>
                              ) : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={(
                                attendance.status === 'present' ? 'default' :
                                attendance.status === 'late' ? 'secondary' :
                                attendance.status === 'absent' ? 'destructive' : 'outline'
                              ) as any}>
                                {attendance.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {attendance.checkOutLocation || attendance.checkInLocation || '-'}
                              </div>
                              {attendance.checkOutLocation && attendance.checkInLocation && attendance.checkOutLocation !== attendance.checkInLocation && (
                                <div className="text-xs text-gray-500">
                                  In: {attendance.checkInLocation}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Violations */}
        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Violations</CardTitle>
              <CardDescription>Your violation records and status</CardDescription>
            </CardHeader>
            <CardContent>
              {violations.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Violations</h3>
                  <p className="text-gray-500">Keep up the good work!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {violations.map((violation: Violation) => (
                    <div key={violation.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant={"destructive" as any}>{violation.violationNumber}</Badge>
                          <Badge variant={"outline" as any}>{violation.violationType}</Badge>
                          <Badge variant={(violation.severity === 'critical' ? 'destructive' : violation.severity === 'major' ? 'secondary' : 'outline') as any}>
                            {violation.severity}
                          </Badge>
                        </div>
                        <Badge variant={(violation.status === 'resolved' ? 'default' : 'secondary') as any}>
                          {violation.status}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{violation.title}</h4>
                      <div className="text-sm text-gray-500 mb-2">
                        Incident Date: {format(new Date(violation.incidentDate), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm">
                        <strong>Action Taken:</strong> {violation.actionTaken}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trainings */}
        <TabsContent value="trainings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Trainings</CardTitle>
              <CardDescription>Your training records and certifications</CardDescription>
            </CardHeader>
            <CardContent>
              {trainings.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Trainings</h3>
                  <p className="text-gray-500">Training records will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {trainings.map((training: Training) => (
                    <div key={training.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{training.title}</h4>
                        <Badge variant={(training.status === 'completed' ? 'default' : training.status === 'in_progress' ? 'secondary' : 'outline') as any}>
                          {training.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        Category: {training.category}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Duration: {training.duration}h</span>
                        {training.scheduledDate && (
                          <span>Date: {format(new Date(training.scheduledDate), 'MMM dd, yyyy')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Maintenance Requests</CardTitle>
                  <CardDescription>Maintenance requests you've submitted</CardDescription>
                </div>
                <Button onClick={() => setShowMaintenanceDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {maintenanceRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Maintenance Requests</h3>
                  <p className="text-gray-500">Submit a request when you need maintenance support</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {maintenanceRequests.map((request: MaintenanceRequest) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant={"outline" as any}>#{request.id}</Badge>
                          <span className="font-medium">{request.machineId}</span>
                        </div>
                        <Badge variant={(
                          request.status === 'completed' ? 'default' :
                          request.status === 'in_progress' ? 'secondary' : 'outline'
                        ) as any}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        {request.damageType} - {request.severity} priority
                      </div>
                      <div className="text-sm text-gray-500">
                        Submitted: {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Attendance Rate</span>
                    <span className="text-sm">{((stats.presentDays / (stats.presentDays + stats.absentDays)) * 100 || 0).toFixed(1)}%</span>
                  </div>
                  <Progress value={((stats.presentDays / (stats.presentDays + stats.absentDays)) * 100) || 0} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Training Completion</span>
                    <span className="text-sm">{trainings.filter((t: Training) => t.status === 'completed').length}/{trainings.length}</span>
                  </div>
                  <Progress value={trainings.length > 0 ? (trainings.filter((t: Training) => t.status === 'completed').length / trainings.length) * 100 : 0} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayAttendance?.checkInTime && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>Checked in at {format(new Date(todayAttendance.checkInTime), 'HH:mm')}</span>
                    </div>
                  )}
                  
                  {maintenanceRequests.slice(0, 3).map((request: MaintenanceRequest) => (
                    <div key={request.id} className="flex items-center space-x-2 text-sm">
                      <Wrench className="h-4 w-4 text-yellow-500" />
                      <span>Maintenance request #{request.id}</span>
                    </div>
                  ))}
                  
                  {trainings.slice(0, 2).map((training: Training) => (
                    <div key={training.id} className="flex items-center space-x-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-blue-500" />
                      <span>{training.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Maintenance Request Dialog */}
      <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Maintenance Request</DialogTitle>
            <DialogDescription>
              Report a machine issue or request maintenance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="machine">Machine</Label>
              <Select value={maintenanceForm.machineId} onValueChange={(value) => setMaintenanceForm({ ...maintenanceForm, machineId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select machine" />
                </SelectTrigger>
                <SelectContent>
                  {machines.map((machine: any) => (
                    <SelectItem key={machine.id} value={machine.id}>
                      {machine.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="damageType">Issue Type</Label>
              <Input
                id="damageType"
                value={maintenanceForm.damageType}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, damageType: e.target.value })}
                placeholder="e.g., Mechanical failure, Electrical issue"
              />
            </div>

            <div>
              <Label htmlFor="severity">Severity</Label>
              <Select value={maintenanceForm.severity} onValueChange={(value) => setMaintenanceForm({ ...maintenanceForm, severity: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={maintenanceForm.description}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                placeholder="Describe the issue in detail..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant={"outline" as any} onClick={() => setShowMaintenanceDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => createMaintenanceRequestMutation.mutate(maintenanceForm)}
                disabled={createMaintenanceRequestMutation.isPending || !maintenanceForm.machineId || !maintenanceForm.description}
              >
                {createMaintenanceRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}