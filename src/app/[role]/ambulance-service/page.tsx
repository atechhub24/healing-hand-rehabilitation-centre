"use client";

import AmbulanceBookingForm from "@/components/ambulance/ambulance-booking-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { type AmbulanceBooking } from "@/types/ambulance";
import {
  PageHeader,
  BookingStats,
  BookingsTab,
  ExpensesTab,
  ExpenseFormDialog,
  useAmbulanceData,
  useBookingActions,
} from "./_components";

export default function AmbulanceServicePage() {
  const { role } = useParams();
  const [activeTab, setActiveTab] = useState(
    role === "staff" ? "bookings" : "dashboard"
  );
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<AmbulanceBooking | null>(
    null
  );
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // Custom hooks for data and actions
  const { bookings, expenses, refetchBookings, refetchExpenses } =
    useAmbulanceData();
  const { handleEditBooking, handleDeleteBooking } = useBookingActions();

  const onEditBooking = (booking: AmbulanceBooking) => {
    handleEditBooking(booking, setCurrentBooking, setShowBookingForm);
  };

  const onDeleteBooking = (bookingId: string) => {
    handleDeleteBooking(bookingId, refetchBookings);
  };

  const onBookingSuccess = () => {
    refetchBookings();
    setCurrentBooking(null);
  };

  const onExpenseSuccess = () => {
    refetchExpenses();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        onAddBooking={() => setShowBookingForm(true)}
        onAddExpense={() => setShowExpenseForm(true)}
      />

      {/* Booking Stats */}
      <BookingStats bookingsCount={bookings?.length ?? 0} />

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="expenses">My Expenses</TabsTrigger>
        </TabsList>

        {/* Bookings Tab - Available for both admin and staff */}
        <TabsContent value="bookings" className="space-y-4">
          <BookingsTab
            bookings={bookings || []}
            onEditBooking={onEditBooking}
            onDeleteBooking={onDeleteBooking}
          />
        </TabsContent>

        {/* Expenses Tab - Available for both admin and staff */}
        <TabsContent value="expenses" className="space-y-4">
          <ExpensesTab expenses={expenses || []} role={role as string} />
        </TabsContent>
      </Tabs>

      {/* Ambulance Booking Form */}
      <AmbulanceBookingForm
        open={showBookingForm}
        onOpenChange={(open) => {
          setShowBookingForm(open);
          if (!open) {
            setCurrentBooking(null); // Reset current booking when dialog is closed
          }
        }}
        booking={currentBooking}
        onSuccess={onBookingSuccess}
      />

      {/* Driver Expense Form Dialog */}
      <ExpenseFormDialog
        open={showExpenseForm}
        onOpenChange={setShowExpenseForm}
        onSuccess={onExpenseSuccess}
      />
    </div>
  );
}
