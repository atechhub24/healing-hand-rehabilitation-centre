"use client";

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
  Activity,
  AlertCircle,
  Building,
  Timer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data for paramedic details
const paramedicData = {
  id: "1",
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+91 9876543210",
  qualification: "EMT-P, Advanced Life Support",
  specialization: "Emergency Care",
  experience: 5,
  availability: {
    startTime: "09:00",
    endTime: "17:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  serviceArea: {
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
  },
  status: "active",
  rating: 4.8,
  totalBookings: 156,
  completedBookings: 150,
  certifications: ["BLS", "ACLS", "PALS", "PHTLS"],
};

// Mock data for bookings
const bookings = [
  {
    id: "B001",
    patientName: "Sarah Johnson",
    patientAge: 45,
    patientGender: "Female",
    bookingDate: "2024-01-28",
    bookingTime: "10:30 AM",
    status: "completed",
    address: "123 Healthcare Avenue, Bandra West",
    pincode: "400050",
    city: "Mumbai",
    serviceType: "Emergency Care",
    symptoms: "Chest pain and difficulty breathing",
    payment: {
      amount: 1500,
      status: "paid",
      method: "online",
    },
  },
  {
    id: "B002",
    patientName: "Raj Patel",
    patientAge: 62,
    patientGender: "Male",
    bookingDate: "2024-01-28",
    bookingTime: "02:15 PM",
    status: "in-progress",
    address: "456 Wellness Street, Andheri East",
    pincode: "400069",
    city: "Mumbai",
    serviceType: "Home Care",
    symptoms: "Post-surgery care and monitoring",
    payment: {
      amount: 2000,
      status: "pending",
      method: "cash",
    },
  },
  {
    id: "B003",
    patientName: "Priya Sharma",
    patientAge: 28,
    patientGender: "Female",
    bookingDate: "2024-01-29",
    bookingTime: "11:00 AM",
    status: "scheduled",
    address: "789 Care Lane, Powai",
    pincode: "400076",
    city: "Mumbai",
    serviceType: "Regular Checkup",
    symptoms: "Regular health monitoring",
    payment: {
      amount: 1000,
      status: "not-paid",
      method: "pending",
    },
  },
];

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
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
        <p className="text-base font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: (typeof bookings)[0] }) {
  const statusColors = {
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    "in-progress":
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    scheduled:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  };

  const paymentStatusColors = {
    paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    "not-paid": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {booking.patientName}
            <span className="text-sm font-normal text-muted-foreground">
              ({booking.patientAge} yrs, {booking.patientGender})
            </span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Booking ID: {booking.id}
          </p>
        </div>
        <Badge
          className={cn(
            "capitalize",
            statusColors[booking.status as keyof typeof statusColors]
          )}
        >
          {booking.status}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <InfoItem
            icon={<Calendar className="h-4 w-4" />}
            label="Date"
            value={booking.bookingDate}
          />
          <InfoItem
            icon={<Clock className="h-4 w-4" />}
            label="Time"
            value={booking.bookingTime}
          />
          <InfoItem
            icon={<Activity className="h-4 w-4" />}
            label="Service Type"
            value={booking.serviceType}
          />
        </div>

        <div className="space-y-3">
          <InfoItem
            icon={<MapPin className="h-4 w-4" />}
            label="Address"
            value={`${booking.address}, ${booking.city} - ${booking.pincode}`}
          />
          <InfoItem
            icon={<AlertCircle className="h-4 w-4" />}
            label="Symptoms"
            value={booking.symptoms}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Payment</p>
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-foreground">
                ₹{booking.payment.amount}
              </span>
              <Badge
                className={cn(
                  "capitalize",
                  paymentStatusColors[
                    booking.payment.status as keyof typeof paymentStatusColors
                  ]
                )}
              >
                {booking.payment.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function ParamedicDetailsPage() {
  const router = useRouter();
  const params = useParams();

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
              Paramedic Details
            </h2>
            <p className="text-sm text-muted-foreground">
              View paramedic information and booking history
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
                {paramedicData.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {paramedicData.specialization}
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <InfoItem
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={paramedicData.email}
              />
              <InfoItem
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={paramedicData.phone}
              />
              <InfoItem
                icon={<Briefcase className="h-4 w-4" />}
                label="Experience"
                value={`${paramedicData.experience} years`}
              />
            </div>

            <div className="space-y-4">
              <InfoItem
                icon={<Building className="h-4 w-4" />}
                label="Service Area"
                value={`${paramedicData.serviceArea.city}, ${paramedicData.serviceArea.state}`}
              />
              <InfoItem
                icon={<MapPin className="h-4 w-4" />}
                label="Pincode"
                value={paramedicData.serviceArea.pincode}
              />
              <InfoItem
                icon={<Timer className="h-4 w-4" />}
                label="Working Hours"
                value={`${paramedicData.availability.startTime} - ${paramedicData.availability.endTime}`}
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Certifications
            </h4>
            <div className="flex flex-wrap gap-2">
              {paramedicData.certifications.map((cert) => (
                <Badge key={cert} variant="secondary">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Stats Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Overview
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                className={cn(
                  "capitalize",
                  paramedicData.status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                )}
              >
                {paramedicData.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Rating</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {paramedicData.rating}
                </span>
                <span className="text-sm text-muted-foreground">/ 5.0</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold text-foreground">
                  {paramedicData.totalBookings}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Completed Bookings
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {paramedicData.completedBookings}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bookings Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Recent Bookings
        </h3>
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </div>
  );
}
