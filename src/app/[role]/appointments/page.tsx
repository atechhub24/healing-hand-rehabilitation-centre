"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Stethoscope,
  ArrowLeft,
} from "lucide-react";
import useFetch from "@/lib/hooks/use-fetch";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";

interface Appointment {
  id: string;
  clinicAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  clinicIndex: number;
  createdAt: number;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  slotId: string;
  slotInfo: {
    duration: number;
    endTime: string;
    id: string;
    price: number;
    slotNumber: number;
    startTime: string;
  };
  status: "scheduled" | "completed" | "cancelled";
}

interface Patient {
  age: number;
  bloodGroup: string;
  createdAt: string;
  gender: string;
  name: string;
  phoneNumber: string;
  role: string;
  uid: string;
  weight: number;
}

interface AppointmentCardProps {
  appointment: Appointment;
  appointmentId: string;
}

function AppointmentCard({ appointment, appointmentId }: AppointmentCardProps) {
  const { role } = useAuth();
  const isUpcoming = appointment.status === "scheduled";
  const date = new Date(appointment.createdAt).toLocaleDateString();

  // Fetch patient details
  const [patientData] = useFetch<Patient>(`users/${appointment.patientId}`, {
    needRaw: true,
  });

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{appointment.patientName}</h3>
            <p className="text-sm text-muted-foreground">
              {appointment.patientPhone}
            </p>
            {patientData && (
              <div className="text-xs text-muted-foreground mt-1">
                {patientData.age} years • {patientData.gender} •{" "}
                {patientData.bloodGroup}
              </div>
            )}
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            isUpcoming
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {appointment.status}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Stethoscope className="h-4 w-4 text-primary" />
          <span>{appointment.doctorName}</span>
          <span className="text-xs">({appointment.doctorSpecialization})</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          <span>
            {appointment.slotInfo.startTime} - {appointment.slotInfo.endTime}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>
            {appointment.clinicAddress.address},{" "}
            {appointment.clinicAddress.city}, {appointment.clinicAddress.state}{" "}
            - {appointment.clinicAddress.pincode}
          </span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          href={
            role === "admin" || role === "doctor"
              ? `/${role}/appointments/${appointmentId}?userId=${appointment.patientId}`
              : `/${role}/appointments/${appointmentId}`
          }
          className="flex-1"
        >
          <Button className="w-full">View Details</Button>
        </Link>
        <Button variant="outline">Reschedule</Button>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const { role, user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get("doctorId");

  const isDoctor = role === "doctor";
  const isAdmin = role === "admin";
  const isCustomer = role === "customer";

  // Determine the fetch path based on role
  const fetchPath = useMemo(() => {
    if (!user?.uid) return null;

    // For admin and doctor, fetch all appointments
    if (role === "admin" || role === "doctor") {
      return "appointments";
    }

    // For customer, fetch only their appointments
    return `appointments/${user.uid}`;
  }, [role, user?.uid]);

  const [appointmentsData, isLoading] = useFetch<Appointment[]>(
    fetchPath || "",
    {
      needNested: isAdmin || isDoctor,
      filter: (item: unknown) => {
        const appointment = item as Appointment;
        if (!appointment?.doctorId) return false;

        if (doctorId) {
          return appointment.doctorId === doctorId;
        }
        if (isDoctor && user?.uid) {
          return appointment.doctorId === user.uid;
        }
        if (isCustomer && user?.uid) {
          return appointment.patientId === user.uid;
        }
        // For admin, show all appointments
        return true;
      },
      sort: (a: unknown, b: unknown) => {
        const appointmentA = a as Appointment;
        const appointmentB = b as Appointment;
        return appointmentB.createdAt - appointmentA.createdAt;
      },
    }
  );

  // No need for complex processing anymore
  const appointments = useMemo(() => {
    return appointmentsData || [];
  }, [appointmentsData]);

  if (!role || !["doctor", "customer", "admin"].includes(role)) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {doctorId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {doctorId ? "Doctor Appointments" : "Appointments"}
            </h2>
            <p className="text-muted-foreground">
              {isDoctor
                ? "Manage your patient appointments"
                : isAdmin && doctorId
                ? "View and manage doctor's appointments"
                : "View and manage your appointments"}
            </p>
          </div>
        </div>
        {!isDoctor && !doctorId && role === "customer" && (
          <Link href={`/${role}/appointments/new`}>
            <Button>Book New Appointment</Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-muted-foreground">Loading appointments...</p>
        ) : appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointmentId={appointment.id}
              appointment={appointment}
            />
          ))
        ) : (
          <p className="text-muted-foreground">No appointments found</p>
        )}
      </div>
    </div>
  );
}
