export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Patient {
  name: string;
  age: string;
  phone: string;
  address: string;
}

export interface Prescription {
  id: number;
  patient: Patient;
  date: string;
  medications: Medication[];
  diagnosis: string;
  notes: string;
  procedure?: string;
  doctorName: string;
  status: "active" | "completed" | "expired";
}

export interface PrescriptionFormData {
  patient: Patient;
  diagnosis: string;
  medications: Medication[];
  notes: string;
  procedure?: string;
  doctorName: string;
}

export interface PrintOptions {
  showWatermark?: boolean;
  showPreviewBanner?: boolean;
  clinicName?: string;
  clinicAddress?: string;
  clinicContact?: string;
  template?: "medical" | "cosmetic";
}

export interface PrescriptionCardProps {
  prescription: Prescription;
  onPrint: (prescription: Prescription) => void;
  onEdit?: (prescription: Prescription) => void;
  onDelete?: (prescription: Prescription) => void;
}

export interface PrescriptionFormProps {
  initialData?: Partial<PrescriptionFormData>;
  onSubmit: (data: PrescriptionFormData) => void;
  onPreview: (data: PrescriptionFormData) => void;
  mode?: "create" | "edit";
}

export interface PatientInfoSectionProps {
  patient: Patient;
  onChange: (patient: Patient) => void;
  diagnosis: string;
  onDiagnosisChange: (diagnosis: string) => void;
}

export interface MedicationSectionProps {
  medications: Medication[];
  onChange: (medications: Medication[]) => void;
}

export interface DoctorInfoSectionProps {
  doctorName: string;
  onChange: (doctorName: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}
