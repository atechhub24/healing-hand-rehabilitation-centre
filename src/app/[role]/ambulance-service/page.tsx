"use client";

import AmbulanceBookingForm from "@/components/ambulance/ambulance-booking-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import mutateData from "@/lib/firebase/mutate-data";
import useFetch from "@/lib/hooks/use-fetch";
import {
  EMERGENCY_TYPES,
  SEVERITY_LEVELS,
  type AmbulanceBooking,
  type AmbulanceVehicle,
  type EmergencyCall,
} from "@/types/ambulance";
import { PAYMENT_METHODS, type DriverExpense } from "@/types/expense";
import { formatCurrency } from "@ashirbad/js-core";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Activity,
  AlertTriangle,
  Calculator,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Fuel,
  MapPin,
  Navigation,
  Phone,
  Plus,
  Receipt,
  Search,
  Timer,
  Trash,
  Truck,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Emergency call form schema
const emergencyCallSchema = z.object({
  patientName: z.string().min(2, "Patient name is required"),
  patientPhone: z.string().optional(),
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

// Driver expense form schema
const driverExpenseSchema = z.object({
  driverName: z.string().min(2, "Driver name is required"),
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  date: z.string().min(1, "Date is required"),
  petrolAmount: z.number().min(0, "Petrol amount must be positive"),
  petrolLiters: z.number().min(0, "Petrol liters must be positive").optional(),
  mealAmount: z.number().min(0, "Meal amount must be positive"),
  mealDescription: z.string().optional(),
  travelAmount: z.number().min(0, "Travel amount must be positive"),
  fromLocation: z.string().optional(),
  toLocation: z.string().optional(),
  distance: z.number().min(0, "Distance must be positive").optional(),
  purpose: z.string().optional(),
  patientName: z.string().optional(),
  collectionAmount: z.number().min(0, "Collection amount must be positive"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  notes: z.string().optional(),
});

type DriverExpenseFormData = z.infer<typeof driverExpenseSchema>;

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
      longitude: 77.209,
      address: "Main Hospital, Delhi",
    },
    driver: {
      id: "drv-001",
      name: "Rajesh Kumar",
      phone: "+91-9876543210",
      licenseNumber: "DL-1234567890",
    },
    medicalStaff: {
      id: "med-001",
      name: "Dr. Priya Sharma",
      phone: "+91-9876543211",
      qualification: "Emergency Medical Technician",
    },
    fuelLevel: 85,
    equipmentStatus: [
      { name: "Defibrillator", status: "working", lastChecked: "2024-01-15" },
      { name: "Oxygen Tank", status: "working", lastChecked: "2024-01-15" },
      { name: "Stretcher", status: "working", lastChecked: "2024-01-14" },
    ],
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
      address: "En route to AIIMS",
    },
    driver: {
      id: "drv-002",
      name: "Suresh Singh",
      phone: "+91-9876543212",
      licenseNumber: "DL-2345678901",
    },
    fuelLevel: 60,
    equipmentStatus: [
      { name: "Defibrillator", status: "working", lastChecked: "2024-01-15" },
      { name: "Oxygen Tank", status: "working", lastChecked: "2024-01-15" },
    ],
  },
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
      landmarks: "Near Metro Station",
    },
    description: "Patient experiencing chest pain and difficulty breathing",
    callerName: "Sunita Verma",
    callerPhone: "+91-9876543214",
    callerRelation: "Wife",
    status: "dispatched",
    assignedVehicle: "amb-001",
    estimatedArrival: "2024-01-15T14:30:00",
    createdAt: "2024-01-15T14:15:00",
    updatedAt: "2024-01-15T14:20:00",
  },
  {
    id: "em-002",
    patientName: "Ravi Patel",
    patientPhone: "+91-9876543215",
    emergencyType: "accident",
    severity: "high",
    location: {
      address: "Ring Road, Delhi",
      landmarks: "Near Traffic Signal",
    },
    description: "Road accident, patient unconscious",
    callerName: "Police Control Room",
    callerPhone: "100",
    callerRelation: "Authority",
    status: "received",
    createdAt: "2024-01-15T14:25:00",
    updatedAt: "2024-01-15T14:25:00",
  },
];

export default function AmbulanceServicePage() {
  const { role } = useParams();
  const [activeTab, setActiveTab] = useState(
    role === "staff" ? "bookings" : "dashboard"
  );
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<AmbulanceBooking | null>(
    null
  );
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [isSubmittingEmergency, setIsSubmittingEmergency] = useState(false);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);
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

  // Driver expense form
  const expenseForm = useForm<DriverExpenseFormData>({
    resolver: zodResolver(driverExpenseSchema),
    defaultValues: {
      driverName: "",
      date: new Date().toISOString().split("T")[0],
      petrolAmount: 0,
      petrolLiters: 0,
      mealAmount: 0,
      mealDescription: "",
      travelAmount: 0,
      fromLocation: "",
      toLocation: "",
      distance: 0,
      purpose: "",
      patientName: "",
      collectionAmount: 0,
      paymentMethod: "",
      notes: "",
    },
  });

  // Fetch real booking data from Firebase
  const [bookingsData, , refetchBookings] = useFetch<
    Record<string, AmbulanceBooking>
  >("ambulance-bookings", { needRaw: true });

  // Fetch real expense data from Firebase
  const [expenseData, , refetchExpenses] = useFetch<
    Record<string, DriverExpense>
  >("driver-expenses", { needRaw: true });

  // Convert bookings data to array
  const realBookings = React.useMemo(() => {
    if (!bookingsData) return [];
    return Object.entries(bookingsData)
      .map(([id, booking]) => ({ ...booking, id }))
      .sort(
        (a, b) =>
          new Date(b.scheduledTime).getTime() -
          new Date(a.scheduledTime).getTime()
      );
  }, [bookingsData]);

  // Convert expense data to array
  const realExpenses = React.useMemo(() => {
    if (!expenseData) return [];
    return Object.entries(expenseData)
      .map(([id, expense]) => ({ ...expense, id }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenseData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "on_duty":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "out_of_service":
        return "bg-red-100 text-red-800";
      case "emergency_response":
        return "bg-red-100 text-red-800";
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      case "received":
        return "bg-red-100 text-red-800";
      case "dispatched":
        return "bg-orange-100 text-orange-800";
      case "en_route":
        return "bg-blue-100 text-blue-800";
      case "arrived":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEmergencyTypeInfo = (type: string) => {
    return EMERGENCY_TYPES.find((t) => t.value === type) || EMERGENCY_TYPES[0];
  };

  const getSeverityInfo = (severity: string) => {
    return (
      SEVERITY_LEVELS.find((s) => s.value === severity) || SEVERITY_LEVELS[0]
    );
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
        patientPhone: data.patientPhone || "",
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
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to register emergency call: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmittingEmergency(false);
    }
  };

  const handleExpenseSubmit = async (data: DriverExpenseFormData) => {
    setIsSubmittingExpense(true);
    try {
      // Calculate totals
      const totalExpenses =
        data.petrolAmount + data.mealAmount + data.travelAmount;
      const totalCollections = data.collectionAmount;
      const netAmount = totalCollections - totalExpenses;

      // Create expense data
      const expenseData: Omit<DriverExpense, "id"> = {
        driverName: data.driverName,
        vehicleNumber: data.vehicleNumber,
        date: data.date,
        expenses: {
          petrol: {
            amount: data.petrolAmount,
            liters: data.petrolLiters,
          },
          meals: {
            amount: data.mealAmount,
            description: data.mealDescription,
          },
          travel: {
            amount: data.travelAmount,
            fromLocation: data.fromLocation,
            toLocation: data.toLocation,
            distance: data.distance,
            purpose: data.purpose,
          },
        },
        collections:
          data.patientName &&
          data.collectionAmount > 0 &&
          data.paymentMethod &&
          data.paymentMethod !== ""
            ? [
                {
                  patientName: data.patientName,
                  amount: data.collectionAmount,
                  paymentMethod: data.paymentMethod as
                    | "cash"
                    | "bank_transfer"
                    | "credit_card"
                    | "debit_card"
                    | "cheque"
                    | "upi"
                    | "other",
                },
              ]
            : [],
        totalExpenses,
        totalCollections,
        netAmount,
        notes: data.notes,
        createdBy: "current-user", // In real app, get from auth context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to database
      const result = await mutateData({
        path: "driver-expenses",
        data: expenseData,
        action: "createWithId",
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to save expense data");
      }

      toast({
        title: "Expenses Saved Successfully",
        description: `Daily expenses have been recorded. Net amount: ₹${netAmount.toLocaleString()}`,
      });

      // Reset form and close dialog
      expenseForm.reset();
      setShowExpenseForm(false);

      // Refresh expenses data
      refetchExpenses();
    } catch (error) {
      console.error("Error saving expense data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to save expenses: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  const clearAllBookings = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete ALL ambulance bookings? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // Delete all bookings from Firebase
      const result = await mutateData({
        path: "ambulance-bookings",
        action: "delete",
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to delete bookings");
      }

      toast({
        title: "Bookings Cleared",
        description: "All ambulance bookings have been successfully deleted.",
      });

      // Refresh the bookings data to reflect the changes
      refetchBookings();
    } catch (error) {
      console.error("Error clearing bookings:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to clear bookings: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const handleEditBooking = (booking: AmbulanceBooking) => {
    setCurrentBooking(booking);
    setShowBookingForm(true);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this ambulance booking? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const result = await mutateData({
        path: `ambulance-bookings/${bookingId}`,
        action: "delete",
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to delete booking");
      }

      toast({
        title: "Booking Deleted",
        description: "Ambulance booking has been successfully deleted.",
      });

      refetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to delete booking: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ambulance Service
          </h1>
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
            Add a booking
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowExpenseForm(true)}
          >
            <Receipt className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{`Today's Bookings`}</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realBookings.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
      </div>
      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="expenses">My Expenses</TabsTrigger>
        </TabsList>

        {/* Bookings Tab - Available for both admin and staff */}
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Ambulance Booking Requests
              </CardTitle>
              <CardDescription>
                Manage scheduled and regular ambulance bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realBookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No ambulance bookings yet</p>
                    <p className="text-sm">
                      Create your first booking to get started
                    </p>
                  </div>
                ) : (
                  realBookings.map((booking) => (
                    <Card
                      key={booking.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {booking.patientName}
                              </h3>
                            </div>
                            <div className="text-sm">
                              <strong>From:</strong>{" "}
                              {booking.pickupLocation.address}
                            </div>
                            <div className="text-sm">
                              <strong>To:</strong> {booking.destination.address}
                            </div>
                            <div className="text-sm">
                              <strong>Start Date:</strong>{" "}
                              {new Date(booking.scheduledTime).toLocaleString()}
                            </div>
                            <div className="text-sm">
                              <strong>End Date:</strong>{" "}
                              {booking.rideEndDateTime
                                ? new Date(
                                    booking.rideEndDateTime
                                  ).toLocaleString()
                                : "N/A"}
                            </div>
                            <div className="text-sm">
                              <strong>Collected Amount:</strong>{" "}
                              {formatCurrency(booking.cost || 0)}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditBooking(booking)}
                              className="mt-2"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="mt-2 text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Delete
                            </Button>
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

        {/* Expenses Tab - Available for both admin and staff */}
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-indigo-600" />
                {role === "staff" ? "My Daily Expenses" : "Driver Expenses"}
              </CardTitle>
              <CardDescription>
                {role === "staff"
                  ? "Track your daily expenses and collections"
                  : "Overview of all driver expenses and collections"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realExpenses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No expense records yet</p>
                    <p className="text-sm">
                      Add your first expense to get started
                    </p>
                  </div>
                ) : (
                  realExpenses.map((expense) => (
                    <Card
                      key={expense.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {expense.driverName}
                              </h3>
                              <span className="text-sm text-muted-foreground">
                                {expense.vehicleNumber}
                              </span>
                              <Badge variant="outline">
                                {new Date(expense.date).toLocaleDateString()}
                              </Badge>
                            </div>

                            {/* Expense Breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                              <div className="space-y-1">
                                <div className="text-sm font-medium text-red-600">
                                  Expenses
                                </div>
                                <div className="text-xs space-y-1">
                                  <div className="flex justify-between">
                                    <span>Petrol:</span>
                                    <span>
                                      ₹{expense.expenses.petrol.amount}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Meals:</span>
                                    <span>
                                      ₹{expense.expenses.meals.amount}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Travel:</span>
                                    <span>
                                      ₹{expense.expenses.travel.amount}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="text-sm font-medium text-green-600">
                                  Collections
                                </div>
                                <div className="text-xs space-y-1">
                                  {expense.collections.length > 0 ? (
                                    expense.collections.map(
                                      (collection, index) => (
                                        <div
                                          key={index}
                                          className="flex justify-between"
                                        >
                                          <span>{collection.patientName}:</span>
                                          <span>₹{collection.amount}</span>
                                        </div>
                                      )
                                    )
                                  ) : (
                                    <div className="text-muted-foreground">
                                      No collections
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="text-sm font-medium">
                                  Summary
                                </div>
                                <div className="text-xs space-y-1">
                                  <div className="flex justify-between">
                                    <span>Total Expenses:</span>
                                    <span className="text-red-600">
                                      ₹{expense.totalExpenses}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Total Collections:</span>
                                    <span className="text-green-600">
                                      ₹{expense.totalCollections}
                                    </span>
                                  </div>
                                  <div className="flex justify-between font-semibold">
                                    <span>Net Amount:</span>
                                    <span
                                      className={
                                        expense.netAmount >= 0
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }
                                    >
                                      ₹{expense.netAmount}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {expense.notes && (
                              <div className="text-sm text-muted-foreground mt-2">
                                <strong>Notes:</strong> {expense.notes}
                              </div>
                            )}
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
      </Tabs>
      {/* Ambulance Booking Form */}
      <AmbulanceBookingForm
        open={showBookingForm}
        onOpenChange={(open) => {
          setShowBookingForm(open);
          if (!open) {
            setCurrentBooking(null); // Reset current booking when dialog is closed
          }
        }}
        booking={currentBooking}
        onSuccess={(booking) => {
          console.log("Booking created/updated:", booking);
          // Refresh the bookings list to show the updated booking
          refetchBookings();
          setCurrentBooking(null); // Reset current booking after successful update
        }}
      />

      {/* Driver Expense Form Dialog */}
      <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              Add Daily Expenses
            </DialogTitle>
            <DialogDescription>
              Record your daily expenses like petrol, meals, and travel costs
            </DialogDescription>
          </DialogHeader>

          <Form {...expenseForm}>
            <form
              onSubmit={expenseForm.handleSubmit(handleExpenseSubmit)}
              className="space-y-6"
            >
              {/* Driver Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={expenseForm.control}
                  name="driverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={expenseForm.control}
                  name="vehicleNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="AMB-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={expenseForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Expense Categories */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Daily Expenses</h3>

                {/* Petrol Expense */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Fuel className="h-4 w-4" />
                    Petrol Expense
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={expenseForm.control}
                      name="petrolAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (₹) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="petrolLiters"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Liters</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Meal Expense */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Meal Expense
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={expenseForm.control}
                      name="mealAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (₹) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="mealDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Breakfast, lunch, dinner..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Travel Expense */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Travel Expense
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={expenseForm.control}
                      name="travelAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (₹) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="fromLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Starting point" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="toLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Destination" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={expenseForm.control}
                      name="distance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Distance (km)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purpose</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Patient transport, medical checkups..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Patient Collection */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Money Collected from Patients
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={expenseForm.control}
                      name="patientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Patient name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="collectionAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount Collected (₹) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PAYMENT_METHODS.map((method) => (
                                <SelectItem
                                  key={method.value}
                                  value={method.value}
                                >
                                  {method.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <FormField
                  control={expenseForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional notes about today's expenses or trips..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowExpenseForm(false)}
                  disabled={isSubmittingExpense}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="gap-2"
                  disabled={isSubmittingExpense}
                >
                  <Receipt className="h-4 w-4" />
                  {isSubmittingExpense ? "Saving..." : "Save Expenses"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
