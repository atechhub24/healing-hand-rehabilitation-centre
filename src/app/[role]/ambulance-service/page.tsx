"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Truck, 
  Phone, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Navigation,
  Activity,
  Fuel,
  Wrench,
  FileText,
  CheckCircle,
  XCircle,
  Timer,
  Calculator,
  Receipt
} from "lucide-react";
import { useParams } from "next/navigation";
import { 
  EMERGENCY_TYPES, 
  SEVERITY_LEVELS,
  type AmbulanceVehicle, 
  type EmergencyCall,
  type AmbulanceBooking 
} from "@/types/ambulance";
import AmbulanceBookingForm from "@/components/ambulance/ambulance-booking-form";
import useFetch from "@/lib/hooks/use-fetch";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import mutateData from "@/lib/firebase/mutate-data";

// Emergency call form schema
const emergencyCallSchema = z.object({
  patientName: z.string().min(2, "Patient name is required"),
  patientPhone: z.string().min(10, "Valid phone number is required"),
  emergencyType: z.string().min(1, "Emergency type is required"),
  severity: z.string().min(1, "Severity level is required"),
  location: z.string().min(5, "Location is required"),
  landmarks: z.string().optional(),
  description: z.string().min(10, "Description is required"),
  callerName: z.string().min(2, "Caller name is required"),
  callerPhone: z.string().min(10, "Caller phone is required"),
  callerRelation: z.string().min(1, "Caller relation is required"),
});

type EmergencyCallFormData = z.infer<typeof emergencyCallSchema>;

// Mock data - In real implementation, this would come from your database
const mockVehicles: AmbulanceVehicle[] = [
  {
    id: "amb-001",
    vehicleNumber: "AMB-101",
    model: "Force Traveller Ambulance",
    year: 2023,
    status: "available",
    currentLocation: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: "Main Hospital, Delhi"
    },
    driver: {
      id: "drv-001",
      name: "Rajesh Kumar",
      phone: "+91-9876543210",
      licenseNumber: "DL-1234567890"
    },
    medicalStaff: {
      id: "med-001", 
      name: "Dr. Priya Sharma",
      phone: "+91-9876543211",
      qualification: "Emergency Medical Technician"
    },
    fuelLevel: 85,
    equipmentStatus: [
      { name: "Defibrillator", status: "working", lastChecked: "2024-01-15" },
      { name: "Oxygen Tank", status: "working", lastChecked: "2024-01-15" },
      { name: "Stretcher", status: "working", lastChecked: "2024-01-14" }
    ]
  },
  {
    id: "amb-002",
    vehicleNumber: "AMB-102", 
    model: "Mahindra Bolero Ambulance",
    year: 2022,
    status: "on_duty",
    currentLocation: {
      latitude: 28.7041,
      longitude: 77.1025,
      address: "En route to AIIMS"
    },
    driver: {
      id: "drv-002",
      name: "Suresh Singh",
      phone: "+91-9876543212",
      licenseNumber: "DL-2345678901"
    },
    fuelLevel: 60,
    equipmentStatus: [
      { name: "Defibrillator", status: "working", lastChecked: "2024-01-15" },
      { name: "Oxygen Tank", status: "working", lastChecked: "2024-01-15" }
    ]
  }
];

const mockEmergencyCalls: EmergencyCall[] = [
  {
    id: "em-001",
    patientName: "Amit Verma",
    patientPhone: "+91-9876543213",
    emergencyType: "cardiac_arrest",
    severity: "critical",
    location: {
      address: "Sector 15, Noida, UP",
      landmarks: "Near Metro Station"
    },
    description: "Patient experiencing chest pain and difficulty breathing",
    callerName: "Sunita Verma",
    callerPhone: "+91-9876543214", 
    callerRelation: "Wife",
    status: "dispatched",
    assignedVehicle: "amb-001",
    estimatedArrival: "2024-01-15T14:30:00",
    createdAt: "2024-01-15T14:15:00",
    updatedAt: "2024-01-15T14:20:00"
  },
  {
    id: "em-002",
    patientName: "Ravi Patel",
    patientPhone: "+91-9876543215",
    emergencyType: "accident",
    severity: "high",
    location: {
      address: "Ring Road, Delhi",
      landmarks: "Near Traffic Signal"
    },
    description: "Road accident, patient unconscious",
    callerName: "Police Control Room",
    callerPhone: "100",
    callerRelation: "Authority",
    status: "received",
    createdAt: "2024-01-15T14:25:00",
    updatedAt: "2024-01-15T14:25:00"
  }
];

const mockBookings: AmbulanceBooking[] = [
  {
    id: "book-001",
    bookingType: "scheduled",
    patientName: "Mrs. Kavita Jain",
    patientAge: 65,
    patientPhone: "+91-9876543216",
    medicalCondition: "Dialysis patient",
    pickupLocation: {
      address: "House No. 45, Model Town, Delhi",
      contactPerson: "Vikash Jain",
      contactPhone: "+91-9876543217"
    },
    destination: {
      address: "Apollo Hospital, Delhi",
      facilityName: "Apollo Hospital"
    },
    scheduledTime: "2024-01-16T09:00:00",
    status: "confirmed",
    assignedVehicle: "amb-002",
    estimatedDuration: 45,
    cost: 2500,
    paymentStatus: "paid",
    specialRequirements: ["Wheelchair", "Oxygen Support"],
    createdBy: "staff-001",
    createdAt: "2024-01-14T10:00:00",
    updatedAt: "2024-01-14T10:30:00"
  }
];

export default function AmbulanceServicePage() {
  const { role } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [isSubmittingEmergency, setIsSubmittingEmergency] = useState(false);
  const { toast } = useToast();

  // Emergency call form
  const emergencyForm = useForm<EmergencyCallFormData>({
    resolver: zodResolver(emergencyCallSchema),
    defaultValues: {
      patientName: "",
      patientPhone: "",
      emergencyType: "",
      severity: "",
      location: "",
      landmarks: "",
      description: "",
      callerName: "",
      callerPhone: "",
      callerRelation: "",
    },
  });

  // Fetch real booking data from Firebase
  const [bookingsData, isLoadingBookings, refetchBookings] = useFetch<Record<string, AmbulanceBooking>>(
    "ambulance-bookings",
    { needRaw: true }
  );

  // Convert bookings data to array
  const realBookings = React.useMemo(() => {
    if (!bookingsData) return [];
    return Object.entries(bookingsData)
      .map(([id, booking]) => ({ ...booking, id }))
      .sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime());
  }, [bookingsData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "on_duty": return "bg-blue-100 text-blue-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "out_of_service": return "bg-red-100 text-red-800";
      case "emergency_response": return "bg-red-100 text-red-800";
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      case "received": return "bg-red-100 text-red-800";
      case "dispatched": return "bg-orange-100 text-orange-800";
      case "en_route": return "bg-blue-100 text-blue-800";
      case "arrived": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEmergencyTypeInfo = (type: string) => {
    return EMERGENCY_TYPES.find(t => t.value === type) || EMERGENCY_TYPES[0];
  };

  const getSeverityInfo = (severity: string) => {
    return SEVERITY_LEVELS.find(s => s.value === severity) || SEVERITY_LEVELS[0];
  };

  const handleEmergencyCall = () => {
    // Set active tab to emergency calls and show emergency dialog
    setActiveTab("emergency");
    setShowEmergencyDialog(true);
  };

  const handleEmergencySubmit = async (data: EmergencyCallFormData) => {
    setIsSubmittingEmergency(true);
    try {
      // Create emergency call data
      const emergencyCallData = {
        patientName: data.patientName,
        patientPhone: data.patientPhone,
        emergencyType: data.emergencyType,
        severity: data.severity,
        location: {
          address: data.location,
          landmarks: data.landmarks || "",
        },
        description: data.description,
        callerName: data.callerName,
        callerPhone: data.callerPhone,
        callerRelation: data.callerRelation,
        status: "received",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to database
      const result = await mutateData({
        path: "emergency-calls",
        data: emergencyCallData,
        action: "createWithId",
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to create emergency call");
      }

      toast({
        title: "Emergency Call Registered",
        description: `Emergency call has been registered with ID: ${result.id}. Dispatching nearest ambulance...`,
      });

      // Reset form and close dialog
      emergencyForm.reset();
      setShowEmergencyDialog(false);
      
      // Switch to emergency tab to show the new call
      setActiveTab("emergency");
    } catch (error) {
      console.error("Error creating emergency call:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to register emergency call: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmittingEmergency(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ambulance Service</h1>
          <p className="text-muted-foreground">
            Emergency response and ambulance management system
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowBookingForm(true)}
          >
            <Plus className="h-4 w-4" />
            New Booking
          </Button>
          <Button 
            className="gap-2 bg-red-600 hover:bg-red-700"
            onClick={handleEmergencyCall}
          >
            <Phone className="h-4 w-4" />
            Emergency Call
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockVehicles.filter(v => v.status === "available").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {mockVehicles.length} total vehicles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Emergencies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockEmergencyCalls.filter(c => c.status !== "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending emergency calls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Timer className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 min</div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Calls</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicle Status</TabsTrigger>
          <TabsTrigger value="routes">Route Management</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Emergency Calls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-red-600" />
                  Recent Emergency Calls
                </CardTitle>
                <CardDescription>Latest emergency response calls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEmergencyCalls.slice(0, 3).map((call) => {
                    const emergencyType = getEmergencyTypeInfo(call.emergencyType);
                    const severity = getSeverityInfo(call.severity);
                    return (
                      <div key={call.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{call.patientName}</div>
                          <div className="text-sm text-muted-foreground">{call.location.address}</div>
                          <div className="flex gap-2 mt-1">
                            <Badge className={emergencyType.color}>{emergencyType.label}</Badge>
                            <Badge className={severity.color}>{severity.label}</Badge>
                          </div>
                        </div>
                        <Badge className={getStatusColor(call.status)}>
                          {call.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Vehicle Status Overview
                </CardTitle>
                <CardDescription>Current status of ambulance fleet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{vehicle.vehicleNumber}</div>
                        <div className="text-sm text-muted-foreground">{vehicle.model}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Fuel className="h-3 w-3" />
                          <span className="text-xs">{vehicle.fuelLevel}%</span>
                          {vehicle.driver && (
                            <>
                              <Users className="h-3 w-3 ml-2" />
                              <span className="text-xs">{vehicle.driver.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(vehicle.status)}>
                        {vehicle.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Emergency Call Management
              </CardTitle>
              <CardDescription>Handle incoming emergency calls and dispatch ambulances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search calls..." className="pl-10" />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
              
              <div className="space-y-4">
                {mockEmergencyCalls.map((call) => {
                  const emergencyType = getEmergencyTypeInfo(call.emergencyType);
                  const severity = getSeverityInfo(call.severity);
                  return (
                    <Card key={call.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{call.patientName}</h3>
                              <Badge className={severity.color}>{severity.label}</Badge>
                              <Badge className={emergencyType.color}>{emergencyType.label}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              {call.patientPhone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {call.location.address}
                            </div>
                            <p className="text-sm">{call.description}</p>
                            <div className="text-xs text-muted-foreground">
                              Caller: {call.callerName} ({call.callerRelation}) - {call.callerPhone}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge className={getStatusColor(call.status)}>
                              {call.status.replace('_', ' ')}
                            </Badge>
                            {call.status === "received" && (
                              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                Dispatch
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Ambulance Booking Requests
              </CardTitle>
              <CardDescription>Manage scheduled and regular ambulance bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realBookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No ambulance bookings yet</p>
                    <p className="text-sm">Create your first booking to get started</p>
                  </div>
                ) : (
                  realBookings.map((booking) => (
                    <Card key={booking.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{booking.patientName}</h3>
                              <span className="text-sm text-muted-foreground">Age: {booking.patientAge}</span>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="text-sm">
                              <strong>From:</strong> {booking.pickupLocation.address}
                            </div>
                            <div className="text-sm">
                              <strong>To:</strong> {booking.destination.address}
                            </div>
                            <div className="text-sm">
                              <strong>Scheduled:</strong> {new Date(booking.scheduledTime).toLocaleString()}
                            </div>
                            {booking.medicalCondition && (
                              <div className="text-sm">
                                <strong>Condition:</strong> {booking.medicalCondition}
                              </div>
                            )}
                            {booking.specialRequirements && (
                              <div className="flex gap-1 mt-2">
                                {booking.specialRequirements.map((req, index) => (
                                  <Badge key={index} variant="outline">{req}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right space-y-3">
                            <div className="font-semibold text-lg">₹{booking.cost?.toLocaleString()}</div>
                            
                            {booking.pricingDetails && (
                              <div className="text-xs text-muted-foreground space-y-1 border-l-2 border-blue-200 pl-3">
                                <div className="font-medium text-blue-700 flex items-center gap-1">
                                  <Receipt className="h-3 w-3" />
                                  Price Breakdown
                                </div>
                                <div className="flex justify-between">
                                  <span>Base Cost:</span>
                                  <span>₹{booking.pricingDetails.baseCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Distance ({booking.pricingDetails.estimatedDistance}km):</span>
                                  <span>₹{(booking.pricingDetails.estimatedDistance * booking.pricingDetails.costPerKm).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Rate per km:</span>
                                  <span className="font-medium text-blue-600">₹{booking.pricingDetails.costPerKm}/km</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Duration Cost:</span>
                                  <span>₹{booking.pricingDetails.durationCost.toLocaleString()}</span>
                                </div>
                                {(booking.pricingDetails.emergencySurcharge ?? 0) > 0 && (
                                  <div className="flex justify-between text-red-600">
                                    <span>Emergency Surcharge:</span>
                                    <span>₹{(booking.pricingDetails.emergencySurcharge ?? 0).toLocaleString()}</span>
                                  </div>
                                )}
                                {(booking.pricingDetails.specialRequirementsCost ?? 0) > 0 && (
                                  <div className="flex justify-between">
                                    <span>Special Requirements:</span>
                                    <span>₹{(booking.pricingDetails.specialRequirementsCost ?? 0).toLocaleString()}</span>
                                  </div>
                                )}
                                <div className="border-t pt-1 mt-1 flex justify-between font-semibold">
                                  <span>Total:</span>
                                  <span>₹{booking.pricingDetails.totalCost.toLocaleString()}</span>
                                </div>
                              </div>
                            )}
                            
                            <Badge className={getStatusColor(booking.paymentStatus)}>
                              {booking.paymentStatus.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                Vehicle Status Tracking
              </CardTitle>
              <CardDescription>Monitor ambulance fleet status and maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {mockVehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{vehicle.vehicleNumber}</h3>
                          <Badge className={getStatusColor(vehicle.status)}>
                            {vehicle.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {vehicle.model} ({vehicle.year})
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Fuel className="h-4 w-4" />
                            <span className="text-sm">{vehicle.fuelLevel}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="text-xs">{vehicle.currentLocation?.address}</span>
                          </div>
                        </div>

                        {vehicle.driver && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Driver: {vehicle.driver.name}</div>
                            <div className="text-xs text-muted-foreground">{vehicle.driver.phone}</div>
                          </div>
                        )}

                        {vehicle.medicalStaff && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Medical Staff: {vehicle.medicalStaff.name}</div>
                            <div className="text-xs text-muted-foreground">{vehicle.medicalStaff.qualification}</div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Equipment Status:</div>
                          {vehicle.equipmentStatus.map((equipment, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{equipment.name}</span>
                              <div className="flex items-center gap-1">
                                {equipment.status === "working" ? (
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                ) : (
                                  <XCircle className="h-3 w-3 text-red-600" />
                                )}
                                <span className={equipment.status === "working" ? "text-green-600" : "text-red-600"}>
                                  {equipment.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-purple-600" />
                Route Management
              </CardTitle>
              <CardDescription>Track ambulance routes and optimize paths</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Route Tracking System</h3>
                <p className="text-muted-foreground mb-4">
                  Real-time GPS tracking and route optimization for ambulances
                </p>
                <Button className="gap-2">
                  <MapPin className="h-4 w-4" />
                  View Live Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Service Reports
              </CardTitle>
              <CardDescription>Generate and view ambulance service reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Response Time Report</h3>
                    <p className="text-sm text-muted-foreground">Average response times and trends</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Truck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Vehicle Utilization</h3>
                    <p className="text-sm text-muted-foreground">Fleet usage and efficiency metrics</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Wrench className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Maintenance Report</h3>
                    <p className="text-sm text-muted-foreground">Vehicle maintenance schedules and costs</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ambulance Booking Form */}
      <AmbulanceBookingForm 
        open={showBookingForm}
        onOpenChange={setShowBookingForm}
        onSuccess={(booking) => {
          console.log('New booking created:', booking);
          // Refresh the bookings list to show the new booking
          refetchBookings();
        }}
      />

      {/* Emergency Call Dialog */}
      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Phone className="h-5 w-5" />
              Emergency Call Registration
            </DialogTitle>
            <DialogDescription>
              Register an emergency call for immediate ambulance dispatch
            </DialogDescription>
          </DialogHeader>

          <Form {...emergencyForm}>
            <form onSubmit={emergencyForm.handleSubmit(handleEmergencySubmit)} className="space-y-4">
              {/* Patient Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={emergencyForm.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={emergencyForm.control}
                  name="patientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="+91-XXXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Emergency Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={emergencyForm.control}
                  name="emergencyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select emergency type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EMERGENCY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={emergencyForm.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity Level *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SEVERITY_LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location */}
              <FormField
                control={emergencyForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter complete address with area, city, landmarks..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={emergencyForm.control}
                name="landmarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Landmarks (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Near hospital, metro station, mall, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={emergencyForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the emergency situation in detail..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Caller Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Caller Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={emergencyForm.control}
                    name="callerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Caller Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Person calling for help" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emergencyForm.control}
                    name="callerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Caller Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder="+91-XXXXXXXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={emergencyForm.control}
                  name="callerRelation"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Relation to Patient *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="self">Self</SelectItem>
                          <SelectItem value="family">Family Member</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="colleague">Colleague</SelectItem>
                          <SelectItem value="neighbor">Neighbor</SelectItem>
                          <SelectItem value="authority">Authority/Official</SelectItem>
                          <SelectItem value="witness">Witness</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEmergencyDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingEmergency}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isSubmittingEmergency ? "Registering..." : "Register Emergency Call"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}