"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { formatCurrency } from "@ashirbad/js-core";
import { type AmbulanceBooking } from "@/types/ambulance";

interface BookingsTabProps {
  bookings: AmbulanceBooking[];
  onEditBooking: (booking: AmbulanceBooking) => void;
  onDeleteBooking: (bookingId: string) => void;
}

export function BookingsTab({
  bookings,
  onEditBooking,
  onDeleteBooking,
}: BookingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Ambulance Booking Requests
        </CardTitle>
        <CardDescription>
          Manage scheduled and regular ambulance bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No ambulance bookings yet</p>
              <p className="text-sm">
                Create your first booking to get started
              </p>
            </div>
          ) : (
            bookings.map((booking) => (
              <Card
                key={booking.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{booking.patientName}</h3>
                      </div>
                      <div className="text-sm">
                        <strong>From:</strong> {booking.pickupLocation.address}
                      </div>
                      <div className="text-sm">
                        <strong>To:</strong> {booking.destination.address}
                      </div>
                      <div className="text-sm">
                        <strong>Start Date:</strong>{" "}
                        {new Date(booking.scheduledTime).toLocaleString()}
                      </div>
                      <div className="text-sm">
                        <strong>End Date:</strong>{" "}
                        {booking.rideEndDateTime
                          ? new Date(booking.rideEndDateTime).toLocaleString()
                          : "N/A"}
                      </div>
                      <div className="text-sm">
                        <strong>Collected Amount:</strong>{" "}
                        {formatCurrency(booking.cost || 0)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditBooking(booking)}
                        className="mt-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteBooking(booking.id)}
                        className="mt-2 text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
