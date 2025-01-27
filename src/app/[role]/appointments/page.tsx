"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { Calendar, Clock, User, MapPin, Stethoscope } from "lucide-react";
import useFetch from "@/lib/hooks/use-fetch";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
}

interface AppointmentCardProps {
  appointment: Appointment;
}

function AppointmentCard({ appointment }: AppointmentCardProps) {
  const isUpcoming = appointment.status === "scheduled";
  const date = new Date(appointment.createdAt).toLocaleDateString();

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
            {appointment.clinicAddress.city}
          </span>
        </div>
      </div>
      {isUpcoming && (
        <div className="mt-4 flex gap-2">
          <Button className="flex-1">Start Session</Button>
          <Button variant="outline">Reschedule</Button>
        </div>
      )}
    </div>
  );
}

export default function AppointmentsPage() {
  const { role, user } = useAuth();

  const [appointments, isLoading] = useFetch<Record<string, Appointment>>(
    "appointments",
    {
      filter: (item: unknown) => {
        const appointment = item as Appointment;
        if (role === "doctor") {
          return appointment.doctorId === user?.uid;
        }
        return appointment.patientId === user?.uid;
      },
    }
  );

  if (!role || !["doctor", "customer"].includes(role)) {
    return null;
  }

  const isDoctor = role === "doctor";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">
            {isDoctor
              ? "Manage your patient appointments"
              : "View and manage your appointments"}
          </p>
        </div>
        {!isDoctor && (
          <Link href={`/${role}/appointments/new`}>
            <Button>Book New Appointment</Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-muted-foreground">Loading appointments...</p>
        ) : appointments && Object.keys(appointments).length > 0 ? (
          Object.values(appointments).map((appointment) => (
            <AppointmentCard
              key={appointment.slotId}
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
