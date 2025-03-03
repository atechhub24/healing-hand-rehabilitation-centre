/**
 * Patient interface defines the structure of patient data
 */
export interface Patient {
  id?: string; // Firebase document ID
  uid: string; // Firebase UID (deprecated, use id instead)
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  lastVisit?: string;
  condition: string;
  status: string;
  address?: string;
  /** @deprecated Use age field instead. This field is kept for backward compatibility. */
  dateOfBirth?: string;
  bloodType?: string;
  height?: number;
  weight?: number;
  allergies?: string[];
  currentMedications?: string[];
  emergencyContact?: string;
  emergencyPhone?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  insuranceGroup?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  creatorInfo?: SystemInfo;
  updaterInfo?: SystemInfo;
}

/**
 * System info interface for tracking who created/updated records
 */
export interface SystemInfo {
  timestamp: string;
  actionBy: string;
  userAgent?: string;
  platform?: string;
  language?: string;
  screenResolution?: string;
  browser?: string;
}

/**
 * Medical condition interface for patient's medical history
 */
export interface MedicalCondition {
  id: string;
  patientId: string;
  condition: string;
  diagnosedDate?: string;
  status?: string;
  notes?: string;
  medications?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Surgical history interface for patient's surgical procedures
 */
export interface SurgicalHistory {
  id: string;
  patientId: string;
  procedure: string;
  date?: string;
  hospital?: string;
  surgeon?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Family history interface for patient's family medical history
 */
export interface FamilyHistory {
  id: string;
  patientId: string;
  relation: string;
  condition: string;
  age?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Prescription interface for patient's medications
 */
export interface Prescription {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
  prescribedBy?: string;
  notes?: string;
  status: "active" | "completed" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
}
