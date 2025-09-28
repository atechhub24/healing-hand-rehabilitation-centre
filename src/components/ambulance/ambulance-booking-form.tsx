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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import mutateData from "@/lib/firebase/mutate-data";
import { type AmbulanceBooking, type BookingType } from "@/types/ambulance";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, MapPin, User } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const bookingFormSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  patientAge: z
    .number()
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120"),
  patientPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  medicalCondition: z.string().optional(),
  pickupAddress: z.string().min(5, "Pickup address is required"),
  pickupContactPerson: z.string().min(2, "Contact person name is required"),
  pickupContactPhone: z.string().min(10, "Contact phone is required"),
  destinationAddress: z.string().min(5, "Destination address is required"),
  destinationFacility: z.string().optional(),
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

      // Prepare booking data
      const bookingData: Omit<AmbulanceBooking, "id"> = {
        bookingType: "scheduled",
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
        paymentStatus: "pending",
        cost: 0,
        specialRequirements: [],
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
        description: `Ambulance booking ${
          booking ? "updated" : "created"
        } successfully. Booking ID: ${finalBookingData.id}`,
      });

      form.reset();
      onSuccess?.(finalBookingData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting booking:", error);
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
      setIsSubmitting(false);
    }
  };

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
              : "Fill in the details to book an ambulance service"}
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
                      <Input
                        placeholder="e.g., Apollo Hospital, AIIMS"
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
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Processing..."
                  : booking
                  ? "Update Booking"
                  : "Book Ambulance"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
