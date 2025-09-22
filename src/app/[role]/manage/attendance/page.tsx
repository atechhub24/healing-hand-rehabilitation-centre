"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  Calendar as CalendarIcon,
  Clock,
  Download,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  Eye,
  Edit,
} from "lucide-react";
import useFetch from "@/lib/hooks/use-fetch";
import { AttendanceRecord, Staff } from "@/types";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import mutateData from "@/lib/firebase/mutate-data";

export default function AttendanceManagementPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("today");
  const [isEditing, setIsEditing] = useState(false);
  const [editTarget, setEditTarget] = useState<{
    staff: Staff;
    date: string;
    attendance?: AttendanceRecord;
  } | null>(null);
  const [editForm, setEditForm] = useState({
    punchIn: "",
    punchOut: "",
    status: "present" as AttendanceRecord["status"],
    location: "",
    notes: "",
  });

  // Fetch staff members
  const [staffMembers] = useFetch<Staff[]>("users", {
    filter: (item: unknown) => {
      const staff = item as Staff;
      return staff.role === "staff";
    },
  });

  // Fetch attendance records
  const [attendanceData] = useFetch<
    Record<string, Record<string, AttendanceRecord>>
  >("attendance", { needRaw: true });

  const getDateRangeFilter = () => {
    const today = new Date();
    switch (dateRange) {
      case "today":
        return { start: today, end: today };
      case "week":
        return { start: subDays(today, 7), end: today };
      case "month":
        return { start: startOfMonth(today), end: endOfMonth(today) };
      default:
        return { start: selectedDate, end: selectedDate };
    }
  };

  const getAttendanceForDate = (staffId: string, date: string) => {
    return attendanceData?.[staffId]?.[date];
  };

  const getFilteredAttendance = () => {
    if (!staffMembers || !attendanceData) return [];

    const { start, end } = getDateRangeFilter();
    const targetDate = format(
      dateRange === "custom" ? selectedDate : start,
      "yyyy-MM-dd"
    );

    return staffMembers
      .filter(
        (staff) =>
          staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((staff) => {
        const attendance = getAttendanceForDate(staff.uid, targetDate);
        return {
          staff,
          attendance,
          date: targetDate,
        };
      })
      .filter((item) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "present")
          return item.attendance?.status === "present";
        if (statusFilter === "absent") return !item.attendance;
        if (statusFilter === "late") return item.attendance?.status === "late";
        return true;
      });
  };

  const getStatusBadge = (attendance: AttendanceRecord | undefined) => {
    if (!attendance) {
      return <Badge variant="destructive">Absent</Badge>;
    }

    switch (attendance.status) {
      case "present":
        return <Badge variant="default">Present</Badge>;
      case "late":
        return <Badge variant="secondary">Late</Badge>;
      case "partial":
        return <Badge variant="outline">Partial</Badge>;
      default:
        return <Badge variant="destructive">Absent</Badge>;
    }
  };

  const getAttendanceStats = () => {
    const filtered = getFilteredAttendance();
    const total = filtered.length;
    const present = filtered.filter(
      (item) => item.attendance?.status === "present"
    ).length;
    const absent = filtered.filter((item) => !item.attendance).length;
    const late = filtered.filter(
      (item) => item.attendance?.status === "late"
    ).length;

    return { total, present, absent, late };
  };

  const stats = getAttendanceStats();
  const filteredData = getFilteredAttendance();

  const openEdit = (
    staff: Staff,
    date: string,
    attendance?: AttendanceRecord
  ) => {
    setEditTarget({ staff, date, attendance });
    setEditForm({
      punchIn: attendance?.punchIn
        ? format(new Date(attendance.punchIn), "yyyy-MM-dd'T'HH:mm")
        : "",
      punchOut: attendance?.punchOut
        ? format(new Date(attendance.punchOut), "yyyy-MM-dd'T'HH:mm")
        : "",
      status: attendance?.status || "present",
      location: attendance?.location || "",
      notes: attendance?.notes || "",
    });
    setIsEditing(true);
  };

  const saveEdit = async () => {
    if (!editTarget) return;
    const { staff, date, attendance } = editTarget;
    const punchInISO = editForm.punchIn
      ? new Date(editForm.punchIn).toISOString()
      : undefined;
    const punchOutISO = editForm.punchOut
      ? new Date(editForm.punchOut).toISOString()
      : undefined;
    let totalHours: number | undefined = undefined;
    if (punchInISO && punchOutISO) {
      totalHours =
        Math.round(
          ((new Date(punchOutISO).getTime() - new Date(punchInISO).getTime()) /
            (1000 * 60 * 60)) *
            100
        ) / 100;
    }

    const payload: AttendanceRecord = {
      id: `${staff.uid}_${date}`,
      staffId: staff.uid,
      staffName: staff.name || "",
      date,
      punchIn: punchInISO,
      punchOut: punchOutISO,
      totalHours,
      status: editForm.status,
      location: editForm.location || undefined,
      notes: editForm.notes || undefined,
      createdAt: attendance?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await mutateData({
      path: `attendance/${staff.uid}/${date}`,
      data: payload,
      action: attendance ? "update" : "create",
    });
    setIsEditing(false);
    setEditTarget(null);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Attendance Management
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage staff attendance
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Staff
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Present
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.present}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Absent
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.absent}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Late
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.late}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search">Search Staff</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="min-w-[150px]">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === "custom" && (
              <div>
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {format(selectedDate, "MMM dd, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="min-w-[120px]">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Attendance Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left">Staff Member</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Punch In</th>
                  <th className="px-6 py-3 text-left">Punch Out</th>
                  <th className="px-6 py-3 text-left">Total Hours</th>
                  <th className="px-6 py-3 text-left">Location</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  filteredData.map(({ staff, attendance }) => (
                    <tr key={staff.uid} className="hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {staff.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {staff.title || "Staff"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(attendance)}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {attendance?.punchIn
                          ? format(new Date(attendance.punchIn), "HH:mm:ss")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {attendance?.punchOut
                          ? format(new Date(attendance.punchOut), "HH:mm:ss")
                          : attendance?.punchIn
                          ? "Still working"
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {attendance?.totalHours
                          ? `${attendance.totalHours}h`
                          : attendance?.punchIn && !attendance?.punchOut
                          ? "In progress"
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {attendance?.location || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() =>
                            openEdit(
                              staff,
                              (attendance?.date as string) ||
                                format(selectedDate, "yyyy-MM-dd"),
                              attendance
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
        {/* Edit Attendance Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Attendance</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="punchIn">Punch In</Label>
                <Input
                  id="punchIn"
                  type="datetime-local"
                  value={editForm.punchIn}
                  onChange={(e) =>
                    setEditForm({ ...editForm, punchIn: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="punchOut">Punch Out</Label>
                <Input
                  id="punchOut"
                  type="datetime-local"
                  value={editForm.punchOut}
                  onChange={(e) =>
                    setEditForm({ ...editForm, punchOut: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(v) =>
                    setEditForm({
                      ...editForm,
                      status: v as AttendanceRecord["status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={saveEdit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
