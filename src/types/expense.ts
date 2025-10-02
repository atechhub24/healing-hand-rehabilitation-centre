export interface Expense {
  id?: string;
  date: string;
  type: string;
  amount: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string; // UID of the user who created the expense
  creatorName?: string; // Name of the user who created the expense
}

export interface DriverExpense {
  id?: string;
  date: string;
  expenses: {
    otherExpenses?: Array<{
      type: string;
      amount: number;
    }>;
  };
  collections: Array<{
    patientName: string;
    amount: number;
    time: string;
  }>;
  totalExpenses: number;
  totalCollections: number;
  netAmount: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  driverName: string;
  vehicleNumber: string;
}
