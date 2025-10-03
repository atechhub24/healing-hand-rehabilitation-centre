"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, DollarSign, PieChart } from "lucide-react";
import { useMemo } from "react";
import { Expense } from "@/types/expense";
import { formatCurrency } from "@ashirbad/js-core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface ExpenseAnalyticsProps {
  expenses: Expense[] | null;
}

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

export function ExpenseAnalytics({ expenses }: ExpenseAnalyticsProps) {
  // Calculate analytics data
  const analyticsData = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        monthlyTotals: {},
        yearlyTotals: {},
        totalExpenses: 0,
        expenseByType: {},
        monthlyChartData: [],
        yearlyChartData: [],
        typeChartData: [],
      };
    }

    const monthlyTotals: Record<string, number> = {};
    const yearlyTotals: Record<string, number> = {};
    const expenseByType: Record<string, number> = {};
    let totalExpenses = 0;

    expenses.forEach((expense) => {
      if (expense.amount) {
        totalExpenses += expense.amount;

        // Extract year and month from the date (format: YYYY-MM-DD)
        const date = new Date(expense.date);
        const year = date.getFullYear().toString();
        const month = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`; // YYYY-MM

        // Update monthly totals
        if (monthlyTotals[month]) {
          monthlyTotals[month] += expense.amount;
        } else {
          monthlyTotals[month] = expense.amount;
        }

        // Update yearly totals
        if (yearlyTotals[year]) {
          yearlyTotals[year] += expense.amount;
        } else {
          yearlyTotals[year] = expense.amount;
        }

        // Update expense by type
        if (expense.type) {
          if (expenseByType[expense.type]) {
            expenseByType[expense.type] += expense.amount;
          } else {
            expenseByType[expense.type] = expense.amount;
          }
        }
      }
    });

    // Prepare chart data
    const monthlyChartData = Object.entries(monthlyTotals)
      .map(([month, total]) => ({
        month,
        total,
        name: new Date(month + "-01").toLocaleString("default", {
          month: "short",
          year: "2-digit",
        }),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const yearlyChartData = Object.entries(yearlyTotals)
      .map(([year, total]) => ({
        year,
        total,
      }))
      .sort((a, b) => a.year.localeCompare(b.year));

    const typeChartData = Object.entries(expenseByType).map(
      ([type, total], index) => ({
        type,
        total,
        name: type,
        value: total,
        color: COLORS[index % COLORS.length],
      })
    );

    return {
      monthlyTotals,
      yearlyTotals,
      totalExpenses,
      expenseByType,
      monthlyChartData,
      yearlyChartData,
      typeChartData,
    };
  }, [expenses]);

  // Get current month and year totals
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const currentYear = new Date().getFullYear().toString();
  const currentMonthTotal = analyticsData.monthlyTotals[currentMonth] || 0;
  const currentYearTotal = analyticsData.yearlyTotals[currentYear] || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Expenses Card */}
      <Card className="md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(analyticsData.totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground">All time total</p>
        </CardContent>
      </Card>

      {/* This Month Card */}
      <Card className="md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(currentMonthTotal)}
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(currentMonth + "-01").toLocaleString("default", {
              month: "long",
            })}
          </p>
        </CardContent>
      </Card>

      {/* This Year Card */}
      <Card className="md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Year</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(currentYearTotal)}
          </div>
          <p className="text-xs text-muted-foreground">{currentYear}</p>
        </CardContent>
      </Card>

      {/* Expense Types Card */}
      <Card className="md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Object.keys(analyticsData.expenseByType).length}
          </div>
          <p className="text-xs text-muted-foreground">Expense types</p>
        </CardContent>
      </Card>

      {/* Monthly Trend Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Expense Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.monthlyChartData}>
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
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar
                  dataKey="total"
                  name="Expense Amount"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Expense by Type Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Expenses by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {analyticsData.typeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={analyticsData.typeChartData}
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
                    {analyticsData.typeChartData.map((entry, index) => (
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
                No category data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
