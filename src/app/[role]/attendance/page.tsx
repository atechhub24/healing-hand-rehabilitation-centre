"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Timer,
  User,
  LogIn,
  LogOut,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import mutateData from "@/lib/firebase/mutate-data";
import { AttendanceRecord } from "@/types";
import { format } from "date-fns";

export default function AttendancePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");

  // Fetch today's attendance record
  const [todayAttendance, isLoading] = useFetch<AttendanceRecord>(
    `attendance/${user?.uid}/${today}`,
    { needRaw: true }
  );

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePunchIn = async () => {
    if (!user) return;

    setIsProcessing(true);
    try {
      const punchInTime = new Date().toISOString();
      const attendanceData: AttendanceRecord = {
        id: `${user.uid}_${today}`,
        staffId: user.uid,
        staffName: user.name || "",
        date: today,
        punchIn: punchInTime,
        status: "present",
        location: location || "Not specified",
        notes: notes || "",
        createdAt: punchInTime,
        updatedAt: punchInTime,
      };

      await mutateData({
        path: `attendance/${user.uid}/${today}`,
        data: attendanceData,
        action: "create",
      });

      toast({
        title: "Punched In Successfully!",
        description: `Welcome! You've clocked in at ${format(
          new Date(),
          "HH:mm:ss"
        )}`,
      });

      setNotes("");
      setLocation("");
    } catch (error) {
      console.error("Error punching in:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to punch in. Please try again.",
      });
    }
    setIsProcessing(false);
  };

  const handlePunchOut = async () => {
    if (!user || !todayAttendance) return;

    setIsProcessing(true);
    try {
      const punchOutTime = new Date().toISOString();
      const punchInTime = new Date(todayAttendance.punchIn!);
      const totalHours =
        (new Date().getTime() - punchInTime.getTime()) / (1000 * 60 * 60);

      const updatedAttendance = {
        ...todayAttendance,
        punchOut: punchOutTime,
        totalHours: Math.round(totalHours * 100) / 100,
        updatedAt: punchOutTime,
        notes: notes || todayAttendance.notes,
      };

      await mutateData({
        path: `attendance/${user.uid}/${today}`,
        data: updatedAttendance,
        action: "update",
      });

      toast({
        title: "Punched Out Successfully!",
        description: `See you tomorrow! You worked ${
          Math.round(totalHours * 100) / 100
        } hours today.`,
      });

      setNotes("");
    } catch (error) {
      console.error("Error punching out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to punch out. Please try again.",
      });
    }
    setIsProcessing(false);
  };

  const formatTime = (timeString: string) => {
    return format(new Date(timeString), "HH:mm:ss");
  };

  const getWorkingHours = () => {
    if (!todayAttendance?.punchIn) return "00:00:00";

    const startTime = new Date(todayAttendance.punchIn);
    const endTime = todayAttendance.punchOut
      ? new Date(todayAttendance.punchOut)
      : new Date();
    const diffMs = endTime.getTime() - startTime.getTime();

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading attendance data...</p>
      </div>
    );
  }

  const isPunchedIn = todayAttendance?.punchIn && !todayAttendance?.punchOut;
  const isCompleted = todayAttendance?.punchIn && todayAttendance?.punchOut;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Staff Attendance
          </h1>
          <p className="text-muted-foreground">Track your daily work hours</p>
        </div>

        {/* Current Time Card */}
        <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <div className="space-y-2">
            <Clock className="h-12 w-12 mx-auto text-blue-600" />
            <div className="text-4xl font-bold text-foreground">
              {format(currentTime, "HH:mm:ss")}
            </div>
            <div className="text-lg text-muted-foreground">
              {format(currentTime, "EEEE, MMMM do, yyyy")}
            </div>
          </div>
        </Card>

        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Punch In Status */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  todayAttendance?.punchIn
                    ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                    : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                }`}
              >
                <LogIn className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Punch In</p>
                <p className="text-sm text-muted-foreground">
                  {todayAttendance?.punchIn
                    ? formatTime(todayAttendance.punchIn)
                    : "Not clocked in"}
                </p>
              </div>
            </div>
          </Card>

          {/* Punch Out Status */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  todayAttendance?.punchOut
                    ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                    : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                }`}
              >
                <LogOut className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Punch Out</p>
                <p className="text-sm text-muted-foreground">
                  {todayAttendance?.punchOut
                    ? formatTime(todayAttendance.punchOut)
                    : "Not clocked out"}
                </p>
              </div>
            </div>
          </Card>

          {/* Working Hours */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                <Timer className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Working Hours</p>
                <p className="text-sm text-muted-foreground">
                  {getWorkingHours()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Punch In/Out Form */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">
                {isPunchedIn
                  ? "Punch Out"
                  : isCompleted
                  ? "Attendance Completed"
                  : "Punch In"}
              </h3>
            </div>

            {!isCompleted && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location (Optional)</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="e.g., Main Office, Branch 1"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about your work day..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>

                <div className="flex justify-center pt-4">
                  {isPunchedIn ? (
                    <Button
                      onClick={handlePunchOut}
                      disabled={isProcessing}
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white px-8"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      {isProcessing ? "Punching Out..." : "Punch Out"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePunchIn}
                      disabled={isProcessing}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      {isProcessing ? "Punching In..." : "Punch In"}
                    </Button>
                  )}
                </div>
              </>
            )}

            {isCompleted && (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-green-600">
                    Attendance Complete!
                  </h3>
                  <p className="text-muted-foreground">
                    You worked {todayAttendance.totalHours} hours today.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  {formatTime(todayAttendance.punchIn!)} -{" "}
                  {formatTime(todayAttendance.punchOut!)}
                </Badge>
              </div>
            )}
          </div>
        </Card>

        {/* Today's Summary */}
        {todayAttendance && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  variant={
                    todayAttendance.status === "present"
                      ? "default"
                      : "secondary"
                  }
                >
                  {todayAttendance.status}
                </Badge>
              </div>
              {todayAttendance.location && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{todayAttendance.location}</span>
                </div>
              )}
              {todayAttendance.notes && (
                <div className="space-y-2">
                  <span className="text-muted-foreground">Notes:</span>
                  <p className="text-sm bg-muted p-3 rounded-lg">
                    {todayAttendance.notes}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
