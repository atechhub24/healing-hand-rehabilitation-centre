"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  Video,
  Phone,
  Plus,
} from "lucide-react";

// Sample appointment data
const appointments = [
  {
    id: 1,
    type: "Check-up",
    date: "2023-08-15",
    time: "09:30 AM",
    duration: "30 minutes",
    provider: "Dr. Sarah Johnson",
    department: "Internal Medicine",
    location: "Main Clinic, Room 105",
    status: "Upcoming",
    mode: "In-person",
    notes: "Annual physical examination",
  },
  {
    id: 2,
    type: "Follow-up",
    date: "2023-09-05",
    time: "02:15 PM",
    duration: "20 minutes",
    provider: "Dr. Sarah Johnson",
    department: "Internal Medicine",
    location: "Virtual Visit",
    status: "Upcoming",
    mode: "Telemedicine",
    notes: "Follow-up on medication adjustment",
  },
  {
    id: 3,
    type: "Consultation",
    date: "2023-07-20",
    time: "11:00 AM",
    duration: "45 minutes",
    provider: "Dr. Michael Chen",
    department: "Cardiology",
    location: "Cardiology Clinic, Room 210",
    status: "Completed",
    mode: "In-person",
    notes: "Initial cardiology consultation",
  },
  {
    id: 4,
    type: "Lab Work",
    date: "2023-06-10",
    time: "08:00 AM",
    duration: "15 minutes",
    provider: "Lab Technician",
    department: "Laboratory Services",
    location: "Main Clinic, Lab Area",
    status: "Completed",
    mode: "In-person",
    notes: "Blood work for annual check-up",
  },
  {
    id: 5,
    type: "Imaging",
    date: "2023-05-05",
    time: "03:30 PM",
    duration: "30 minutes",
    provider: "Radiology Dept",
    department: "Radiology",
    location: "Imaging Center, Floor 2",
    status: "Completed",
    mode: "In-person",
    notes: "Chest X-ray",
  },
  {
    id: 6,
    type: "Phone Consultation",
    date: "2023-04-12",
    time: "10:45 AM",
    duration: "15 minutes",
    provider: "Dr. Sarah Johnson",
    department: "Internal Medicine",
    location: "Phone Call",
    status: "Completed",
    mode: "Phone",
    notes: "Medication review",
  },
];

/**
 * PatientAppointments component displays a patient's past and upcoming appointments
 * Allows viewing appointment details and scheduling new appointments
 */
export function PatientAppointments() {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter((appointment) =>
    activeTab === "upcoming"
      ? appointment.status === "Upcoming"
      : appointment.status === "Completed"
  );

  // Get appointment icon based on mode
  const getAppointmentIcon = (mode: string) => {
    switch (mode) {
      case "Telemedicine":
        return <Video className="h-4 w-4" />;
      case "Phone":
        return <Phone className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No appointments found</p>
            <p className="text-sm text-muted-foreground">
              {activeTab === "upcoming"
                ? "There are no upcoming appointments scheduled."
                : "There are no past appointments on record."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      {appointment.type}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      with {appointment.provider}
                    </p>
                  </div>
                  <Badge
                    variant={
                      appointment.status === "Upcoming"
                        ? "default"
                        : "secondary"
                    }
                    className="flex items-center gap-1"
                  >
                    {getAppointmentIcon(appointment.mode)}
                    <span>{appointment.mode}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <span>
                        {appointment.time} ({appointment.duration})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start text-sm">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground mt-0.5" />
                    <span>
                      {appointment.location}
                      <span className="block text-xs text-muted-foreground">
                        {appointment.department}
                      </span>
                    </span>
                  </div>

                  {appointment.notes && (
                    <div className="flex items-start text-sm">
                      <FileText className="h-3.5 w-3.5 mr-1.5 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">
                        {appointment.notes}
                      </span>
                    </div>
                  )}

                  {appointment.status === "Upcoming" && (
                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Reschedule
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
