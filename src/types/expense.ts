export interface Expense {
  id?: string;
  date: string;
  type: string;
  amount: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}