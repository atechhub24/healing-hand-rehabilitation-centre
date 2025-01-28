"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import { Appointment as AppointmentType } from "@/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  MapPin,
  Monitor,
  Stethoscope,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
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
import { useRouter } from "next/navigation";
import mutate from "@/lib/firebase/mutate-data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExtendedAppointment extends Omit<AppointmentType, "updaterInfo"> {
  note?: string;
  updaterInfo?: {
    actionBy: string;
    timestamp: string;
  };
}

export default function AppointmentDetailsPage() {
  const { role, user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [note, setNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [statusUpdateType, setStatusUpdateType] = useState<
    "completed" | "cancelled" | null
  >(null);

  // Determine the correct fetch path based on role
  const fetchPath = useMemo(() => {
    if (!user) return null;

    // For admin and doctor, we need the userId from the URL
    if (role === "admin" || role === "doctor") {
      return userId ? `appointments/${userId}/${appointmentId}` : null;
    }

    // For customer, use their own ID
    return `appointments/${user.uid}/${appointmentId}`;
  }, [role, user, userId, appointmentId]);

  const [appointment, isLoading] = useFetch<ExtendedAppointment>(
    fetchPath || "",
    {
      needRaw: true,
    }
  );

  if (!fetchPath || isLoading) {
    return <div>Loading...</div>;
  }

  if (!appointment) {
    return <div>Appointment not found</div>;
  }

  const date = new Date(appointment.createdAt).toLocaleDateString();
  const bookingDate = new Date(
    appointment.creatorInfo.timestamp
  ).toLocaleString();

  const handleStatusChange = async (newStatus: "completed" | "cancelled") => {
    if (!user || !appointment) return;

    setIsUpdating(true);
    try {
      await mutate({
        path: `appointments/${appointment.patientId}/${appointmentId}`,
        data: {
          status: newStatus,
          note,
          updaterInfo: {
            actionBy: user.uid,
            timestamp: new Date().toISOString(),
          },
        },
        action: "update",
      });

      setStatusUpdateType(newStatus);
      setShowSuccessDialog(true);
      router.refresh();
    } catch {
      setShowErrorDialog(true);
    } finally {
      setIsUpdating(false);
      setNote("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${role}/appointments`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Appointment Details
          </h2>
          <p className="text-muted-foreground">
            View complete appointment information
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Patient Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>{appointment.patientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{appointment.patientPhone}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Doctor Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              <span>{appointment.doctorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>{appointment.doctorSpecialization}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Appointment Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>
                {appointment.slotInfo.startTime} -{" "}
                {appointment.slotInfo.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>
                {appointment.clinicAddress.address},{" "}
                {appointment.clinicAddress.city},{" "}
                {appointment.clinicAddress.state} -{" "}
                {appointment.clinicAddress.pincode}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Booking Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Booked on: {bookingDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" />
              <span>Device: {appointment.creatorInfo.platform}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>Browser: {appointment.creatorInfo.browser}</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" />
              <span>Screen: {appointment.creatorInfo.screenResolution}</span>
            </div>
          </div>
        </div>
      </div>

      {appointment?.status === "scheduled" &&
        (role === "admin" || role === "doctor") && (
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Mark as Completed</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Complete Appointment</DialogTitle>
                  <DialogDescription>
                    Add any notes about the appointment before marking it as
                    completed.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Textarea
                    placeholder="Add notes about the appointment (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setNote("")}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleStatusChange("completed")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Complete Appointment"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Reject Booking
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Appointment</DialogTitle>
                  <DialogDescription>
                    Please provide a reason for rejecting this appointment.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Textarea
                    placeholder="Reason for rejection (required)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setNote("")}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusChange("cancelled")}
                    disabled={isUpdating || !note}
                  >
                    {isUpdating ? "Updating..." : "Reject Appointment"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

      {/* Show note if it exists */}
      {appointment?.note && (
        <div className="bg-card rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-lg">Notes</h3>
          <p className="text-muted-foreground">{appointment.note}</p>
        </div>
      )}

      {/* Success Alert Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success</AlertDialogTitle>
            <AlertDialogDescription>
              {statusUpdateType === "completed"
                ? "Appointment has been marked as completed."
                : "Appointment has been rejected."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Alert Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>
              Failed to update appointment status. Please try again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
