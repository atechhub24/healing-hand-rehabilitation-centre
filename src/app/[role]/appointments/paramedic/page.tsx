"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ParamedicBooking } from "@/types/paramedic";
import mutateData from "@/lib/firebase/mutate-data";
import { toast } from "@/hooks/use-toast";

interface BookingCardProps {
  booking: ParamedicBooking;
  bookingId: string;
  onStatusUpdate: (
    bookingId: string,
    newStatus: ParamedicBooking["status"]
  ) => void;
}

function BookingCard({ booking, bookingId, onStatusUpdate }: BookingCardProps) {
  const date = new Date(booking.schedule.date);
  const isUpcoming = booking.status === "PENDING";

  const getStatusColor = (status: ParamedicBooking["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "CONFIRMED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      case "COMPLETED":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Patient ID: {booking.patientId}</h3>
            <p className="text-sm text-muted-foreground">
              Service: {booking.serviceType}
            </p>
          </div>
        </div>
        <Badge className={getStatusColor(booking.status)} variant="secondary">
          {booking.status}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{format(date, "PPP")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          <span>
            {booking.schedule.startTime} - {booking.schedule.endTime} (
            {booking.schedule.duration} hours)
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>
            {booking.location.address}, {booking.location.city},{" "}
            {booking.location.state} - {booking.location.pincode}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 text-primary" />
          <span>Condition: {booking.patientDetails.condition}</span>
        </div>
      </div>

      {isUpcoming && (
        <div className="mt-4 flex gap-2">
          <Button
            className="flex-1"
            onClick={() => onStatusUpdate(bookingId, "CONFIRMED")}
          >
            Accept
          </Button>
          <Button
            variant="destructive"
            onClick={() => onStatusUpdate(bookingId, "CANCELLED")}
          >
            Decline
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function ParamedicAppointmentsPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Fetch paramedic's bookings
  const [bookingsData] = useFetch<Record<string, ParamedicBooking>>(
    "bookings",
    {
      needRaw: true,
    }
  );

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: ParamedicBooking["status"]
  ) => {
    try {
      await mutateData({
        path: `bookings/${bookingId}`,
        data: { status: newStatus, updatedAt: new Date().toISOString() },
        action: "update",
      });

      toast({
        title: "Status Updated",
        description: `Booking has been ${newStatus.toLowerCase()}`,
      });
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  // Filter and sort bookings
  const bookings = bookingsData
    ? Object.entries(bookingsData)
        .filter(([, booking]) => booking.paramedicId === user?.uid)
        .sort(([, a], [, b]) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        })
    : [];

  return (
    <div className="container py-6 space-y-6">
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
            <h2 className="text-2xl font-bold text-foreground">My Bookings</h2>
            <p className="text-sm text-muted-foreground">
              Manage your paramedic service bookings
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {bookings.length > 0 ? (
          bookings.map(([id, booking]) => (
            <BookingCard
              key={id}
              bookingId={id}
              booking={booking}
              onStatusUpdate={handleStatusUpdate}
            />
          ))
        ) : (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              No bookings found
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
