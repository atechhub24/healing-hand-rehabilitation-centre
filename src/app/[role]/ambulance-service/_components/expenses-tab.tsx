"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/hooks/use-auth";
import { type DriverExpense } from "@/types/expense";
import { formatCurrency } from "@ashirbad/js-core";
import { PieChart, Receipt, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Define color palette for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FF6B6B",
  "#4ECDC4",
];

interface ExpensesTabProps {
  expenses: DriverExpense[];
  role?: string;
}

export function ExpensesTab({ expenses, role }: ExpensesTabProps) {
  const { user } = useAuth();

  // Filter expenses by current user if role is staff
  const filteredExpenses =
    role === "staff" && user
      ? expenses.filter((expense) => expense.createdBy === user.uid)
      : expenses;

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    if (!filteredExpenses || filteredExpenses.length === 0) {
      return {
        totalExpenses: 0,
        totalCollections: 0,
        netAmount: 0,
        expenseByType: {},
        dailyExpenses: {},
        expenseChartData: [],
        dailyChartData: [],
      };
    }

    let totalExpenses = 0;
    let totalCollections = 0;
    const expenseByType: Record<string, number> = {};
    const dailyExpenses: Record<string, number> = {};

    filteredExpenses.forEach((expense) => {
      totalExpenses += expense.totalExpenses || 0;
      totalCollections += expense.totalCollections || 0;

      // Aggregate expense types
      if (expense.expenses.otherExpenses) {
        expense.expenses.otherExpenses.forEach((exp) => {
          if (exp.type) {
            if (expenseByType[exp.type]) {
              expenseByType[exp.type] += exp.amount || 0;
            } else {
              expenseByType[exp.type] = exp.amount || 0;
            }
          }
        });
      }

      // Aggregate daily expenses
      const date = expense.date;
      if (dailyExpenses[date]) {
        dailyExpenses[date] += expense.totalExpenses || 0;
      } else {
        dailyExpenses[date] = expense.totalExpenses || 0;
      }
    });

    const netAmount = totalCollections - totalExpenses;

    // Prepare chart data
    const expenseChartData = Object.entries(expenseByType).map(
      ([type, total], index) => ({
        type,
        total,
        name: type,
        value: total,
        color: COLORS[index % COLORS.length],
      })
    );

    const dailyChartData = Object.entries(dailyExpenses)
      .map(([date, total]) => ({
        date,
        total,
        name: new Date(date).toLocaleDateString(),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalExpenses,
      totalCollections,
      netAmount,
      expenseByType,
      dailyExpenses,
      expenseChartData,
      dailyChartData,
    };
  }, [filteredExpenses]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(analyticsData.totalExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Collections
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(analyticsData.totalCollections)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                analyticsData.netAmount >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(analyticsData.netAmount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {filteredExpenses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Expenses Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Daily Expenses Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.dailyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(Number(value)),
                        "Amount",
                      ]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar
                      dataKey="total"
                      name="Daily Expense"
                      fill="#ff6b6b"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Expenses by Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Expenses by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {analyticsData.expenseChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analyticsData.expenseChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {analyticsData.expenseChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No expense type data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Expense Records */}
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
                          <h3 className="font-semibold">
                            {expense.driverName}
                          </h3>
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
                              {expense.expenses.otherExpenses &&
                              expense.expenses.otherExpenses.length > 0 ? (
                                expense.expenses.otherExpenses.map(
                                  (exp, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between"
                                    >
                                      <span>{exp.type}:</span>
                                      <span>₹{exp.amount}</span>
                                    </div>
                                  )
                                )
                              ) : (
                                <div className="text-muted-foreground">
                                  No expenses recorded
                                </div>
                              )}
                            </div>

                            <div className="text-xs">
                              <div className="flex justify-between font-medium">
                                <span>Total Expenses:</span>
                                <span className="text-red-600">
                                  ₹{expense.totalExpenses}
                                </span>
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
                                {expense.expenses.otherExpenses &&
                                expense.expenses.otherExpenses.length > 0 ? (
                                  expense.expenses.otherExpenses.map(
                                    (exp, index) => (
                                      <div
                                        key={index}
                                        className="flex justify-between"
                                      >
                                        <span>{exp.type}:</span>
                                        <span>₹{exp.amount}</span>
                                      </div>
                                    )
                                  )
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
                                {expense.collections &&
                                expense.collections.length > 0 ? (
                                  expense.collections.map(
                                    (collection, index) => (
                                      <div
                                        key={index}
                                        className="flex justify-between"
                                      >
                                        <span>{collection.patientName}:</span>
                                        <span>₹{collection.amount}</span>
                                      </div>
                                    )
                                  )
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
                                      expense.totalCollections -
                                        expense.totalExpenses >=
                                      0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  >
                                    ₹
                                    {expense.totalCollections -
                                      expense.totalExpenses}
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
    </div>
  );
}
