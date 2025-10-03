"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Users, Map } from "lucide-react";
import useFetch from "@/lib/hooks/use-fetch";
import { AttendanceRecord, Staff } from "@/types";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import mutateData from "@/lib/firebase/mutate-data";
import {
  AttendanceStats,
  AttendanceFilters,
  AttendanceTable,
  AttendanceMap,
  EditAttendanceDialog,
} from "./_components";

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
  const [activeTab, setActiveTab] = useState("table");

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

    const { start } = getDateRangeFilter();
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

  // Function to generate map markers from attendance data
  interface MapMarker {
    id: string;
    position: [number, number];
    popup: string;
    type: string;
  }

  const generateMapMarkers = (): MapMarker[] => {
    if (!staffMembers || !attendanceData) return [];

    const markers: MapMarker[] = [];
    const { start } = getDateRangeFilter();
    const targetDate = format(
      dateRange === "custom" ? selectedDate : start,
      "yyyy-MM-dd"
    );

    staffMembers.forEach((staff) => {
      const attendance = getAttendanceForDate(staff.uid, targetDate);

      // Add punch-in location marker
      if (attendance?.punchInLocation) {
        markers.push({
          id: `${staff.uid}-${targetDate}-in`,
          position: [
            attendance.punchInLocation.lat,
            attendance.punchInLocation.lng,
          ],
          popup: `${staff.name} - Punch In\n${format(
            new Date(attendance.punchIn!),
            "h:mm a"
          )}`,
          type: "punch-in",
        });
      }

      // Add punch-out location marker
      if (attendance?.punchOutLocation) {
        markers.push({
          id: `${staff.uid}-${targetDate}-out`,
          position: [
            attendance.punchOutLocation.lat,
            attendance.punchOutLocation.lng,
          ],
          popup: `${staff.name} - Punch Out\n${format(
            new Date(attendance.punchOut!),
            "h:mm a"
          )}`,
          type: "punch-out",
        });
      }
    });

    return markers;
  };

  const stats = getAttendanceStats();
  const filteredData = getFilteredAttendance();
  const mapMarkers = generateMapMarkers();

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
      data: { ...payload },
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
        <AttendanceStats stats={stats} />

        {/* Filters */}
        <AttendanceFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Tabbed Interface for Table and Map Views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Attendance Table
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Staff Map View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            <AttendanceTable filteredData={filteredData} onEdit={openEdit} />
          </TabsContent>

          <TabsContent value="map">
            <AttendanceMap mapMarkers={mapMarkers} />
          </TabsContent>
        </Tabs>

        {/* Edit Attendance Dialog */}
        <EditAttendanceDialog
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editForm={editForm}
          setEditForm={setEditForm}
          onSave={saveEdit}
        />
      </div>
    </div>
  );
}
