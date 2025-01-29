"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import BookingForm from "@/components/paramedic/booking-form";
import type { ParamedicBooking } from "@/types/paramedic";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FormData {
  serviceType: ParamedicBooking["serviceType"];
  date: Date;
  startTime: string;
  duration: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  condition: string;
  symptoms: string;
  specialRequirements?: string;
  medicalHistory?: string;
}

export default function ParamedicBookingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const role = params.role as string;

  const handleBooking = async (formData: FormData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        setError("Please login to book a paramedic");
        return;
      }

      // Convert form data to query params with proper type handling
      const queryParams = {
        ...formData,
        date: formData.date.toISOString(),
        duration: formData.duration.toString(),
      };

      // Convert all values to strings for URLSearchParams
      const stringParams = Object.entries(queryParams).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: String(value),
        }),
        {} as Record<string, string>
      );

      const queryString = new URLSearchParams(stringParams).toString();

      // Redirect to paramedic selection page
      router.push(`/${role}/paramedic-booking/select?${queryString}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book a Paramedic</h1>
        <p className="text-muted-foreground">
          Fill in the details below to book a paramedic for your medical needs.
        </p>
      </div>

      <BookingForm onSubmit={handleBooking} isLoading={isLoading} />

      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setError(null)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
