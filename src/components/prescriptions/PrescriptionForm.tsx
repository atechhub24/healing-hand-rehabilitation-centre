import { Button } from "@/components/ui/button";
import { Save, Eye } from "lucide-react";
import { PatientInfoSection } from "./sections/PatientInfoSection";
import { MedicationSection } from "./sections/MedicationSection";
import { DoctorInfoSection } from "./sections/DoctorInfoSection";
import { usePrescription } from "./hooks/usePrescription";
import { PrescriptionFormProps } from "./types";

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  initialData,
  onSubmit,
  onPreview,
  mode = "create",
}) => {
  const {
    formData,
    updatePatient,
    updateDiagnosis,
    updateMedications,
    updateDoctorName,
    updateNotes,
    validateForm,
    convertToPrescription,
  } = usePrescription(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }

    const prescription = convertToPrescription(Date.now());
    onSubmit(prescription);
  };

  const handlePreview = () => {
    if (!validateForm()) {
      alert("Please fill in all required fields to preview");
      return;
    }

    const prescription = convertToPrescription(Date.now());
    onPreview(prescription);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">
          {mode === "create" ? "Create New Prescription" : "Edit Prescription"}
        </h2>
        <p className="text-muted-foreground">
          {mode === "create"
            ? "Fill in the patient and medication details"
            : "Update the prescription information"}
        </p>
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

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview Prescription
          </Button>
          <Button type="submit" className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {mode === "create" ? "Create Prescription" : "Update Prescription"}
          </Button>
        </div>
      </form>
    </div>
  );
};
