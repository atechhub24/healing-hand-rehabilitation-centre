"use client";

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
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ParamedicBooking } from "@/types/paramedic";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface BookingCardProps {
  booking: ParamedicBooking;
  paramedicName: string;
  patientName: string;
}

function BookingCard({
  booking,
  paramedicName,
  patientName,
}: BookingCardProps) {
  const date = new Date(booking.schedule.date);

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
            <h3 className="font-medium">{patientName}</h3>
            <p className="text-sm text-muted-foreground">
              Paramedic: {paramedicName}
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
          <span>Service: {booking.serviceType}</span>
        </div>
      </div>
    </Card>
  );
}

export default function AdminParamedicBookingsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ParamedicBooking["status"] | "ALL"
  >("ALL");

  // Fetch all bookings and users
  const [bookingsData] = useFetch<Record<string, ParamedicBooking>>(
    "bookings",
    {
      needRaw: true,
    }
  );

  const [usersData] = useFetch<Record<string, { name: string; role: string }>>(
    "users",
    {
      needRaw: true,
    }
  );

  // Process and filter bookings
  const bookings =
    bookingsData && usersData
      ? Object.entries(bookingsData)
          .map(([id, booking]) => ({
            id,
            booking,
            paramedicName:
              usersData[booking.paramedicId]?.name || "Unknown Paramedic",
            patientName:
              usersData[booking.patientId]?.name || "Unknown Patient",
          }))
          .filter(({ booking, paramedicName, patientName }) => {
            const matchesSearch = searchTerm
              ? paramedicName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.location.city
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              : true;

            const matchesStatus =
              statusFilter === "ALL" || booking.status === statusFilter;

            return matchesSearch && matchesStatus;
          })
          .sort(
            (a, b) =>
              new Date(b.booking.createdAt).getTime() -
              new Date(a.booking.createdAt).getTime()
          )
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
            <h2 className="text-2xl font-bold text-foreground">
              Paramedic Bookings
            </h2>
            <p className="text-sm text-muted-foreground">
              View and manage all paramedic service bookings
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by paramedic, patient, or city..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as ParamedicBooking["status"] | "ALL")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {bookings.length > 0 ? (
          bookings.map(({ id, booking, paramedicName, patientName }) => (
            <BookingCard
              key={id}
              booking={booking}
              paramedicName={paramedicName}
              patientName={patientName}
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
