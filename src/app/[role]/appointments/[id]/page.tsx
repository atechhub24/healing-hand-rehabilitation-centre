"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import { Appointment } from "@/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  MapPin,
  Monitor,
  Stethoscope,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function AppointmentDetailsPage() {
  const { role, user } = useAuth();
  const params = useParams();
  const appointmentId = params.id as string;
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  // Determine the correct fetch path based on role
  const fetchPath = useMemo(() => {
    if (!user) return null;

    if (role === "admin") {
      // For admin, we need the userId from the URL
      return userId ? `appointments/${userId}/${appointmentId}` : null;
    }

    // For doctor and customer, use their own ID
    return `appointments/${user.uid}/${appointmentId}`;
  }, [role, user, userId, appointmentId]);

  const [appointment, isLoading] = useFetch<Appointment>(fetchPath || "", {
    needRaw: true,
  });

  if (!fetchPath || isLoading) {
    return <div>Loading...</div>;
  }

  if (!appointment) {
    return <div>Appointment not found</div>;
  }

  const date = new Date(appointment.createdAt).toLocaleDateString();
  const bookingDate = new Date(
    appointment.creatorInfo.timestamp
  ).toLocaleString();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${role}/appointments`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Appointment Details
          </h2>
          <p className="text-muted-foreground">
            View complete appointment information
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Patient Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>{appointment.patientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{appointment.patientPhone}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Doctor Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              <span>{appointment.doctorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>{appointment.doctorSpecialization}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Appointment Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>
                {appointment.slotInfo.startTime} -{" "}
                {appointment.slotInfo.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>
                {appointment.clinicAddress.address},{" "}
                {appointment.clinicAddress.city},{" "}
                {appointment.clinicAddress.state} -{" "}
                {appointment.clinicAddress.pincode}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Booking Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Booked on: {bookingDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" />
              <span>Device: {appointment.creatorInfo.platform}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>Browser: {appointment.creatorInfo.browser}</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" />
              <span>Screen: {appointment.creatorInfo.screenResolution}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
