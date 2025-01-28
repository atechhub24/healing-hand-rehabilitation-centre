"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  AlertCircle,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ParamedicBooking } from "@/types/paramedic";

interface Paramedic {
  uid: string;
  name: string;
  specialization: string;
  experience: number;
}

interface BookingWithParamedic extends ParamedicBooking {
  id: string;
  paramedic?: Paramedic;
}

export default function ParamedicBookingsPage() {
  const { user, role: userRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const params = useParams();
  const role = params.role as string;
  const [bookingsWithParamedics, setBookingsWithParamedics] = useState<
    BookingWithParamedic[]
  >([]);
  const isParamedic = userRole === "paramedic";

  // Fetch user's paramedic bookings
  const [bookingsData] = useFetch<Record<string, BookingWithParamedic>>(
    "bookings",
    {
      needRaw: true,
    }
  );

  // Fetch all paramedics
  const [paramedicsData] = useFetch<Record<string, Paramedic>>("users", {
    needRaw: true,
  });

  // Combine booking data with paramedic details
  useEffect(() => {
    if (bookingsData && paramedicsData) {
      const bookings = Object.entries(bookingsData).map(([id, booking]) => ({
        ...booking,
        id,
        paramedic: paramedicsData[booking.paramedicId],
      }));

      setBookingsWithParamedics(bookings);
    }
  }, [bookingsData, paramedicsData]);

  // Filter bookings based on role and search query
  const filteredBookings = bookingsWithParamedics
    .filter((booking) => {
      // For paramedics, show bookings assigned to them
      if (isParamedic) {
        return booking.paramedicId === user?.uid;
      }
      // For patients, show their bookings
      return booking.patientId === user?.uid;
    })
    .filter((booking) => {
      if (!searchQuery) return true;
      if (isParamedic) {
        // Paramedics search by patient condition or service type
        return (
          booking.patientDetails.condition
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          booking.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      // Patients search by paramedic name
      return (booking.paramedic?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const getStatusColor = (status: ParamedicBooking["status"]) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "CONFIRMED":
        return "default";
      case "CANCELLED":
        return "destructive";
      case "COMPLETED":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isParamedic ? "My Assigned Bookings" : "My Paramedic Bookings"}
        </h1>
        <p className="text-muted-foreground">
          {isParamedic
            ? "View and manage your assigned paramedic requests"
            : "View and manage your paramedic appointments"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              isParamedic
                ? "Search by condition or service type..."
                : "Search by paramedic name..."
            }
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {!isParamedic && (
          <Button
            onClick={() =>
              (window.location.href = `/${role}/paramedic-booking`)
            }
          >
            Book Paramedic
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    {isParamedic ? (
                      <>
                        <h3 className="font-medium">
                          Patient Condition: {booking.patientDetails.condition}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Service Type: {booking.serviceType}
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-medium">
                          {booking.paramedic?.name || "Loading..."}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.paramedic?.specialization || "Paramedic"} •{" "}
                          {booking.paramedic?.experience || 0} years exp.
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <Badge variant={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>
                    {new Date(booking.schedule.date).toLocaleDateString()}
                  </span>
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
                  <span>Service: {booking.serviceType}</span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              No paramedic bookings found
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
