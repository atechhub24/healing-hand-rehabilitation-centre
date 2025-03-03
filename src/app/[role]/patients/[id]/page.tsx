"use client";

import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { PatientOverview } from "@/components/patients/patient-overview";
import useFetch from "@/lib/hooks/use-fetch";
import { Patient } from "@/types/patient";

/**
 * PatientDetailPage displays comprehensive information about a specific patient
 * It includes tabs for different aspects of the patient's medical record
 */
export default function PatientDetailPage() {
  const { id } = useParams();
  const patientId = Array.isArray(id) ? id[0] : id;

  // Fetch patient data from Firebase patients path
  const [patient, isLoading] = useFetch<Patient>(`/patients/${patientId}`, {
    needRaw: true,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Patient Not Found</h2>
          <p className="text-muted-foreground">
            The patient you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PatientOverview patient={patient} />

      <Tabs defaultValue="medical-history" className="w-full">
        <TabsList className="grid grid-cols-7 h-auto">
          <TabsTrigger value="medical-history">Medical History</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="medical-history" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground py-8">
                Medical history will be implemented soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground py-8">
                Prescriptions will be implemented soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground py-8">
                Appointments will be implemented soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab-results" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground py-8">
                Lab results will be implemented soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground py-8">
                Vitals will be implemented soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground py-8">
                Notes will be implemented soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground py-8">
                Document management coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
