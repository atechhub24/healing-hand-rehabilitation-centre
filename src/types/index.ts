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
