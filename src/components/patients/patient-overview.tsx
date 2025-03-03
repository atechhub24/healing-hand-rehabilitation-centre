"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientVitals } from "./patient-vitals";
import { Patient } from "@/types/patient";
import { format } from "date-fns";

/**
 * PatientOverview component displays a comprehensive overview of a patient's health status
 * including vital signs charts and recent activity
 * @param patient - The patient object containing all patient information
 */
export function PatientOverview({ patient }: { patient: Patient }) {
  // Sample recent activity data
  const recentActivity = [
    {
      type: "Appointment",
      description: "General checkup with Dr. Sarah Johnson",
      date: "June 10, 2023",
    },
    {
      type: "Prescription",
      description: "Renewed Lisinopril 10mg",
      date: "May 25, 2023",
    },
    {
      type: "Lab Results",
      description: "Blood work results reviewed",
      date: "May 20, 2023",
    },
    {
      type: "Note",
      description: "Follow-up on blood pressure management",
      date: "May 15, 2023",
    },
  ];

  // Format registration date if available
  const registrationDate = patient.createdAt
    ? format(new Date(patient.createdAt), "MMMM d, yyyy")
    : "Unknown";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Patient Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
              {patient.name?.substring(0, 2).toUpperCase() || "P"}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{patient.name}</h2>
              <p className="text-sm text-muted-foreground">
                {patient.age} years • {patient.gender} • Registered on{" "}
                {registrationDate}
              </p>
            </div>
          </div>

          <p className="text-muted-foreground">
            {patient.condition
              ? `This patient has ${patient.condition}, currently ${
                  patient.status?.toLowerCase() || "under treatment"
                }.`
              : "No medical conditions recorded."}
            {patient.lastVisit
              ? ` Last visit was on ${new Date(
                  patient.lastVisit
                ).toLocaleDateString()}.`
              : " No previous visits recorded."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-sm">Contact Information</h3>
              <p className="text-sm mt-1">{patient.phone}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {patient.email}
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-sm">Address</h3>
              <p className="text-sm mt-1">
                {patient.address || "Not provided"}
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-sm">Blood Type</h3>
              <p className="text-sm mt-1">
                {patient.bloodType || "Not recorded"}
              </p>
            </div>
          </div>

          {patient.allergies && patient.allergies.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-sm mb-2">Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vital Signs Charts */}
      <PatientVitals patientId={patient.uid} />

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="border-l-2 border-primary pl-4 py-2">
                <p className="text-sm font-medium">{activity.type}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
