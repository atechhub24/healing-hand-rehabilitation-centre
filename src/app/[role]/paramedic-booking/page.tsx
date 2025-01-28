"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import mutateData from "@/lib/firebase/mutate-data";
import { toast } from "@/hooks/use-toast";
import BookingForm from "@/components/paramedic/booking-form";
import type { ParamedicBooking } from "@/types/paramedic";

interface Paramedic {
  uid: string;
  serviceArea: {
    city: string;
    pincode: string;
  };
}

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
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const role = params.role as string;

  // Fetch available paramedics in the area
  const [paramedics] = useFetch<Paramedic[]>("users", {
    needRaw: true,
  });

  const handleBooking = async (formData: FormData) => {
    try {
      setIsLoading(true);

      if (!user) {
        toast({
          title: "Error",
          description: "Please login to book a paramedic",
          variant: "destructive",
        });
        return;
      }

      // Convert form data to query params
      const queryString = new URLSearchParams({
        ...formData,
        date: formData.date.toISOString(),
      } as any).toString();

      // Redirect to paramedic selection page
      router.push(`/${role}/paramedic-booking/select?${queryString}`);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
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
    </div>
  );
}
