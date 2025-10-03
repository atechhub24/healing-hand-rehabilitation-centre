"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { database } from "@/lib/firebase";
import mutateData from "@/lib/firebase/mutate-data";
import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import { AttendanceRecord } from "@/types";
import { format } from "date-fns";
import { get, ref } from "firebase/database";
import {
  Calendar,
  CheckCircle,
  Clock,
  LogIn,
  LogOut,
  Map,
  MapPin,
  Navigation,
  Timer,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

// Leaflet imports for map functionality
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function AttendancePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("my-attendance");

  const today = format(new Date(), "yyyy-MM-dd");

  // Fetch today's attendance record for current user
  const [todayAttendance, isLoading] = useFetch<AttendanceRecord>(
    `attendance/${user?.uid}/${today}`,
    { needRaw: true }
  );

  // State for all staff attendance records (admin only)
  const [allStaffAttendance, setAllStaffAttendance] = useState<Record<
    string,
    AttendanceRecord
  > | null>(null);
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  // Fetch all staff attendance records (admin only)
  useEffect(() => {
    if (user?.role === "admin") {
      setIsLoadingAll(true);
      const fetchAllStaffAttendance = async () => {
        try {
          const dbRef = ref(database, "attendance");
          const snapshot = await get(dbRef);
          if (snapshot.exists()) {
            setAllStaffAttendance(snapshot.val());
          } else {
            setAllStaffAttendance(null);
          }
        } catch (error) {
          console.error("Error fetching all staff attendance:", error);
          setAllStaffAttendance(null);
        } finally {
          setIsLoadingAll(false);
        }
      };

      fetchAllStaffAttendance();
    } else {
      setAllStaffAttendance(null);
      setIsLoadingAll(false);
    }
  }, [user?.role]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Function to get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation services.",
      });
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsGettingLocation(false);
        toast({
          title: "Location Retrieved",
          description: "Your location has been successfully captured.",
        });
      },
      (error) => {
        setIsGettingLocation(false);
        setLocationError(`Unable to retrieve your location: ${error.message}`);
        toast({
          variant: "destructive",
          title: "Location Error",
          description: `Unable to retrieve your location: ${error.message}`,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const handlePunchIn = async () => {
    if (!user) return;

    // Get location if not already obtained
    if (!location && !isGettingLocation) {
      getCurrentLocation();
      // Wait a bit for location to be obtained
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!location) {
        toast({
          variant: "destructive",
          title: "Location Required",
          description: "Please allow location access to punch in.",
        });
        return;
      }
    }

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
        location: location
          ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
          : "Location not available",
        punchInLocation: location || undefined,
        notes: notes || "",
        createdAt: punchInTime,
        updatedAt: punchInTime,
      };

      await mutateData({
        path: `attendance/${user.uid}/${today}`,
        data: { ...attendanceData },
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

    // Get location if not already obtained
    if (!location && !isGettingLocation) {
      getCurrentLocation();
      // Wait a bit for location to be obtained
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!location) {
        toast({
          variant: "destructive",
          title: "Location Required",
          description: "Please allow location access to punch out.",
        });
        return;
      }
    }

    setIsProcessing(true);
    try {
      const punchOutTime = new Date().toISOString();
      const punchInTime = new Date(todayAttendance.punchIn!);
      const totalHours =
        (new Date().getTime() - punchInTime.getTime()) / (1000 * 60 * 60);

      // Format the location for punch out
      const punchOutLocation = location
        ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
        : "Location not available";

      const updatedAttendance = {
        ...todayAttendance,
        punchOut: punchOutTime,
        totalHours: Math.round(totalHours * 100) / 100,
        updatedAt: punchOutTime,
        notes: notes || todayAttendance.notes,
        // Store punch out location coordinates
        punchOutLocation: location || undefined,
        // Keep the location field for backward compatibility
        location: todayAttendance.location
          ? `${todayAttendance.location} | Punch Out: ${punchOutLocation}`
          : `Punch Out: ${punchOutLocation}`,
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

  // For admin users, show tabs
  const isAdmin = user?.role === "admin";

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {isAdmin ? "Staff Attendance Dashboard" : "Staff Attendance"}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Track and manage staff attendance"
              : "Track your daily work hours"}
          </p>
        </div>

        {isAdmin && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="my-attendance"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                My Attendance
              </TabsTrigger>
              <TabsTrigger
                value="all-staff"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                All Staff
              </TabsTrigger>
            </TabsList>
            <TabsContent value="my-attendance" className="mt-6">
              {renderAttendanceView()}
            </TabsContent>
            <TabsContent value="all-staff" className="mt-6">
              {renderAllStaffView()}
            </TabsContent>
          </Tabs>
        )}

        {!isAdmin && renderAttendanceView()}
      </div>
    </div>
  );

  function renderAttendanceView() {
    return (
      <>
        {/* Current Time Card */}
        <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <div className="space-y-2">
            <Clock className="h-12 w-12 mx-auto text-green-600" />
            <div className="text-4xl font-bold text-foreground">
              {format(currentTime, "hh:mm:ss a")}
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
              <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
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
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex gap-2">
                      <Button
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation || isProcessing}
                        variant="outline"
                        className="flex-1"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        {isGettingLocation
                          ? "Getting Location..."
                          : "Get My Location"}
                      </Button>
                    </div>
                    {location && (
                      <div className="text-sm text-muted-foreground mt-2">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Location captured: {location.lat.toFixed(6)},{" "}
                        {location.lng.toFixed(6)}
                      </div>
                    )}
                    {locationError && (
                      <div className="text-sm text-red-500 mt-2">
                        {locationError}
                      </div>
                    )}
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
                  {todayAttendance.punchIn
                    ? formatTime(todayAttendance.punchIn)
                    : ""}{" "}
                  -{" "}
                  {todayAttendance.punchOut
                    ? formatTime(todayAttendance.punchOut)
                    : ""}
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
              Today&apos;s Summary
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
      </>
    );
  }

  function renderAllStaffView() {
    // Define type for map markers
    interface MapMarker {
      id: string;
      position: [number, number];
      popup: string;
      type: string;
    }

    // Function to generate map markers from attendance data
    const generateMapMarkers = (): MapMarker[] => {
      if (!allStaffAttendance) return [];

      const markers: MapMarker[] = [];
      Object.entries(allStaffAttendance).forEach(([staffId, records]) => {
        Object.entries(records).forEach(([date, record]) => {
          // Add punch-in location marker
          if (record.punchInLocation) {
            markers.push({
              id: `${staffId}-${date}-in`,
              position: [
                record.punchInLocation.lat,
                record.punchInLocation.lng,
              ],
              popup: `${record.staffName} - Punch In\n${format(
                new Date(record.punchIn!),
                "h:mm a"
              )}`,
              type: "punch-in",
            });
          }

          // Add punch-out location marker
          if (record.punchOutLocation) {
            markers.push({
              id: `${staffId}-${date}-out`,
              position: [
                record.punchOutLocation.lat,
                record.punchOutLocation.lng,
              ],
              popup: `${record.staffName} - Punch Out\n${format(
                new Date(record.punchOut!),
                "h:mm a"
              )}`,
              type: "punch-out",
            });
          }
        });
      });

      return markers;
    };

    const mapMarkers = generateMapMarkers();

    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Map className="h-5 w-5" />
              Staff Attendance Map
            </h3>
            <Button variant="outline" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              View on Map
            </Button>
          </div>

          {mapMarkers.length > 0 ? (
            <div className="text-center">
              <div className="bg-muted rounded-lg overflow-hidden mb-4 h-[400px]">
                <MapContainer
                  center={[20, 0] as [number, number]}
                  zoom={2}
                  style={{ height: "100%", width: "100%" }}
                  className="h-full w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {mapMarkers.map((marker) => (
                    <Marker key={marker.id} position={marker.position}>
                      <Popup>{marker.popup}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <p className="text-sm text-muted-foreground">
                Map showing staff punch-in and punch-out locations
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Map className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium mb-2">
                No Location Data Available
              </h4>
              <p className="text-muted-foreground mb-4">
                No staff location data found for today
              </p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            {`Today's Attendance Records`}
          </h3>

          {isLoadingAll ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Loading staff attendance...
              </p>
            </div>
          ) : allStaffAttendance &&
            Object.keys(allStaffAttendance).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(allStaffAttendance).map(([staffId, records]) =>
                Object.entries(records).map(([date, record]) => (
                  <Card key={`${staffId}-${date}`} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{record.staffName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(date), "MMMM d, yyyy")}
                        </p>
                      </div>
                      <Badge
                        variant={
                          record.status === "present"
                            ? "default"
                            : record.status === "late"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Punch In
                        </p>
                        {record.punchIn ? (
                          <p className="font-medium">
                            {formatTime(record.punchIn)}
                            {record.punchInLocation && (
                              <span className="block text-xs text-muted-foreground">
                                {record.punchInLocation.lat.toFixed(6)},{" "}
                                {record.punchInLocation.lng.toFixed(6)}
                              </span>
                            )}
                          </p>
                        ) : (
                          <p className="text-muted-foreground">Not recorded</p>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Punch Out
                        </p>
                        {record.punchOut ? (
                          <p className="font-medium">
                            {formatTime(record.punchOut)}
                            {record.punchOutLocation && (
                              <span className="block text-xs text-muted-foreground">
                                {record.punchOutLocation.lat.toFixed(6)},{" "}
                                {record.punchOutLocation.lng.toFixed(6)}
                              </span>
                            )}
                          </p>
                        ) : (
                          <p className="text-muted-foreground">Not recorded</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No staff attendance records found for today
              </p>
            </div>
          )}
        </Card>
      </div>
    );
  }
}
