"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  Briefcase,
  Building,
  Timer,
  GraduationCap,
  Stethoscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DoctorData {
  uid: string;
  name: string;
  email: string;
  qualification: string;
  specialization: string;
  experience: number;
  clinicAddresses: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    timings: {
      startTime: string;
      endTime: string;
      days: string[];
    };
  }[];
  role: string;
  createdAt: string;
  lastLogin: string;
}

interface Appointment {
  clinicAddress: string;
  clinicIndex: number;
  createdAt: number;
  creatorInfo: {
    doctorId: string;
    doctorName: string;
    doctorSpecialization: string;
    patientId: string;
    patientName: string;
    patientPhone: string;
  };
  slotId: string;
  slotInfo: {
    duration: number;
    endTime: string;
    id: string;
    isBooked: boolean;
    price: number;
    slotNumber: number;
    startTime: string;
  };
  status: string;
}

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

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const statusColors = {
    scheduled:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  };

  const appointmentDate = new Date(appointment.createdAt);

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {appointment.creatorInfo.patientName}
            <span className="text-sm font-normal text-muted-foreground">
              ({appointment.creatorInfo.patientPhone})
            </span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Slot ID: {appointment.slotId}
          </p>
        </div>
        <Badge
          className={cn(
            "capitalize",
            statusColors[appointment.status as keyof typeof statusColors]
          )}
        >
          {appointment.status}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <InfoItem
            icon={<Calendar className="h-4 w-4" />}
            label="Date"
            value={format(appointmentDate, "PPP")}
          />
          <InfoItem
            icon={<Clock className="h-4 w-4" />}
            label="Time"
            value={`${appointment.slotInfo.startTime} - ${appointment.slotInfo.endTime}`}
          />
          <InfoItem
            icon={<Timer className="h-4 w-4" />}
            label="Duration"
            value={`${appointment.slotInfo.duration} minutes`}
          />
        </div>

        <div className="space-y-3">
          <InfoItem
            icon={<MapPin className="h-4 w-4" />}
            label="Clinic Address"
            value={appointment.clinicAddress}
          />
          <InfoItem
            icon={<Building className="h-4 w-4" />}
            label="Clinic Index"
            value={appointment.clinicIndex + 1}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Fee</p>
            <span className="text-base font-medium text-foreground">
              ₹{appointment.slotInfo.price}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function DoctorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // In a real application, you would fetch this data from Firebase
  useEffect(() => {
    // Mock data for demonstration
    setDoctorData({
      uid: "oeggRX87PLbUTlB1TabOqfmuNKy2",
      name: "Dr. John Doe",
      email: "doctor@gmail.com",
      qualification: "MBBS, MD",
      specialization: "Dermatology",
      experience: 9,
      clinicAddresses: [
        {
          address: "HIG 46, Lane Number 2, Satya Sai Enclave, Kolathia",
          city: "Bhubaneswar",
          state: "Odisha",
          pincode: "751030",
          timings: {
            startTime: "09:00",
            endTime: "17:00",
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          },
        },
      ],
      role: "doctor",
      createdAt: "2025-01-23T06:20:56.422Z",
      lastLogin: "2025-01-27T15:47:18.843Z",
    });

    // Mock appointments data
    setAppointments([
      {
        clinicAddress: "HIG 46, Lane Number 2, Satya Sai Enclave, Kolathia",
        clinicIndex: 0,
        createdAt: 1737992465794,
        creatorInfo: {
          doctorId: "oeggRX87PLbUTlB1TabOqfmuNKy2",
          doctorName: "Dr. John Doe",
          doctorSpecialization: "Dermatology",
          patientId: "HvdAwsnpp2TxmFkFcTd9dzrzqz62",
          patientName: "AP",
          patientPhone: "+919876543210",
        },
        slotId: "3",
        slotInfo: {
          duration: 15,
          endTime: "12:00",
          id: "3",
          isBooked: true,
          price: 500,
          slotNumber: 4,
          startTime: "11:45",
        },
        status: "scheduled",
      },
    ]);
  }, []);

  if (!doctorData) {
    return <div>Loading...</div>;
  }

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
              Doctor Details
            </h2>
            <p className="text-sm text-muted-foreground">
              View doctor information and appointments
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
                {doctorData.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {doctorData.specialization}
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <InfoItem
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={doctorData.email}
              />
              <InfoItem
                icon={<GraduationCap className="h-4 w-4" />}
                label="Qualification"
                value={doctorData.qualification}
              />
              <InfoItem
                icon={<Stethoscope className="h-4 w-4" />}
                label="Specialization"
                value={doctorData.specialization}
              />
              <InfoItem
                icon={<Briefcase className="h-4 w-4" />}
                label="Experience"
                value={`${doctorData.experience} years`}
              />
            </div>

            <div className="space-y-4">
              <InfoItem
                icon={<Calendar className="h-4 w-4" />}
                label="Member Since"
                value={format(new Date(doctorData.createdAt), "PPP")}
              />
              <InfoItem
                icon={<Clock className="h-4 w-4" />}
                label="Last Login"
                value={format(new Date(doctorData.lastLogin), "PPP")}
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
            {doctorData.clinicAddresses.map((clinic, index) => (
              <div key={index} className="space-y-4">
                {index > 0 && <div className="border-t border-border pt-4" />}
                <InfoItem
                  icon={<Building className="h-4 w-4" />}
                  label={`Clinic ${index + 1}`}
                  value={
                    <div className="space-y-1">
                      <p>{clinic.address}</p>
                      <p>{`${clinic.city}, ${clinic.state} - ${clinic.pincode}`}</p>
                    </div>
                  }
                />
                <InfoItem
                  icon={<Timer className="h-4 w-4" />}
                  label="Working Hours"
                  value={`${clinic.timings.startTime} - ${clinic.timings.endTime}`}
                />
                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="Working Days"
                  value={
                    <div className="flex flex-wrap gap-1">
                      {clinic.timings.days.map((day) => (
                        <Badge key={day} variant="secondary">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Appointments Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Recent Appointments
        </h3>
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.slotId}
              appointment={appointment}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
