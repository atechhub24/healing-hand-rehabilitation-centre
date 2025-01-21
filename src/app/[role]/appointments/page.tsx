"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Calendar, Clock, User, Video } from "lucide-react";

interface Appointment {
  id: number;
  patientName: string;
  date: string;
  time: string;
  type: "Video Consultation" | "In-Person";
  status: "upcoming" | "completed" | "cancelled";
  reason: string;
}

const appointments: Appointment[] = [
  {
    id: 1,
    patientName: "John Doe",
    date: "2024-01-22",
    time: "10:00 AM",
    type: "Video Consultation",
    status: "upcoming",
    reason: "Regular Checkup",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    date: "2024-01-22",
    time: "11:30 AM",
    type: "In-Person",
    status: "upcoming",
    reason: "Follow-up",
  },
  {
    id: 3,
    patientName: "Robert Johnson",
    date: "2024-01-21",
    time: "3:00 PM",
    type: "Video Consultation",
    status: "completed",
    reason: "Prescription Renewal",
  },
];

interface AppointmentCardProps {
  appointment: Appointment;
}

function AppointmentCard({ appointment }: AppointmentCardProps) {
  const isUpcoming = appointment.status === "upcoming";

  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {appointment.patientName}
            </h3>
            <p className="text-sm text-gray-500">{appointment.reason}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            isUpcoming
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {appointment.status}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{appointment.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{appointment.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Video className="h-4 w-4" />
          <span>{appointment.type}</span>
        </div>
      </div>
      {isUpcoming && (
        <div className="mt-4 flex gap-2">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Start Session
          </button>
          <button className="px-4 py-2 text-blue-600 hover:text-blue-700">
            Reschedule
          </button>
        </div>
      )}
    </div>
  );
}

export default function AppointmentsPage() {
  const params = useParams();
  const { role } = useAuth();

  if (!role || !["doctor", "customer"].includes(role)) {
    return null;
  }

  const isDoctor = role === "doctor";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Appointments</h2>
          <p className="text-sm text-gray-500">
            {isDoctor
              ? "Manage your patient appointments"
              : "View and manage your appointments"}
          </p>
        </div>
        {!isDoctor && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Book New Appointment
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}
