export interface AmbulanceVehicle {
  id: string;
  vehicleNumber: string;
  model: string;
  year: number;
  status: VehicleStatus;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  driver?: {
    id: string;
    name: string;
    phone: string;
    licenseNumber: string;
  };
  medicalStaff?: {
    id: string;
    name: string;
    phone: string;
    qualification: string;
  };
  lastMaintenance?: string;
  nextMaintenance?: string;
  fuelLevel?: number;
  equipmentStatus: EquipmentStatus[];
}

export interface EmergencyCall {
  id: string;
  patientName: string;
  patientPhone: string;
  emergencyType: EmergencyType;
  severity: SeverityLevel;
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
    landmarks?: string;
  };
  description: string;
  callerName: string;
  callerPhone: string;
  callerRelation: string;
  status: CallStatus;
  assignedVehicle?: string;
  estimatedArrival?: string;
  actualArrival?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface AmbulanceBooking {
  id: string;
  bookingType: BookingType;
  patientName: string;
  patientAge: number;
  patientPhone: string;
  medicalCondition?: string;
  pickupLocation: {
    address: string;
    contactPerson: string;
    contactPhone: string;
  };
  destination: {
    address: string;
    facilityName?: string;
  };
  scheduledTime: string;
  status: BookingStatus;
  assignedVehicle?: string;
  estimatedDuration?: number;
  cost?: number;
  paymentStatus: PaymentStatus;
  specialRequirements?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Enhanced pricing details
  pricingDetails?: {
    baseCost: number;
    costPerKm: number;
    estimatedDistance: number;
    durationCost: number;
    emergencySurcharge?: number;
    specialRequirementsCost?: number;
    totalCost: number;
  };
}

export type VehicleStatus = 
  | "available"
  | "on_duty"
  | "maintenance"
  | "out_of_service"
  | "emergency_response";

export type EmergencyType =
  | "cardiac_arrest"
  | "stroke"
  | "accident"
  | "breathing_difficulty"
  | "severe_injury"
  | "poisoning"
  | "burns"
  | "psychiatric_emergency"
  | "obstetric_emergency"
  | "other";

export type SeverityLevel = 
  | "critical"
  | "high"
  | "medium"
  | "low";

export type CallStatus =
  | "received"
  | "dispatched"
  | "en_route"
  | "arrived"
  | "transporting"
  | "completed"
  | "cancelled";

export type BookingType =
  | "emergency"
  | "scheduled"
  | "inter_facility"
  | "discharge";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "insurance_claimed"
  | "waived";

export interface EquipmentStatus {
  name: string;
  status: "working" | "faulty" | "missing";
  lastChecked: string;
}

export const EMERGENCY_TYPES = [
  { value: "cardiac_arrest", label: "Cardiac Arrest", color: "bg-red-100 text-red-800" },
  { value: "stroke", label: "Stroke", color: "bg-red-100 text-red-800" },
  { value: "accident", label: "Accident", color: "bg-orange-100 text-orange-800" },
  { value: "breathing_difficulty", label: "Breathing Difficulty", color: "bg-yellow-100 text-yellow-800" },
  { value: "severe_injury", label: "Severe Injury", color: "bg-red-100 text-red-800" },
  { value: "poisoning", label: "Poisoning", color: "bg-purple-100 text-purple-800" },
  { value: "burns", label: "Burns", color: "bg-orange-100 text-orange-800" },
  { value: "psychiatric_emergency", label: "Psychiatric Emergency", color: "bg-blue-100 text-blue-800" },
  { value: "obstetric_emergency", label: "Obstetric Emergency", color: "bg-pink-100 text-pink-800" },
  { value: "other", label: "Other", color: "bg-gray-100 text-gray-800" }
];

export const SEVERITY_LEVELS = [
  { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" }
];