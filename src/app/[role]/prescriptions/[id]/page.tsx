"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  PatientInfoSection,
  MedicationSection,
  DoctorInfoSection,
  usePrescription,
  previewPrescription,
} from "@/components/prescriptions";
import { Textarea } from "@/components/ui/textarea";
import mutate from "@/lib/firebase/mutate-data";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "@/components/ui/use-toast";
import useFetch from "@/lib/hooks/use-fetch";
import { Prescription } from "@/components/prescriptions";

export default function EditPrescriptionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { role, id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the existing prescription data
  const fetchPath = user?.uid && id ? `prescriptions/${user.uid}/${id}` : "";
  const [prescriptionData] = useFetch<Prescription>(fetchPath, {
    needRaw: true,
  });

  const {
    formData,
    updatePatient,
    updateDiagnosis,
    updateMedications,
    updateNotes,
    updateProcedure,
    updateDoctorName,
    validateForm,
    convertToPrescription,
  } = usePrescription();

  // Load prescription data into form when fetched
  useEffect(() => {
    if (prescriptionData && typeof prescriptionData === "object") {
      const prescription = prescriptionData as Prescription;

      // Update form data with existing prescription
      updatePatient(prescription.patient);
      updateDiagnosis(prescription.diagnosis);
      updateMedications(prescription.medications);
      updateNotes(prescription.notes);
      updateProcedure(prescription.procedure || "");
      updateDoctorName(prescription.doctorName);

      setIsLoading(false);
    }
  }, [
    prescriptionData,
    updatePatient,
    updateDiagnosis,
    updateMedications,
    updateNotes,
    updateProcedure,
    updateDoctorName,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to edit a prescription",
        variant: "destructive",
      });
      return;
    }

    if (!id) {
      return toast({
        title: "Invalid ID",
        description: "Invalid prescription ID",
        variant: "destructive",
      });
    }

    setIsSubmitting(true);

    try {
      const updatedPrescription = convertToPrescription(id as string);

      // Update prescription in Firebase database
      const result = await mutate({
        path: `prescriptions/${user.uid}/${id}`,
        data: updatedPrescription as unknown as Record<string, unknown>,
        action: "update",
      });

      if (result.success) {
        toast({
          title: "Prescription updated successfully!",
          description: "Your changes have been saved.",
        });
        router.push(`/${role}/prescriptions`);
      } else {
        throw new Error(result.error || "Failed to update prescription");
      }
    } catch (error) {
      console.error("Error updating prescription:", error);
      toast({
        title: "Failed to update prescription",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields to preview",
        variant: "destructive",
      });
      return;
    }

    if (!id) {
      toast({
        title: "Invalid ID",
        description: "Invalid prescription ID",
        variant: "destructive",
      });
      return;
    }

    const prescription = convertToPrescription(id as string);
    previewPrescription(prescription);
  };

  // Show loading state while fetching prescription data
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              Loading prescription data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if prescription not found
  if (!prescriptionData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {!user?.uid
              ? "Please log in to view prescriptions"
              : !id
                ? "Invalid prescription ID"
                : "Prescription not found"}
          </p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Edit Prescription</h1>
          <p className="text-muted-foreground">
            Update patient and medication details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PatientInfoSection
          patient={formData.patient}
          onChange={updatePatient}
          diagnosis={formData.diagnosis}
          onDiagnosisChange={updateDiagnosis}
        />

        <MedicationSection
          medications={formData.medications}
          onChange={updateMedications}
        />

        <DoctorInfoSection
          doctorName={formData.doctorName}
          onChange={updateDoctorName}
          notes={formData.notes}
          onNotesChange={updateNotes}
        />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Diagnostic Procedure</h3>
            <Textarea
              value={formData.procedure || ""}
              onChange={(e) => updateProcedure(e.target.value)}
              placeholder="Describe the diagnostic procedure, examination methods, tests performed, and clinical findings..."
              rows={4}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={handlePreview}>
            Preview Prescription
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Updating..." : "Update Prescription"}
          </Button>
        </div>
      </form>
    </div>
  );
}
