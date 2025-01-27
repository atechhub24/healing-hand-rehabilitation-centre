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
