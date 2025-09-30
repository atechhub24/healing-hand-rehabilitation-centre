"use client";

import { useToast } from "@/hooks/use-toast";
import mutateData from "@/lib/firebase/mutate-data";
import { type AmbulanceBooking } from "@/types/ambulance";

export function useBookingActions() {
  const { toast } = useToast();

  const handleEditBooking = (
    booking: AmbulanceBooking,
    setCurrentBooking: (booking: AmbulanceBooking | null) => void,
    setShowBookingForm: (show: boolean) => void
  ) => {
    setCurrentBooking(booking);
    setShowBookingForm(true);
  };

  const handleDeleteBooking = async (
    bookingId: string,
    refetchBookings: () => void
  ) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this ambulance booking? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const result = await mutateData({
        path: `ambulance-bookings/${bookingId}`,
        action: "delete",
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to delete booking");
      }

      toast({
        title: "Booking Deleted",
        description: "Ambulance booking has been successfully deleted.",
      });

      refetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to delete booking: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  return {
    handleEditBooking,
    handleDeleteBooking,
  };
}
