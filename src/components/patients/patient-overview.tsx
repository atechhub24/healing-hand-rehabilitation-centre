"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientVitals } from "./patient-vitals";

/**
 * PatientOverview component displays a comprehensive overview of a patient's health status
 * including vital signs charts and recent activity
 * @param patientId - The ID of the patient
 */
export function PatientOverview({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  patientId,
}: {
  patientId: number;
}) {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Patient Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This patient has Type 2 Diabetes and Hypertension, both currently
            well-managed with medication. Last visit was on June 10, 2023 for a
            general checkup. Blood pressure and glucose levels have been stable
            over the past 3 months.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-sm">Next Appointment</h3>
              <p className="text-sm mt-1">August 15, 2023 at 10:30 AM</p>
              <p className="text-xs text-muted-foreground mt-1">
                With Dr. Sarah Johnson
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-sm">Last Blood Pressure</h3>
              <p className="text-sm mt-1">120/80 mmHg</p>
              <p className="text-xs text-muted-foreground mt-1">
                Measured on June 10, 2023
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-sm">Last Blood Glucose</h3>
              <p className="text-sm mt-1">110 mg/dL (fasting)</p>
              <p className="text-xs text-muted-foreground mt-1">
                Measured on June 10, 2023
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs Charts */}
      <PatientVitals />

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
