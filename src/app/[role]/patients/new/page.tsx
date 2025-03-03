"use client";

import { useState } from "react";
import {
  AddPatientForm,
  PatientFormValues,
} from "@/components/patients/add-patient-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/hooks/use-auth";
import mutate from "@/lib/firebase/mutate-data";

/**
 * NewPatientPage component provides a form to add a new patient
 */
export default function NewPatientPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, role } = useAuth();

  /**
   * Handles form submission to create a new patient
   * @param data - The patient form data
   */
  const handleSubmit = async (data: PatientFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add a patient",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Clean up the data to remove undefined values
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        // Only include defined values
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, unknown>);

      // First, create the patient record without the uid
      const initialPatientData = {
        ...cleanData,
        createdAt: new Date().toISOString(),
      };

      // Save to Firebase patients path to get an ID
      const result = await mutate({
        path: "patients",
        data: initialPatientData,
        action: "createWithId",
      });

      if (result.success && result.id) {
        // Now update the record with its own ID as both id and uid fields for compatibility
        await mutate({
          path: `patients/${result.id}`,
          data: {
            id: result.id,
            uid: result.id,
          },
          action: "update",
        });

        toast({
          title: "Success",
          description: "Patient added successfully",
        });

        // Navigate to the patient list
        router.push(`/${role}/patients`);
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to add patient");
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add patient",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-6">
          <CardTitle>Add New Patient</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <AddPatientForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
