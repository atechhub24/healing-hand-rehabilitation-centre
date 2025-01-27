"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Stethoscope,
  ArrowLeft,
  Monitor,
  Globe,
} from "lucide-react";
import useFetch from "@/lib/hooks/use-fetch";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

interface CreatorInfo {
  actionBy: string;
  browser: string;
  language: string;
  platform: string;
  screenResolution: string;
  timestamp: string;
  userAgent: string;
}

interface Appointment {
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  clinicIndex: number;
  clinicAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  slotId: string;
  slotInfo: {
    startTime: string;
    endTime: string;
    duration: number;
    price: number;
  };
  status: "scheduled" | "completed" | "cancelled";
  createdAt: number;
  creatorInfo: CreatorInfo;
}

export default function AppointmentDetailsPage() {
  const { role, user } = useAuth();
  const params = useParams();
  const appointmentId = params.id as string;

  const [appointment] = useFetch<Appointment>(
    `appointments/${user?.uid}/${appointmentId}`,
    { needRaw: true }
  );

  if (!appointment) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Loading appointment details...</p>
      </div>
    );
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
