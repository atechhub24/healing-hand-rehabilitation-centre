"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  Briefcase,
  Timer,
  GraduationCap,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import useFetch from "@/lib/hooks/use-fetch";
import { useAuth } from "@/lib/hooks/use-auth";
import Link from "next/link";
import { Staff, Appointment, ClinicAddress } from "@/types";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | React.ReactNode;
  colorClass?: string;
}

function InfoItem({ icon, label, value, colorClass }: InfoItemProps) {
  return (
    <div className="flex items-start gap-2">
      <div className={cn("mt-1", colorClass || "text-muted-foreground")}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-base font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}

interface AppointmentCardProps {
  appointmentId: string;
  appointment: Appointment;
}

function AppointmentCard({ appointmentId, appointment }: AppointmentCardProps) {
  const { role } = useAuth();
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
        <Badge variant={isUpcoming ? "default" : "secondary"}>
          {appointment.status}
        </Badge>
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Timer className="h-4 w-4 text-primary" />
          <span>Duration: {appointment.slotInfo.duration} minutes</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Fee: ₹{appointment.slotInfo.price}</span>
        </div>
      </div>
      {isUpcoming ? (
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
      ) : (
        <div className="mt-4">
          <Link
            href={
              role === "admin" || role === "doctor"
                ? `/${role}/appointments/${appointmentId}?userId=${appointment.patientId}`
                : `/${role}/appointments/${appointmentId}`
            }
            className="w-full"
          >
            <Button className="w-full">View Details</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function StaffDetailsPage() {
  const router = useRouter();
  const params = useParams();

  // Fetch staff data
  const [staffData, isLoadingStaff] = useFetch<Staff>(`users/${params.id}`, {
    needRaw: true,
  });

  // Fetch appointments data - need to fetch from the correct path
  const [appointmentsData, isLoadingAppointments] = useFetch<
    Record<string, Record<string, Appointment>>
  >("appointments", {
    needRaw: true,
  });

  const isLoading = isLoadingStaff || isLoadingAppointments;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!staffData) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Staff not found</p>
      </div>
    );
  }

  // Process appointments to get all appointments for this staff
  const appointments = appointmentsData
    ? Object.values(appointmentsData)
        .flatMap((userAppointments) =>
          Object.entries(userAppointments).filter(
            ([, appointment]) => appointment.doctorId === params.id
          )
        )
        .sort(([, a], [, b]) => b.createdAt - a.createdAt)
        .slice(0, 3)
    : [];

  return (
    <div className="space-y-6">
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
              Staff Details
            </h2>
            <p className="text-sm text-muted-foreground">
              View staff information and appointments
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`${params.id}/edit`)}
        >
          Edit Details
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Basic Information */}
        <Card className="p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {staffData.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {staffData.specialization}
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <InfoItem
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={staffData.email}
              />
              <InfoItem
                icon={<GraduationCap className="h-4 w-4" />}
                label="Qualification"
                value={staffData.qualification}
              />
              <InfoItem
                icon={<Stethoscope className="h-4 w-4" />}
                label="Specialization"
                value={staffData.specialization}
              />
              <InfoItem
                icon={<Briefcase className="h-4 w-4" />}
                label="Experience"
                value={`${staffData.experience} years`}
              />
            </div>

            <div className="space-y-4">
              <InfoItem
                icon={<Calendar className="h-4 w-4" />}
                label="Member Since"
                value={format(new Date(staffData.createdAt), "PPP")}
              />
              <InfoItem
                icon={<Clock className="h-4 w-4" />}
                label="Last Login"
                value={format(new Date(staffData.lastLogin), "PPP")}
              />
            </div>
          </div>
        </Card>

        {/* Clinic Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Clinic Information
          </h3>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Clinic Locations
            </h3>
            <div className="space-y-6">
              {staffData.clinicAddresses.map(
                (clinic: ClinicAddress, index: number) => (
                  <div key={index} className="space-y-4">
                    {index > 0 && (
                      <div className="border-t border-border pt-4" />
                    )}
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">{clinic.address}</p>
                        <p className="text-sm text-muted-foreground">
                          {clinic.city}, {clinic.state} - {clinic.pincode}
                        </p>
                      </div>
                    </div>
                    <div className="ml-7">
                      <p className="text-sm font-medium mb-1">Working Hours</p>
                      <p className="text-sm text-muted-foreground">
                        {clinic.timings.startTime} - {clinic.timings.endTime}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {clinic.timings.days.map((day: string) => (
                          <Badge
                            key={day}
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Appointments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Recent Appointments
          </h3>
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/${params.role}/appointments?doctorId=${params.id}`)
            }
            className="gap-2"
          >
            View All Appointments
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-4">
          {appointments.length > 0 ? (
            appointments.map(([id, appointment]) => (
              <AppointmentCard
                key={id}
                appointmentId={id}
                appointment={appointment}
              />
            ))
          ) : (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                No recent appointments found
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
