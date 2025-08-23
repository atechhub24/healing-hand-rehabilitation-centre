"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, ArrowLeft, Settings } from "lucide-react";
import { useState } from "react";
import {
  PatientInfoSection,
  MedicationSection,
  DoctorInfoSection,
  usePrescription,
  previewPrescription,
  previewCosmeticPrescription,
} from "@/components/prescriptions";

// Types are now imported from the prescriptions module

export default function NewPrescriptionPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<
    "medical" | "cosmetic"
  >("medical");

  const {
    formData,
    updatePatient,
    updateDiagnosis,
    updateMedications,
    updateDoctorName,
    updateNotes,
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

    if (selectedTemplate === "cosmetic") {
      previewCosmeticPrescription(prescription);
    } else {
      previewPrescription(prescription);
    }
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

        <DoctorInfoSection
          doctorName={formData.doctorName}
          onChange={updateDoctorName}
          notes={formData.notes}
          onNotesChange={updateNotes}
        />

        {/* Template Selector */}
        <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Select Template:</span>
          <Select
            value={selectedTemplate}
            onValueChange={(value: "medical" | "cosmetic") =>
              setSelectedTemplate(value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="medical">🏥 Medical Template</SelectItem>
              <SelectItem value="cosmetic">💄 Cosmetic Template</SelectItem>
            </SelectContent>
          </Select>
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
