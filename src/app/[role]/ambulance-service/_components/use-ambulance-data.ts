"use client";

import React from "react";
import useFetch from "@/lib/hooks/use-fetch";
import { type AmbulanceBooking } from "@/types/ambulance";
import { type DriverExpense } from "@/types/expense";

export function useAmbulanceData() {
  // Fetch real booking data from Firebase
  const [bookingsData, , refetchBookings] = useFetch<
    Record<string, AmbulanceBooking>
  >("ambulance-bookings", { needRaw: true });

  // Fetch real expense data from Firebase
  const [expenseData, , refetchExpenses] = useFetch<
    Record<string, DriverExpense>
  >("driver-expenses", { needRaw: true });

  // Convert bookings data to array
  const realBookings = React.useMemo(() => {
    if (!bookingsData) return [];
    return Object.entries(bookingsData)
      .map(([id, booking]) => ({ ...booking, id }))
      .sort(
        (a, b) =>
          new Date(b.scheduledTime).getTime() -
          new Date(a.scheduledTime).getTime()
      );
  }, [bookingsData]);

  // Convert expense data to array
  const realExpenses = React.useMemo(() => {
    if (!expenseData) return [];
    return Object.entries(expenseData)
      .map(([id, expense]) => ({ ...expense, id }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenseData]);

  return {
    bookings: realBookings,
    expenses: realExpenses,
    refetchBookings,
    refetchExpenses,
  };
}
