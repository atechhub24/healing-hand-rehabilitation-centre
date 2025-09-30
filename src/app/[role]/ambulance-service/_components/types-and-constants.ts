import * as z from "zod";

// Emergency call form schema
export const emergencyCallSchema = z.object({
  patientName: z.string().min(2, "Patient name is required"),
  patientPhone: z.string().optional(),
  emergencyType: z.string().min(1, "Emergency type is required"),
  severity: z.string().min(1, "Severity level is required"),
  location: z.string().min(5, "Location is required"),
  landmarks: z.string().optional(),
  description: z.string().min(10, "Description is required"),
  callerName: z.string().min(2, "Caller name is required"),
  callerPhone: z.string().min(10, "Caller phone is required"),
  callerRelation: z.string().min(1, "Caller relation is required"),
});

export type EmergencyCallFormData = z.infer<typeof emergencyCallSchema>;

// Common expense types for ambulance staff
export const COMMON_EXPENSE_TYPES = [
  { value: "toll", label: "Toll Charges" },
  { value: "parking", label: "Parking Fees" },
  { value: "maintenance", label: "Vehicle Maintenance" },
  { value: "emergency_supplies", label: "Emergency Supplies" },
  { value: "communication", label: "Communication Charges" },
  { value: "overtime_allowance", label: "Overtime Allowance" },
  { value: "night_duty", label: "Night Duty Charges" },
  { value: "cleaning", label: "Vehicle Cleaning" },
  { value: "uniform", label: "Uniform & Equipment" },
  { value: "refreshments", label: "Staff Refreshments" },
  { value: "fuel_extra", label: "Additional Fuel Costs" },
  { value: "tire_repair", label: "Tire Repair/Replacement" },
  { value: "insurance", label: "Insurance Claims" },
  { value: "registration", label: "Vehicle Registration" },
  { value: "documentation", label: "Documentation Fees" },
  { value: "medical_supplies", label: "Medical Supplies" },
  { value: "oxygen_refill", label: "Oxygen Tank Refill" },
  { value: "sanitization", label: "Vehicle Sanitization" },
  { value: "security", label: "Security Expenses" },
  { value: "training", label: "Training & Certification" },
  { value: "accommodation", label: "Accommodation" },
  { value: "food_allowance", label: "Food Allowance" },
  { value: "transportation", label: "Public Transportation" },
  { value: "internet", label: "Internet/Data Charges" },
  { value: "stationery", label: "Stationery & Forms" },
  { value: "other", label: "Other (Please specify)" },
];

export const otherExpenseSchema = z
  .object({
    type: z.string().min(1, "Expense type is required"),
    customType: z.string().optional(),
    amount: z.number().min(0, "Amount must be positive"),
  })
  .refine(
    (data) => {
      // If type is "other", customType must be provided
      if (data.type === "other") {
        return data.customType && data.customType.trim().length > 0;
      }
      return true;
    },
    {
      message: "Please specify the expense type when selecting 'Other'",
      path: ["customType"],
    }
  );

// Driver expense form schema
export const driverExpenseSchema = z.object({
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  otherExpenses: z.array(otherExpenseSchema).optional(),
});

export type OtherExpense = z.infer<typeof otherExpenseSchema>;

export type DriverExpenseFormData = {
  date: string;
  notes?: string;
  otherExpenses?: OtherExpense[];
};
