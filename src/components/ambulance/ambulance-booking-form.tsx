"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import mutateData from "@/lib/firebase/mutate-data";
import { cn } from "@/lib/utils";
import { type AmbulanceBooking, type BookingType } from "@/types/ambulance";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calculator, CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const bookingFormSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  patientAge: z.number().min(1, "Age must be at least 1").max(120, "Age must be less than 120"),
  patientPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  medicalCondition: z.string().optional(),
  pickupAddress: z.string().min(5, "Pickup address is required"),
  pickupContactPerson: z.string().min(2, "Contact person name is required"),
  pickupContactPhone: z.string().min(10, "Contact phone is required"),
  destinationAddress: z.string().min(5, "Destination address is required"),
  destinationFacility: z.string().optional(),
  estimatedDuration: z.number().min(15, "Duration must be at least 15 minutes"),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface AmbulanceBookingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (booking: AmbulanceBooking) => void;
  booking?: AmbulanceBooking; // For editing existing bookings
}

export default function AmbulanceBookingForm({
  open,
  onOpenChange,
  onSuccess,
  booking,
}: AmbulanceBookingFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [costEstimate, setCostEstimate] = useState<{
    baseCost: number;
    costPerKm: number;
    estimatedDistance: number;
    durationCost: number;
    emergencySurcharge: number;
    totalCost: number;
  } | null>(null);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      patientName: booking?.patientName || "",
      patientAge: booking?.patientAge || 0,
      patientPhone: booking?.patientPhone || "",
      medicalCondition: booking?.medicalCondition || "",
      pickupAddress: booking?.pickupLocation?.address || "",
      pickupContactPerson: booking?.pickupLocation?.contactPerson || "",
      pickupContactPhone: booking?.pickupLocation?.contactPhone || "",
      destinationAddress: booking?.destination?.address || "",
      destinationFacility: booking?.destination?.facilityName || "",
      estimatedDuration: booking?.estimatedDuration || 30,
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    // Validate required fields
    if (!data.patientName.trim()) {
      toast({
        title: "Validation Error",
        description: "Patient name is required",
        variant: "destructive",
      });
      return;
    }

    if (!data.pickupAddress.trim()) {
      toast({
        title: "Validation Error", 
        description: "Pickup address is required",
        variant: "destructive",
      });
      return;
    }

    if (!data.destinationAddress.trim()) {
      toast({
        title: "Validation Error",
        description: "Destination address is required", 
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const scheduledDateTime = new Date();

      // Calculate estimated cost based on duration
      const baseCost = 2000;
      const costPerKm = 35;
      
      // Estimate distance based on duration (rough calculation: avg speed 30 km/h in city)
      const estimatedDistance = Math.max(5, (data.estimatedDuration / 60) * 30); // minimum 5km
      
      const durationCost = Math.ceil(data.estimatedDuration / 30) * 500;
      const distanceCost = estimatedDistance * costPerKm;
      const emergencySurcharge = 0;
      
      const totalCost = baseCost + distanceCost + durationCost + emergencySurcharge;
      
      // Create detailed pricing breakdown
      const pricingDetails = {
        baseCost,
        costPerKm,
        estimatedDistance: Math.round(estimatedDistance * 10) / 10, // round to 1 decimal
        durationCost,
        emergencySurcharge,
        specialRequirementsCost: 0,
        totalCost
      };

      // Prepare booking data
      const bookingData: Omit<AmbulanceBooking, "id"> = {
        bookingType: "scheduled" as BookingType,
        patientName: data.patientName,
        patientAge: data.patientAge,
        patientPhone: data.patientPhone,
        medicalCondition: data.medicalCondition,
        pickupLocation: {
          address: data.pickupAddress,
          contactPerson: data.pickupContactPerson,
          contactPhone: data.pickupContactPhone,
        },
        destination: {
          address: data.destinationAddress,
          facilityName: data.destinationFacility,
        },
        scheduledTime: scheduledDateTime.toISOString(),
        status: "pending",
        estimatedDuration: data.estimatedDuration,
        cost: totalCost,
        paymentStatus: "pending",
        specialRequirements: [],
        pricingDetails,
        createdBy: "current_user", // TODO: Get from auth context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to database
      const result = booking 
        ? await mutateData({
            path: `ambulance-bookings/${booking.id}`,
            data: bookingData as Record<string, unknown>,
            action: "update",
          })
        : await mutateData({
            path: "ambulance-bookings",
            data: bookingData as Record<string, unknown>,
            action: "createWithId",
          });

      if (!result.success) {
        throw new Error(result.error || "Failed to save booking");
      }

      // Create the final booking object with ID for callback
      const finalBookingData: AmbulanceBooking = {
        id: booking?.id || result.id || `book_${Date.now()}`,
        ...bookingData,
      };

      toast({
        title: "Success",
        description: `Ambulance booking ${booking ? "updated" : "created"} successfully. Booking ID: ${finalBookingData.id}`,
      });

      form.reset();
      onSuccess?.(finalBookingData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting booking:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to ${booking ? "update" : "create"} booking: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate cost estimate based on current form values
  const calculateCostEstimate = React.useCallback(() => {
    const duration = form.watch("estimatedDuration") || 30;
    
    const baseCost = 2000;
    const costPerKm = 35;
    const estimatedDistance = Math.max(5, (duration / 60) * 30);
    const durationCost = Math.ceil(duration / 30) * 500;
    const distanceCost = estimatedDistance * costPerKm;
    const emergencySurcharge = 0;
    const totalCost = baseCost + distanceCost + durationCost + emergencySurcharge;

    setCostEstimate({
      baseCost,
      costPerKm,
      estimatedDistance: Math.round(estimatedDistance * 10) / 10,
      durationCost,
      emergencySurcharge,
      totalCost
    });
  }, [form]);

  // Update cost estimate when relevant values change
  const duration = form.watch("estimatedDuration");
  useEffect(() => {
    calculateCostEstimate();
  }, [duration, calculateCostEstimate]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {booking ? "Edit Ambulance Booking" : "Book Ambulance Service"}
          </DialogTitle>
          <DialogDescription>
            {booking 
              ? "Update the ambulance booking details below"
              : "Fill in the details to book an ambulance service"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Age"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91-XXXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="medicalCondition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Condition (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the medical condition or reason for transport..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pickup Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Pickup Location
              </h3>
              
              <FormField
                control={form.control}
                name="pickupAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter complete pickup address with landmarks..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pickupContactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact person name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pickupContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+91-XXXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Destination */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Destination
              </h3>
              
              <FormField
                control={form.control}
                name="destinationAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter complete destination address..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destinationFacility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facility Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Apollo Hospital, AIIMS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Schedule
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="estimatedDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="30"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                        />
                      </FormControl>
                      <FormDescription>
                        Estimated duration for the trip
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Cost Estimation */}
            {costEstimate && (
              <div className="space-y-4 border rounded-lg p-4 bg-blue-50">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
                  <Calculator className="h-5 w-5" />
                  Cost Estimation
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Cost:</span>
                      <span className="font-medium">₹{costEstimate.baseCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distance ({costEstimate.estimatedDistance}km):</span>
                      <span className="font-medium">₹{(costEstimate.estimatedDistance * costEstimate.costPerKm).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>Rate per km:</span>
                      <span className="font-semibold">₹{costEstimate.costPerKm}/km</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Duration Cost:</span>
                      <span className="font-medium">₹{costEstimate.durationCost.toLocaleString()}</span>
                    </div>
                    {costEstimate.emergencySurcharge > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Emergency Surcharge:</span>
                        <span className="font-medium">₹{costEstimate.emergencySurcharge.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-blue-700">
                    <span>Estimated Total:</span>
                    <span>₹{costEstimate.totalCost.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    *Final cost may vary based on actual distance and additional services
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Processing..."
                  : booking
                  ? "Update Booking"
                  : "Book Ambulance"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}