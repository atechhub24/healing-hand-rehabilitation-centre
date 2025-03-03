"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientVitals } from "./patient-vitals";
import { Patient } from "@/types/patient";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { AddActivityForm } from "./add-activity-form";
import useFetch from "@/lib/hooks/use-fetch";

/**
 * Interface for patient activity
 */
interface PatientActivity {
  id?: string;
  type: string;
  date: string;
  description: string;
  details?: string;
}

/**
 * PatientOverview component displays a comprehensive overview of a patient's health status
 * including vital signs charts and recent activity
 * @param patient - The patient object containing all patient information
 */
export function PatientOverview({ patient }: { patient: Patient }) {
  const [addActivityOpen, setAddActivityOpen] = useState(false);

  // Fetch activities from Firebase
  const [activities, activitiesLoading, activitiesRefetch] = useFetch<
    Record<string, PatientActivity>
  >(`/patients/${patient.id || patient.uid}/activities`, { needRaw: true });

  // Process activities for display
  const processedActivities = useMemo(() => {
    if (!activities) return [];

    return Object.entries(activities)
      .map(([id, activity]) => ({
        ...activity,
        id,
        date: format(new Date(activity.date), "MMM dd, yyyy"),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [activities]);

  // Fallback data if no activities
  const displayActivities = processedActivities.length
    ? processedActivities
    : [
        {
          id: "placeholder",
          type: "No activities",
          date: format(new Date(), "MMM dd, yyyy"),
          description: "No recent activities recorded",
        },
      ];

  // Format registration date if available
  const registrationDate = patient.createdAt
    ? format(new Date(patient.createdAt), "MMMM d, yyyy")
    : "Unknown";

  // Handle successful form submission
  const handleActivityAdded = () => {
    setAddActivityOpen(false);
    // Refetch activities data
    activitiesRefetch();
  };

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
      <PatientVitals patientId={patient.id || patient.uid} />

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <Dialog open={addActivityOpen} onOpenChange={setAddActivityOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Activity
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Activity</DialogTitle>
                </DialogHeader>
                <AddActivityForm
                  patientId={patient.id || patient.uid}
                  onSuccess={handleActivityAdded}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading activity data...
            </div>
          ) : displayActivities.length > 0 ? (
            <div className="space-y-4">
              {displayActivities.map((activity, index) => (
                <div
                  key={activity.id || index}
                  className="border-l-2 border-primary pl-4 py-2"
                >
                  <p className="text-sm font-medium">{activity.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.date}
                  </p>
                  {activity.details && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      {activity.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="text-center py-4 text-muted-foreground mb-4">
                No activity records found. Add new activities using the Add
                Activity button.
              </div>
              <div className="space-y-4">
                {displayActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-gray-200 pl-4 py-2"
                  >
                    <p className="text-sm font-medium text-gray-400">
                      {activity.type}
                    </p>
                    <p className="text-sm text-gray-400">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400">{activity.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
