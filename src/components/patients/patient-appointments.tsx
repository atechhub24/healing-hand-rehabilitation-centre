import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Plus, User, Video } from "lucide-react";

interface PatientAppointmentsProps {
  patientId: number;
}

// Sample data - in a real app, this would come from an API
const upcomingAppointments = [
  {
    id: 1,
    date: "2023-08-15",
    time: "10:30 AM",
    duration: "30 minutes",
    doctor: "Dr. Sarah Johnson",
    specialty: "Primary Care",
    location: "Main Clinic, Room 105",
    type: "In-person",
    status: "Confirmed",
    reason: "Annual physical examination",
  },
  {
    id: 2,
    date: "2023-09-05",
    time: "2:00 PM",
    duration: "45 minutes",
    doctor: "Dr. Michael Chen",
    specialty: "Cardiology",
    location: "Cardiology Department, Room 302",
    type: "In-person",
    status: "Scheduled",
    reason: "Follow-up on hypertension",
  },
  {
    id: 3,
    date: "2023-08-22",
    time: "11:15 AM",
    duration: "20 minutes",
    doctor: "Dr. Emily Rodriguez",
    specialty: "Endocrinology",
    location: "Virtual Visit",
    type: "Telemedicine",
    status: "Confirmed",
    reason: "Diabetes management check-in",
  },
];

const pastAppointments = [
  {
    id: 4,
    date: "2023-06-10",
    time: "9:00 AM",
    duration: "30 minutes",
    doctor: "Dr. Sarah Johnson",
    specialty: "Primary Care",
    location: "Main Clinic, Room 105",
    type: "In-person",
    status: "Completed",
    reason: "Blood pressure check",
    notes: "Blood pressure improved. Continue current medication.",
  },
  {
    id: 5,
    date: "2023-05-22",
    time: "1:30 PM",
    duration: "45 minutes",
    doctor: "Dr. Michael Chen",
    specialty: "Cardiology",
    location: "Cardiology Department, Room 302",
    type: "In-person",
    status: "Completed",
    reason: "Initial cardiology consultation",
    notes:
      "Diagnosed with mild hypertension. Prescribed Lisinopril 10mg daily.",
  },
  {
    id: 6,
    date: "2023-04-15",
    time: "10:45 AM",
    duration: "30 minutes",
    doctor: "Dr. Sarah Johnson",
    specialty: "Primary Care",
    location: "Main Clinic, Room 105",
    type: "In-person",
    status: "Completed",
    reason: "Annual physical examination",
    notes:
      "Overall health is good. Recommended lifestyle changes to address elevated cholesterol.",
  },
];

/**
 * PatientAppointments component displays upcoming and past appointments for a patient
 * @param patientId - The ID of the patient to display appointments for
 */
export function PatientAppointments({ patientId }: PatientAppointmentsProps) {
  // In a real app, we would fetch the patient's appointments based on the ID
  const [activeTab, setActiveTab] = useState("upcoming");

  // This would be used in a real app to handle appointment actions
  const handleAppointmentAction = (id: number, action: string) => {
    console.log(`Appointment ${id} action: ${action}`);
    // In a real app, this would call an API to perform the action
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Appointments</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </div>

      <Tabs
        defaultValue="upcoming"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {appointment.reason}
                  </CardTitle>
                  <Badge
                    variant={
                      appointment.status === "Confirmed"
                        ? "default"
                        : appointment.status === "Scheduled"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {appointment.time} ({appointment.duration})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{appointment.doctor}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium">Appointment Type</p>
                      <div className="flex items-center mt-1">
                        {appointment.type === "Telemedicine" ? (
                          <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                        ) : (
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        )}
                        <span>{appointment.type}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      {appointment.type === "Telemedicine" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            handleAppointmentAction(appointment.id, "join")
                          }
                        >
                          <Video className="h-4 w-4 mr-1" /> Join Video
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleAppointmentAction(appointment.id, "reschedule")
                        }
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleAppointmentAction(appointment.id, "cancel")
                        }
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {appointment.reason}
                  </CardTitle>
                  <Badge variant="outline">{appointment.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {appointment.time} ({appointment.duration})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{appointment.doctor}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>
                  <div>
                    {appointment.notes && (
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">Notes:</p>
                        <p className="text-sm">{appointment.notes}</p>
                      </div>
                    )}
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleAppointmentAction(appointment.id, "viewSummary")
                        }
                      >
                        View Summary
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleAppointmentAction(
                            appointment.id,
                            "bookFollowUp"
                          )
                        }
                      >
                        Book Follow-up
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
