"use client";

import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import mutateData from "@/lib/firebase/mutate-data";
import { type AmbulanceBooking } from "@/types/ambulance";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, MapPin, User } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const bookingFormSchema = z.object({
  patientName: z.string().optional(),
  patientAge: z.union([
    z.number().min(1, "Age must be at least 1").max(120, "Age must be less than 120"),
    z.undefined()
  ]),
  patientPhone: z.union([
    z.string().min(10, "Phone number must be at least 10 digits"),
    z.string().length(0), // Allow empty strings
    z.undefined()
  ]),
  medicalCondition: z.string().optional(),
  pickupLocation: z.string().min(5, "Pickup location is required"),
  pickupDateTime: z.string(),
  destinationLocation: z.string().optional(),
  rideEndDateTime: z.string().optional(),
  tripCost: z.number().min(0, "Cost must be a positive number"),
  destinationFacility: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface AmbulanceBookingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (booking: AmbulanceBooking) => void;
  booking?: AmbulanceBooking | null; // For editing existing bookings
}

export default function AmbulanceBookingForm({
  open,
  onOpenChange,
  onSuccess,
  booking,
}: AmbulanceBookingFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      patientName: booking?.patientName || "",
      patientAge: booking?.patientAge,
      patientPhone: booking?.patientPhone,
      medicalCondition: booking?.medicalCondition || "",
      pickupLocation: booking?.pickupLocation?.address || "",
      pickupDateTime: booking?.scheduledTime || new Date().toISOString().slice(0, 16),
      destinationLocation: booking?.destination?.address || "",
      rideEndDateTime: booking?.scheduledTime || (() => {
        // Default ride end time to be 1 hour after pickup time
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // Add 1 hour
        return oneHourLater.toISOString().slice(0, 16);
      })(),
      tripCost: booking?.cost || 0,
      destinationFacility: booking?.destination?.facilityName || "",
    },
  });

  // Reset form when booking prop changes
  React.useEffect(() => {
    form.reset({
      patientName: booking?.patientName || "",
      patientAge: booking?.patientAge,
      patientPhone: booking?.patientPhone,
      medicalCondition: booking?.medicalCondition || "",
      pickupLocation: booking?.pickupLocation?.address || "",
      pickupDateTime: booking?.scheduledTime || new Date().toISOString().slice(0, 16),
      destinationLocation: booking?.destination?.address || "",
      rideEndDateTime: booking?.scheduledTime || (() => {
        // Default ride end time to be 1 hour after pickup time
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // Add 1 hour
        return oneHourLater.toISOString().slice(0, 16);
      })(),
      tripCost: booking?.cost || 0,
      destinationFacility: booking?.destination?.facilityName || "",
    });
  }, [booking, form]);

  // Log form state changes for debugging
  React.useEffect(() => {
    console.log("Form state changed:", {
      isValid: form.formState.isValid,
      errors: form.formState.errors,
      isDirty: form.formState.isDirty
    });
  }, [form.formState.isValid, form.formState.errors, form.formState.isDirty]);

  // Set ride end time to match pickup time by default, but allow user to change it

  const onSubmit = async (data: BookingFormData) => {
    console.log("Form submission triggered");
    console.log("Form data:", data);
    console.log("All form errors:", form.formState.errors);
    
    setIsSubmitting(true);
    try {
      // Prepare booking data
      const bookingData: Omit<AmbulanceBooking, "id"> = {
        bookingType: "scheduled",
        patientName: data.patientName || "",
        patientAge: data.patientAge ?? 0,
        patientPhone: data.patientPhone ?? "",
        medicalCondition: data.medicalCondition,
        pickupLocation: {
          address: data.pickupLocation,
        },
        destination: {
          address: data.destinationLocation || "",
          facilityName: data.destinationFacility,
        },
        scheduledTime: new Date(data.pickupDateTime).toISOString(),
        status: "pending",
        paymentStatus: "pending",
        cost: data.tripCost,
        specialRequirements: [],
        createdBy: "current_user", // TODO: Get from auth context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Booking data:", bookingData);

      // Add ride end time if provided
      if (data.rideEndDateTime) {
        bookingData.rideEndDateTime = new Date(data.rideEndDateTime).toISOString();
      }

      // Save to database
      console.log("Attempting to save booking data:", bookingData);
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

      console.log("Mutation result:", result);
      if (!result.success) {
        throw new Error(result.error || "Failed to save booking");
      }

      // Create the final booking object with ID for callback
      const finalBookingData: AmbulanceBooking = {
        id: booking?.id || result.id || `book_${Date.now()}`,
        ...bookingData,
      };

      console.log("Final booking data before success callback:", finalBookingData);

      toast({
        title: "Success",
        description: `Ambulance booking ${
          booking ? "updated" : "created"
        } successfully. Booking ID: ${finalBookingData.id}`,
      });

      form.reset();
      console.log("Calling onSuccess callback with:", finalBookingData);
      onSuccess?.(finalBookingData);
      console.log("Setting dialog open to false");
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting booking:", error);
      console.error("Error details:", error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to ${
          booking ? "update" : "create"
        } booking: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      console.log("Setting isSubmitting to false");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[100vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {booking ? "Edit Ambulance Booking" : "Add Ambulance Booking"}
          </DialogTitle>
          <DialogDescription>
            {booking
              ? "Update the ambulance booking details below"
              : "Fill in the details to add an ambulance booking"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={(e) => {
            console.log("Form submit event triggered");
            console.log("Is form valid?", form.formState.isValid);
            console.log("Form errors:", form.formState.errors);
            console.log("Form dirty fields:", form.formState.dirtyFields);
            form.handleSubmit(onSubmit)(e);
          }} className="space-y-6">
            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information (Optional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient name (optional)" {...field} />
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
                      <FormLabel>Age (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Age"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
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
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+91-XXXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Booking Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pickupLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pickup location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pickupDateTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Date and Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destinationLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Location (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter destination location (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rideEndDateTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ride End Date and Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tripCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collection Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter collection amount"
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
                  : "Add a booking"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}