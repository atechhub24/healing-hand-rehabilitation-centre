"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";
import {
  PatientInfoSection,
  MedicationSection,
  usePrescription,
  previewPrescription,
} from "@/components/prescriptions";
import { Textarea } from "@/components/ui/textarea";

// Types are now imported from the prescriptions module

export default function NewPrescriptionPage() {
  const router = useRouter();

  const {
    formData,
    updatePatient,
    updateDiagnosis,
    updateMedications,
    updateNotes,
    updateProcedure,
    validateForm,
    convertToPrescription,
  } = usePrescription();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }

    const prescription = convertToPrescription(Date.now());
    console.log("Prescription data:", prescription);

    // Here you would typically save to your database
    alert("Prescription created successfully!");
    router.push("/doctor/prescriptions");
  };

  const handlePreview = () => {
    if (!validateForm()) {
      alert("Please fill in all required fields to preview");
      return;
    }

    const prescription = convertToPrescription(Date.now());
    previewPrescription(prescription);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Create New Prescription</h1>
          <p className="text-muted-foreground">
            Fill in the patient and medication details
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

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Doctor&apos;s Notes</h3>
            <Textarea
              value={formData.notes}
              onChange={(e) => updateNotes(e.target.value)}
              placeholder="Enter any additional notes or instructions..."
              rows={4}
            />
          </div>
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
          <Button type="submit" className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Create Prescription
          </Button>
        </div>
      </form>
    </div>
  );
}
