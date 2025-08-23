// Main Components
export { PrescriptionCard } from "./PrescriptionCard";
export { PrescriptionForm } from "./PrescriptionForm";

// Section Components
export { PatientInfoSection } from "./sections/PatientInfoSection";
export { MedicationSection } from "./sections/MedicationSection";
export { DoctorInfoSection } from "./sections/DoctorInfoSection";

// Hooks
export { usePrescription } from "./hooks/usePrescription";

// Utilities
export {
  printPrescription,
  previewPrescription,
  generatePrescriptionHTML,
  printCosmeticPrescription,
  previewCosmeticPrescription,
  generateCosmeticPrescriptionHTML,
} from "./utils/printUtils";

// Types
export type {
  Prescription,
  Medication,
  Patient,
  PrescriptionFormData,
  PrintOptions,
  PrescriptionCardProps,
  PrescriptionFormProps,
  PatientInfoSectionProps,
  MedicationSectionProps,
  DoctorInfoSectionProps,
} from "./types";
