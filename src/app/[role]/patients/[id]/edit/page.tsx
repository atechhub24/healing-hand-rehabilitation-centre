"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  EditPatientForm,
  PatientFormValues,
} from "@/components/patients/edit-patient-form";
import { samplePatients } from "@/components/patients/patient-list";
import { Patient } from "@/types/patient";

/**
 * EditPatientPage provides a form to edit an existing patient's information
 * It pre-fills the form with the patient's current data
 */
export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = Number(params.id);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, this would fetch from an API
  useEffect(() => {
    setIsLoading(true);
    const foundPatient = samplePatients.find((p) => p.id === patientId);
    if (foundPatient) {
      setPatient(foundPatient);
    }
    setIsLoading(false);
  }, [patientId]);

  /**
   * Handles form submission
   * In a real app, this would update the patient data in a database
   */
  const handleSubmit = (data: PatientFormValues) => {
    console.log("Form submitted with data:", data);
    // Here you would typically update the data in your database
    // Then navigate back to the patient details page
    router.push(`/${params.role}/patients/${patientId}`);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">Loading patient information...</div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8 text-center">
        Patient not found.{" "}
        <Link
          href={`/${params.role}/patients`}
          className="text-blue-500 hover:underline"
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
          <EditPatientForm patient={patient} onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
