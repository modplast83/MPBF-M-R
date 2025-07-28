import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import { format } from "date-fns";
import {
  Clock,
  Users,
  Calendar,
  Search,
  FileText,
} from "lucide-react";

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
  checkInLocation?: string;
  checkOutLocation?: string;
  status: string;
  isAutoCheckedOut: boolean;
  autoCheckOutReason?: string;
  overtimeApproved: boolean;
}

interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  sectionId?: string;
}

export default function EnhancedAttendancePage() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("all");

  // Fetch all users
  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
    queryFn: () => apiRequest("GET", "/api/users"),
  });

  // Fetch all sections
  const { data: sections = [] } = useQuery({
    queryKey: ["/api/sections"],
    queryFn: () => apiRequest("GET", "/api/sections"),
  });

  // Fetch attendance data for selected date
  const { data: attendanceRecords = [], isLoading } = useQuery({
    queryKey: ["/api/hr/time-attendance", selectedDate],
    queryFn: async () => {
      const records = await apiRequest("GET", "/api/hr/time-attendance");
      // Filter records for the selected date
      const selectedDateString = selectedDate;
      return records.filter((record: AttendanceRecord) => {
        const recordDate = new Date(record.date).toISOString().split("T")[0];
        return recordDate === selectedDateString;
      });
    },
  });

  // Create a comprehensive attendance view with all users
  const enhancedAttendanceData = users.map((user: User) => {
    const attendanceRecord = attendanceRecords.find(
      (record: AttendanceRecord) => record.userId === user.id
    );
    
    // Calculate undertime (assuming 8 hours standard working day)
    const standardWorkingHours = 8;
    const actualWorkingHours = attendanceRecord?.workingHours || 0;
    const undertime = Math.max(0, standardWorkingHours - actualWorkingHours);
    
    return {
      user,
      attendance: attendanceRecord,
      undertime,
      status: attendanceRecord?.status || "absent",
    };
  });

  // Filter data based on search and section
  const filteredData = enhancedAttendanceData.filter((item) => {
    const matchesSearch = !searchTerm || 
      (item.user.firstName && item.user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.user.lastName && item.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSection = selectedSection === "all" || item.user.sectionId === selectedSection;
    
    return matchesSearch && matchesSection;
  });

  const formatTime = (timeString?: string) => {
    if (!timeString) return "-";
    try {
      return format(new Date(timeString), "HH:mm");
    } catch {
      return "-";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge variant="default" className="bg-green-500">{t("hr.present")}</Badge>;
      case "absent":
        return <Badge variant="destructive">{t("hr.absent")}</Badge>;
      case "late":
        return <Badge variant="secondary" className="bg-yellow-500">{t("hr.late")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title={t("hr.enhanced_attendance")}
        description={t("hr.enhanced_attendance_description")}
        icon="group"
      />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t("common.filters")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="date-filter">{t("common.date")}</Label>
              <Input
                id="date-filter"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="search">{t("common.search")}</Label>
              <Input
                id="search"
                placeholder={t("hr.search_employees")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="section-filter">{t("common.section")}</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all_sections")}</SelectItem>
                  {sections.map((section: any) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-muted-foreground">
                {t("hr.showing_records", { count: filteredData.length })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t("hr.present_today")}</p>
                <p className="text-2xl font-bold text-green-500">
                  {filteredData.filter(item => item.status === "present").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t("hr.absent_today")}</p>
                <p className="text-2xl font-bold text-red-500">
                  {filteredData.filter(item => item.status === "absent").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t("hr.total_overtime")}</p>
                <p className="text-2xl font-bold text-blue-500">
                  {filteredData.reduce((sum, item) => sum + (item.attendance?.overtimeHours || 0), 0).toFixed(1)}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t("hr.selected_date")}</p>
                <p className="text-lg font-semibold text-orange-500">
                  {format(new Date(selectedDate), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("hr.daily_attendance_report")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">{t("common.sn")}</TableHead>
                    <TableHead>{t("common.day")}</TableHead>
                    <TableHead>{t("hr.employee_name")}</TableHead>
                    <TableHead>{t("hr.check_in")}</TableHead>
                    <TableHead>{t("hr.break_out")}</TableHead>
                    <TableHead>{t("hr.break_back")}</TableHead>
                    <TableHead>{t("hr.check_out")}</TableHead>
                    <TableHead>{t("hr.overtime")}</TableHead>
                    <TableHead>{t("hr.undertime")}</TableHead>
                    <TableHead>{t("hr.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        {t("hr.no_attendance_records")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item, index) => (
                      <TableRow key={item.user.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {format(new Date(selectedDate), "EEEE")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.user.firstName && item.user.lastName 
                            ? `${item.user.firstName} ${item.user.lastName}`
                            : item.user.username}
                        </TableCell>
                        <TableCell>
                          {formatTime(item.attendance?.checkInTime)}
                        </TableCell>
                        <TableCell>
                          {formatTime(item.attendance?.breakStartTime)}
                        </TableCell>
                        <TableCell>
                          {formatTime(item.attendance?.breakEndTime)}
                        </TableCell>
                        <TableCell>
                          {formatTime(item.attendance?.checkOutTime)}
                        </TableCell>
                        <TableCell>
                          <span className="text-blue-600 font-medium">
                            {item.attendance?.overtimeHours ? `${item.attendance.overtimeHours.toFixed(1)}h` : "0h"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-orange-600 font-medium">
                            {item.undertime > 0 ? `${item.undertime.toFixed(1)}h` : "0h"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(item.status)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}