export type ServiceType =
  | "EMERGENCY"
  | "HOME_CARE"
  | "REGULAR_CHECKUP"
  | "POST_SURGERY";

export interface ParamedicBooking {
  id: string;
  patientId: string;
  paramedicId: string;
  serviceType: ServiceType;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  schedule: {
    date: string;
    startTime: string;
    endTime: string;
    duration: number; // in hours
  };
  patientDetails: {
    condition: string;
    symptoms: string[];
    specialRequirements?: string;
    medicalHistory?: string;
  };
  createdAt: string;
  updatedAt: string;
  creatorInfo: {
    actionBy: string;
    browser: string;
    language: string;
    platform: string;
    screenResolution: string;
    timestamp: string;
    userAgent: string;
  };
  updaterInfo?: {
    actionBy: string;
    browser: string;
    language: string;
    platform: string;
    screenResolution: string;
    timestamp: string;
    userAgent: string;
  };
}

export interface ParamedicAvailability {
  days: string[];
  startTime: string;
  endTime: string;
  serviceArea: {
    city: string;
    state: string;
    pincode: string;
  };
}

export const SERVICE_TYPES: {
  label: string;
  value: ServiceType;
  description: string;
}[] = [
  {
    label: "Emergency Care",
    value: "EMERGENCY",
    description: "Immediate medical attention for urgent situations",
  },
  {
    label: "Home Care",
    value: "HOME_CARE",
    description: "Regular medical care provided at your home",
  },
  {
    label: "Regular Checkup",
    value: "REGULAR_CHECKUP",
    description: "Routine health monitoring and basic medical services",
  },
  {
    label: "Post Surgery Care",
    value: "POST_SURGERY",
    description: "Specialized care after surgical procedures",
  },
];
