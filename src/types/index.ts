export type UserRole =
  | "admin"
  | "doctor"
  | "paramedic"
  | "lab"
  | "patient"
  | "staff";

export interface UserData {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  role: UserRole;
  name?: string;
  createdAt: string;
  lastLogin: string;
  creatorInfo: CreatorInfo;
  updaterInfo: UpdaterInfo;
}

export interface Slot {
  id: string;
  slotNumber: number;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  isBooked?: boolean;
  updaterInfo?: UpdaterInfo;
}

export interface ClinicAddress {
  address: string;
  city: string;
  state: string;
  pincode: string;
  timings: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  slots?: Record<string, Slot>;
}

export interface Patient extends UserData {
  age?: number;
  gender?: string;
  bloodGroup?: string;
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  emergencyContact?: string;
  familyHistory?: string;
  lifestyle?: string;
  medicalHistory?: string;
  surgicalHistory?: string;
  height?: number;
  weight?: number;
}

export interface Admin extends UserData {
  certifications?: string;
  qualification?: string;
  specialization?: string;
  experience?: number;
}

export interface Paramedic extends UserData {
  availability?: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  serviceArea?: {
    city: string;
    state: string;
    pincode: string;
  };
  qualification?: string;
  specialization?: string;
  experience?: number;
}

export interface Doctor extends UserData {
  clinicAddresses: ClinicAddress[];
  qualification?: string;
  specialization?: string;
  experience?: number;
}

// Staff is an alias for Doctor type
export type Staff = Doctor;

export interface CreatorInfo {
  actionBy: string;
  browser: string;
  language: string;
  platform: string;
  screenResolution: string;
  timestamp: string;
  userAgent: string;
}

export type UpdaterInfo = CreatorInfo;

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  clinicIndex: number;
  clinicAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  slotId: string;
  slotInfo: {
    startTime: string;
    endTime: string;
    duration: number;
    price: number;
    updaterInfo?: UpdaterInfo;
  };
  status: "scheduled" | "completed" | "cancelled";
  createdAt: number;
  creatorInfo: CreatorInfo;
  updaterInfo: UpdaterInfo;
  note?: string;
}

export interface PatientDocument {
  id: string;
  patientId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  storagePath: string;
  uploadedAt: string;
  uploadedBy?: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
  email?: string;
  managerName?: string;
  managerPhone?: string;
  timings: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  isActive: boolean;
  createdAt: string;
  creatorInfo: CreatorInfo;
  updaterInfo?: UpdaterInfo;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  icon: string; // Lucide icon name
  category: "consultation" | "diagnostic" | "emergency" | "support" | "wellness" | "specialty";
  price?: number;
  duration?: number; // in minutes
  isActive: boolean;
  isFeatured: boolean;
  features?: string[];
  requirements?: string[];
  imageUrl?: string;
  createdAt: string;
  creatorInfo: CreatorInfo;
  updaterInfo?: UpdaterInfo;
}
