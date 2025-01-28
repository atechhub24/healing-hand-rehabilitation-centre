"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import mutateData from "@/lib/firebase/mutate-data";
import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import { Paramedic, Patient } from "@/types";
import type { ParamedicBooking } from "@/types/paramedic";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface BookingWithDetails extends ParamedicBooking {
  id: string;
  paramedic?: Paramedic;
  patient?: Patient;
}

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { role: userRole } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const bookingId = params.bookingId as string;
  const isParamedic = userRole === "paramedic";

  // Fetch booking details
  const [bookingData] = useFetch<BookingWithDetails>(`bookings/${bookingId}`, {
    needRaw: true,
  });

  // Fetch paramedic and patient details
  const [paramedic] = useFetch<Paramedic>(`users/${bookingData?.paramedicId}`, {
    needRaw: true,
  });
  const [patient] = useFetch<Patient>(`users/${bookingData?.patientId}`, {
    needRaw: true,
  });

  if (!bookingData || !paramedic || !patient) {
    return <div>Loading...</div>;
  }

  const handleStatusUpdate = async (newStatus: ParamedicBooking["status"]) => {
    try {
      setIsLoading(true);
      await mutateData({
        path: `bookings/${bookingId}`,
        data: {
          status: newStatus,
          updatedAt: new Date().toISOString(),
          ...(notes && { notes }),
        },
        action: "update",
      });

      toast({
        title: "Status Updated",
        description: `Booking has been ${newStatus.toLowerCase()}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold tracking-tight">Booking Details</h1>
          <p className="text-muted-foreground">
            View detailed information about this booking
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Status Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Booking Status</h2>
            <Badge variant={getStatusColor(bookingData.status)}>
              {bookingData.status}
            </Badge>
          </div>
          {isParamedic && bookingData.status === "PENDING" && (
            <div className="space-y-4">
              <Textarea
                placeholder="Add notes about this booking..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="flex gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Decline</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Decline Booking</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to decline this booking? This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="destructive"
                        onClick={() => handleStatusUpdate("CANCELLED")}
                        disabled={isLoading}
                      >
                        {isLoading ? "Declining..." : "Decline Booking"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => handleStatusUpdate("CONFIRMED")}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Accepting..." : "Accept Booking"}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Service Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Service Details</h2>
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Service Type</p>
                <p className="text-sm text-muted-foreground">
                  {bookingData.serviceType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Date & Time</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(bookingData.schedule.date).toLocaleDateString()} at{" "}
                  {bookingData.schedule.startTime} -{" "}
                  {bookingData.schedule.endTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {bookingData.location.address}, {bookingData.location.city},{" "}
                  {bookingData.location.state} - {bookingData.location.pincode}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Medical Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Medical Details</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium">Condition</p>
              <p className="text-sm text-muted-foreground">
                {bookingData.patientDetails.condition}
              </p>
            </div>
            <div>
              <p className="font-medium">Symptoms</p>
              <p className="text-sm text-muted-foreground">
                {bookingData.patientDetails.symptoms.join(", ")}
              </p>
            </div>
            {bookingData.patientDetails.specialRequirements && (
              <div>
                <p className="font-medium">Special Requirements</p>
                <p className="text-sm text-muted-foreground">
                  {bookingData.patientDetails.specialRequirements}
                </p>
              </div>
            )}
            {bookingData.patientDetails.medicalHistory && (
              <div>
                <p className="font-medium">Medical History</p>
                <p className="text-sm text-muted-foreground">
                  {bookingData.patientDetails.medicalHistory}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Paramedic Details</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{paramedic.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {paramedic.specialization} • {paramedic.experience} years
                    exp.
                  </p>
                </div>
              </div>
              {paramedic.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{paramedic.email}</span>
                </div>
              )}
              {paramedic.phoneNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{paramedic.phoneNumber}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Patient Details</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{patient.name}</p>
                </div>
              </div>
              {patient.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{patient.email}</span>
                </div>
              )}
              {patient.phoneNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{patient.phoneNumber}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
