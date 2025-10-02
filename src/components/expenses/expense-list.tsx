"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import mutate from "@/lib/firebase/mutate-data";
import useFetch from "@/lib/hooks/use-fetch";
import { Edit, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AddExpenseForm } from "./add-expense-form";
import { Expense } from "@/types/expense";
import { formatCurrency } from "@ashirbad/js-core";

interface ExpenseListProps {
  searchQuery: string;
  dateRange?: { from: Date; to: Date };
  expenseType: string;
  amountRange?: { from?: number; to?: number };
  createdBy?: string; // Filter by specific user ID
}

export function ExpenseList({
  searchQuery,
  dateRange,
  expenseType,
  amountRange,
  createdBy,
}: ExpenseListProps) {
  const [expenses, isLoading] = useFetch<Expense[]>("expenses");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const filteredExpenses = useMemo(() => {
    if (!expenses) return null;

    let filtered = expenses;

    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (expense) =>
          expense.description?.toLowerCase().includes(lowercaseQuery) ||
          expense.type?.toLowerCase().includes(lowercaseQuery)
      );
    }

    if (dateRange?.from && dateRange.to) {
      // Convert Date objects to YYYY-MM-DD format for comparison
      const startDate = new Date(dateRange.from);
      startDate.setHours(0, 0, 0, 0); // Set time to beginning of the day
      
      const endDate = new Date(dateRange.to);
      endDate.setHours(23, 59, 59, 999); // Set time to end of the day

      filtered = filtered.filter(
        (expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startDate && expenseDate <= endDate;
        }
      );
    }

    if (expenseType && expenseType !== "all") {
      filtered = filtered.filter((expense) => expense.type === expenseType);
    }

    if (amountRange) {
      if (amountRange.from !== undefined && amountRange.to !== undefined) {
        // Both min and max are specified
        filtered = filtered.filter(
          (expense) =>
            expense.amount >= (amountRange.from as number) && expense.amount <= (amountRange.to as number)
        );
      } else if (amountRange.from !== undefined) {
        // Only min is specified
        filtered = filtered.filter(
          (expense) => expense.amount >= (amountRange.from as number)
        );
      } else if (amountRange.to !== undefined) {
        // Only max is specified
        filtered = filtered.filter(
          (expense) => expense.amount <= (amountRange.to as number)
        );
      }
    }

    // Filter by creator if specified and not "all"
    if (createdBy && createdBy !== "all") {
      filtered = filtered.filter((expense) => expense.createdBy === createdBy);
    }

    return filtered;
  }, [expenses, searchQuery, dateRange, expenseType, amountRange, createdBy]);

  const handleDelete = async (id: string) => {
    await mutate({ path: `expenses/${id}`, action: "delete" });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!filteredExpenses || filteredExpenses.length === 0) {
    return <div>No expenses found.</div>;
  }

  return (
    <div className="space-y-4">
      {filteredExpenses.map((expense) => (
        <Card key={expense.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{expense.type}</span>
              <div className="flex gap-2">
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedExpense(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Expense</DialogTitle>
                    </DialogHeader>
                    {selectedExpense && (
                      <AddExpenseForm
                        onSubmit={() => setIsEditDialogOpen(false)}
                        initialValues={selectedExpense}
                      />
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(expense.id!)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Date:</strong> {expense.date}
            </p>
            <p>
              <strong>Amount:</strong> {formatCurrency(expense?.amount || 0)}
            </p>
            <p>
              <strong>Description:</strong> {expense.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
