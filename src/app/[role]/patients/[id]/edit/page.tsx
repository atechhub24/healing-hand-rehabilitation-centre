"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  EditPatientForm,
  PatientFormValues,
} from "@/components/patients/edit-patient-form";
import { Patient } from "@/types/patient";
import useFetch from "@/lib/hooks/use-fetch";
import mutate from "@/lib/firebase/mutate-data";
import { useToast } from "@/hooks/use-toast";

/**
 * EditPatientPage provides a form to edit an existing patient's information
 * It pre-fills the form with the patient's current data
 */
export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the patient ID from the URL params
  const patientId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Fetch patient data from Firebase
  const [patient, isLoading] = useFetch<Patient>(`/patients/${patientId}`, {
    needRaw: true,
  });

  /**
   * Handles form submission
   * Updates the patient data in Firebase
   */
  const handleSubmit = async (data: PatientFormValues) => {
    try {
      setIsSubmitting(true);

      // Update the patient data in Firebase
      const result = await mutate({
        path: `patients/${patientId}`,
        data: {
          ...data,
          updatedAt: new Date().toISOString(),
        },
        action: "update",
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to update patient");
      }

      // Show success toast
      toast({
        title: "Patient updated",
        description: "Patient information has been successfully updated.",
      });

      // Navigate back to the patient details page
      router.push(`/${params.role}/patients/${patientId}`);
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update patient",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              Loading patient information...
            </h1>
            <p className="text-sm text-muted-foreground">
              Please wait while we fetch the patient details
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Patient Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The patient you are trying to edit does not exist or has been removed.
        </p>
        <Link
          href={`/${params.role}/patients`}
          className="text-primary hover:underline"
        >
          Return to patients list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <Link href={`/${params.role}/patients/${patientId}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Patient: {patient.name}</h1>
          <p className="text-sm text-muted-foreground">
            Update patient information and medical details
          </p>
        </div>
      </div>

      {/* Main form */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <EditPatientForm
            patient={patient}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
