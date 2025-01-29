"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import mutateData from "@/lib/firebase/mutate-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  User,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  AlertCircle,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import type { ParamedicBooking } from "@/types/paramedic";
import { Paramedic } from "@/types";

interface AlertState {
  type: "success" | "error";
  message: string;
  description?: string;
}

interface BookingFormData {
  serviceType: ParamedicBooking["serviceType"];
  date: string;
  startTime: string;
  duration: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  condition: string;
  symptoms: string;
  specialRequirements?: string;
  medicalHistory?: string;
  paramedicId: string;
}

export default function ConfirmBookingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const role = params.role as string;

  // Get form data from URL params
  const formData: BookingFormData = {
    serviceType: searchParams.get(
      "serviceType"
    ) as ParamedicBooking["serviceType"],
    date: searchParams.get("date") || "",
    startTime: searchParams.get("startTime") || "",
    duration: searchParams.get("duration") || "",
    address: searchParams.get("address") || "",
    city: searchParams.get("city") || "",
    state: searchParams.get("state") || "",
    pincode: searchParams.get("pincode") || "",
    landmark: searchParams.get("landmark") || undefined,
    condition: searchParams.get("condition") || "",
    symptoms: searchParams.get("symptoms") || "",
    specialRequirements: searchParams.get("specialRequirements") || undefined,
    medicalHistory: searchParams.get("medicalHistory") || undefined,
    paramedicId: searchParams.get("paramedicId") || "",
  };

  // Fetch selected paramedic details
  const [paramedicData] = useFetch<Paramedic>(`users/${formData.paramedicId}`, {
    needRaw: true,
  });

  const [alert, setAlert] = useState<AlertState | null>(null);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);

      if (!user) {
        setAlert({
          type: "error",
          message: "Error",
          description: "Please login to book a paramedic",
        });
        return;
      }

      const booking: Partial<ParamedicBooking> = {
        patientId: user.uid,
        paramedicId: formData.paramedicId,
        serviceType: formData.serviceType,
        status: "PENDING",
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
        },
        schedule: {
          date: formData.date,
          startTime: formData.startTime,
          endTime: new Date(
            new Date(formData.date).setHours(
              parseInt(formData.startTime.split(":")[0]) +
                parseInt(formData.duration)
            )
          ).toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          duration: parseInt(formData.duration),
        },
        patientDetails: {
          condition: formData.condition,
          symptoms: formData.symptoms.split(",").map((s) => s.trim()),
          specialRequirements: formData.specialRequirements,
          medicalHistory: formData.medicalHistory,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save booking to Firebase
      await mutateData({
        path: `bookings/${user.uid}_${Date.now()}`,
        data: booking,
        action: "create",
      });

      setAlert({
        type: "success",
        message: "Booking Successful",
        description: "Your paramedic booking has been confirmed.",
      });

      // Redirect to paramedic bookings page after a short delay
      setTimeout(() => {
        router.push(`/${role}/paramedic-booking/bookings`);
      }, 1500);
    } catch (error) {
      setAlert({
        type: "error",
        message: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!paramedicData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="container max-w-4xl py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Confirm Booking
              </h2>
              <p className="text-sm text-muted-foreground">
                Review your paramedic booking details
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Paramedic Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Paramedic Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{paramedicData.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {paramedicData.specialization}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 text-primary" />
                <span>{paramedicData.experience} years experience</span>
              </div>
            </div>
          </Card>

          {/* Booking Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{format(new Date(formData.date), "PPP")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  {formData.startTime} ({formData.duration} hours)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>
                  {formData.address}, {formData.city}, {formData.state} -{" "}
                  {formData.pincode}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 text-primary" />
                <span>Service: {formData.serviceType}</span>
              </div>
            </div>
          </Card>

          {/* Medical Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Medical Details</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Condition</h4>
                <p className="text-sm text-muted-foreground">
                  {formData.condition}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Symptoms</h4>
                <p className="text-sm text-muted-foreground">
                  {formData.symptoms}
                </p>
              </div>
              {formData.specialRequirements && (
                <div>
                  <h4 className="font-medium mb-1">Special Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    {formData.specialRequirements}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? "Confirming..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={!!alert} onOpenChange={() => setAlert(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              {alert?.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-destructive" />
              )}
              <AlertDialogTitle>{alert?.message}</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              {alert?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlert(null)}>
              {alert?.type === "success" ? "Done" : "Close"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
