"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AddPatientForm } from "@/components/patients/add-patient-form";
import { PatientFormValues } from "@/components/patients/add-patient-form";
import mutate from "@/lib/firebase/mutate-data";

/**
 * AddPatientPage provides a form to add a new patient with comprehensive information
 * All fields are optional except for the basic information
 */
export default function AddPatientPage() {
  const router = useRouter();
  const params = useParams();

  /**
   * Handles form submission
   * In a real app, this would save the patient data to a database
   */
  const handleSubmit = (data: PatientFormValues) => {
    console.log("Form submitted with data:", data);
    // Here you would typically save the data to your database
    mutate({ path: "patients", data, action: "createWithId" });
    // Then navigate back to the patients list
    router.push(`/${params.role}/patients`);
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <Link href={`/${params.role}/patients`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Patient</h1>
          <p className="text-sm text-muted-foreground">
            Create a new patient record with optional detailed information
          </p>
        </div>
      </div>

      {/* Main form */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <AddPatientForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
