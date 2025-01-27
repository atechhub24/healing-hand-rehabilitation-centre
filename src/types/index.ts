export type UserRole = "admin" | "doctor" | "paramedic" | "lab" | "customer";

export interface UserData {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  role: UserRole;
  name?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  address?: string;
  qualification?: string;
  specialization?: string;
  experience?: number;
  location?: string;
  createdAt: Date;
  lastLogin: Date;
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

export interface Doctor extends UserData {
  clinicAddresses: ClinicAddress[];
}

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
  };
  status: "scheduled" | "completed" | "cancelled";
  createdAt: number;
  creatorInfo: CreatorInfo;
  updaterInfo: UpdaterInfo;
}
