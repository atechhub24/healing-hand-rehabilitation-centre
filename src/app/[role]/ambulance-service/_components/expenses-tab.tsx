"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";
import { type DriverExpense } from "@/types/expense";
import { useAuth } from "@/lib/hooks/use-auth";

interface ExpensesTabProps {
  expenses: DriverExpense[];
  role?: string;
}

export function ExpensesTab({ expenses, role }: ExpensesTabProps) {
  const { user } = useAuth();
  
  // Filter expenses by current user if role is staff
  const filteredExpenses = role === "staff" && user 
    ? expenses.filter(expense => expense.createdBy === user.uid)
    : expenses;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-indigo-600" />
          {role === "staff" ? "My Daily Expenses" : "Driver Expenses"}
        </CardTitle>
        <CardDescription>
          {role === "staff"
            ? "Track your daily expenses and collections"
            : "Overview of all driver expenses and collections"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No expense records yet</p>
              <p className="text-sm">Add your first expense to get started</p>
            </div>
          ) : (
            filteredExpenses.map((expense) => (
              <Card
                key={expense.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{expense.driverName}</h3>
                        <span className="text-sm text-muted-foreground">
                          {expense.vehicleNumber}
                        </span>
                        <Badge variant="outline">
                          {new Date(expense.date).toLocaleDateString()}
                        </Badge>
                      </div>

                      {/* Expense Breakdown - Show different content based on role */}
                      {role === "staff" ? (
                        // For staff: Show only expenses, no collections or summary
                        <div className="space-y-2 mt-3">
                          <div className="text-sm font-medium text-red-600">
                            Expenses
                          </div>
                          <div className="text-xs space-y-1 ml-2">
                            {expense.expenses.otherExpenses && expense.expenses.otherExpenses.length > 0 ? (
                              expense.expenses.otherExpenses.map((exp, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between"
                                >
                                  <span>{exp.type}:</span>
                                  <span>₹{exp.amount}</span>
                                </div>
                              ))
                            ) : (
                              <div className="text-muted-foreground">
                                No expenses recorded
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs">
                            <div className="flex justify-between font-medium">
                              <span>Total Expenses:</span>
                              <span className="text-red-600">₹{expense.totalExpenses}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // For admin: Show all information (expenses, collections, summary)
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-red-600">
                              Expenses
                            </div>
                            <div className="text-xs space-y-1 ml-2">
                              {expense.expenses.otherExpenses && expense.expenses.otherExpenses.length > 0 ? (
                                expense.expenses.otherExpenses.map((exp, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between"
                                  >
                                    <span>{exp.type}:</span>
                                    <span>₹{exp.amount}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-muted-foreground">
                                  No expenses
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm font-medium text-green-600">
                              Collections
                            </div>
                            <div className="text-xs space-y-1">
                              {expense.collections && expense.collections.length > 0 ? (
                                expense.collections.map((collection, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between"
                                  >
                                    <span>{collection.patientName}:</span>
                                    <span>₹{collection.amount}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-muted-foreground">
                                  No collections
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm font-medium">Summary</div>
                            <div className="text-xs space-y-1">
                              <div className="flex justify-between">
                                <span>Total Expenses:</span>
                                <span className="text-red-600">
                                  ₹{expense.totalExpenses}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total Collections:</span>
                                <span className="text-green-600">
                                  ₹{expense.totalCollections}
                                </span>
                              </div>
                              <div className="flex justify-between font-semibold">
                                <span>Net Amount:</span>
                                <span
                                  className={
                                    expense.netAmount >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  ₹{expense.netAmount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {expense.notes && (
                        <div className="text-sm text-muted-foreground mt-2">
                          <strong>Notes:</strong> {expense.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
