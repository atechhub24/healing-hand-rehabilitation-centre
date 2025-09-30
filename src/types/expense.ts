export interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  category: ExpenseCategory;
  subcategory?: string;
  date: string; // ISO date string
  receipt?: string; // File URL or ID
  paymentMethod: PaymentMethod;
  vendor?: string;
  isRecurring: boolean;
  recurringPeriod?: RecurringPeriod;
  tags?: string[];
  approvedBy?: string; // User ID
  approvalStatus: ApprovalStatus;
  createdBy: string; // User ID
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  branchId?: string; // Associated branch if applicable
  invoiceNumber?: string;
  billNumber?: string;
}

export type ExpenseCategory =
  | "canteen"
  | "ambulance"
  | "external"
  | "medicine_supply"
  | "equipment"
  | "utilities"
  | "maintenance"
  | "staff_salary"
  | "office_supplies"
  | "marketing"
  | "training"
  | "insurance"
  | "rent"
  | "fuel"
  | "repair"
  | "consultation"
  | "other";

export type PaymentMethod =
  | "cash"
  | "bank_transfer"
  | "credit_card"
  | "debit_card"
  | "cheque"
  | "upi"
  | "other";

export type RecurringPeriod =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly";

export type ApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "auto_approved";

export interface ExpenseFilter {
  category?: ExpenseCategory | "all";
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  approvalStatus?: ApprovalStatus | "all";
  paymentMethod?: PaymentMethod | "all";
  searchTerm?: string;
}

export interface ExpenseSummary {
  totalAmount: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  monthlyTrend: Array<{
    month: string;
    year: number;
    total: number;
    categoryBreakdown: Record<ExpenseCategory, number>;
  }>;
  topExpenses: Expense[];
}

export const EXPENSE_CATEGORIES: Array<{
  value: ExpenseCategory;
  label: string;
  description: string;
  color: string;
  icon?: string;
}> = [
  {
    value: "canteen",
    label: "Canteen Expenses",
    description: "Food, beverages, kitchen supplies, staff meals",
    color: "bg-orange-100 text-orange-800",
    icon: "🍽️",
  },
  {
    value: "ambulance",
    label: "Ambulance Expenses",
    description: "Ambulance fuel, maintenance, driver costs, equipment",
    color: "bg-red-100 text-red-800",
    icon: "🚑",
  },
  {
    value: "external",
    label: "External Expenses",
    description: "Outside services, consultations, outsourced work",
    color: "bg-purple-100 text-purple-800",
    icon: "🏢",
  },
  {
    value: "medicine_supply",
    label: "Medicine Supply",
    description: "Pharmaceutical drugs, medical supplies, inventory",
    color: "bg-blue-100 text-blue-800",
    icon: "💊",
  },
  {
    value: "equipment",
    label: "Medical Equipment",
    description: "Medical devices, machines, tools, technology",
    color: "bg-indigo-100 text-indigo-800",
    icon: "🏥",
  },
  {
    value: "utilities",
    label: "Utilities",
    description: "Electricity, water, internet, phone, gas",
    color: "bg-yellow-100 text-yellow-800",
    icon: "⚡",
  },
  {
    value: "maintenance",
    label: "Maintenance & Repair",
    description: "Building maintenance, equipment repair, cleaning",
    color: "bg-green-100 text-green-800",
    icon: "🔧",
  },
  {
    value: "staff_salary",
    label: "Staff Salary & Benefits",
    description: "Employee wages, benefits, allowances, bonuses",
    color: "bg-teal-100 text-teal-800",
    icon: "👥",
  },
  {
    value: "office_supplies",
    label: "Office Supplies",
    description: "Stationery, printing, office equipment, furniture",
    color: "bg-gray-100 text-gray-800",
    icon: "📋",
  },
  {
    value: "fuel",
    label: "Fuel & Transportation",
    description: "Vehicle fuel, transportation costs, travel expenses",
    color: "bg-amber-100 text-amber-800",
    icon: "⛽",
  },
  {
    value: "consultation",
    label: "Professional Consultation",
    description: "Expert consultations, professional services",
    color: "bg-cyan-100 text-cyan-800",
    icon: "👨‍⚕️",
  },
  {
    value: "marketing",
    label: "Marketing & Advertising",
    description: "Promotional activities, advertising, branding",
    color: "bg-pink-100 text-pink-800",
    icon: "📢",
  },
  {
    value: "training",
    label: "Training & Education",
    description: "Staff training, certifications, educational materials",
    color: "bg-lime-100 text-lime-800",
    icon: "🎓",
  },
  {
    value: "insurance",
    label: "Insurance",
    description: "Insurance premiums, coverage, claims",
    color: "bg-emerald-100 text-emerald-800",
    icon: "🛡️",
  },
  {
    value: "rent",
    label: "Rent & Lease",
    description: "Property rent, equipment lease, facility costs",
    color: "bg-violet-100 text-violet-800",
    icon: "🏠",
  },
  {
    value: "other",
    label: "Other Expenses",
    description: "Miscellaneous and uncategorized expenses",
    color: "bg-slate-100 text-slate-800",
    icon: "📦",
  },
];

export const PAYMENT_METHODS: Array<{
  value: PaymentMethod;
  label: string;
}> = [
  { value: "cash", label: "Cash Payment" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "cheque", label: "Cheque" },
  { value: "upi", label: "UPI Payment" },
  { value: "other", label: "Other Payment Method" },
];

// Driver Expense Interface for Ambulance Service
export interface DriverExpense {
  id: string;
  driverName: string;
  vehicleNumber: string;
  date: string; // ISO date string
  expenses: {
    otherExpenses?: {
      type: string;
      amount: number;
    }[];
  };
  collections: {
    patientName: string;
    amount: number;
    paymentMethod: PaymentMethod;
  }[];
  totalExpenses: number;
  totalCollections: number;
  netAmount: number; // collections - expenses
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
