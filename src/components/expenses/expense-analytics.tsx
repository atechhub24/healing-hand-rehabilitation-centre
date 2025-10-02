"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Expense } from "@/types/expense";
import { formatCurrency } from "@ashirbad/js-core";

interface ExpenseAnalyticsProps {
  expenses: Expense[] | null;
}

export function ExpenseAnalytics({ expenses }: ExpenseAnalyticsProps) {
  // Calculate monthwise and yearwise totals
  const { monthlyTotals, yearlyTotals, totalExpenses } = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return { monthlyTotals: {}, yearlyTotals: {}, totalExpenses: 0 };
    }

    const monthlyTotals: Record<string, number> = {};
    const yearlyTotals: Record<string, number> = {};
    let totalExpenses = 0;

    expenses.forEach(expense => {
      if (expense.amount) {
        totalExpenses += expense.amount;
        
        // Extract year and month from the date (format: YYYY-MM-DD)
        const date = new Date(expense.date);
        const year = date.getFullYear().toString();
        const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // YYYY-MM
        
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
      }
    });

    return { monthlyTotals, yearlyTotals, totalExpenses };
  }, [expenses]);

  // Get current month and year totals
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const currentYear = new Date().getFullYear().toString();
  const currentMonthTotal = monthlyTotals[currentMonth] || 0;
  const currentYearTotal = yearlyTotals[currentYear] || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">All time total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(currentMonthTotal)}</div>
          <p className="text-xs text-muted-foreground">
            {currentMonth} ({Object.keys(monthlyTotals).length} months tracked)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Year</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(currentYearTotal)}</div>
          <p className="text-xs text-muted-foreground">
            {currentYear} ({Object.keys(yearlyTotals).length} years tracked)
          </p>
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {Object.entries(monthlyTotals)
              .sort(([a], [b]) => b.localeCompare(a)) // Sort by date descending
              .map(([month, total]) => (
                <div key={month} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="font-medium">{new Date(month + "-01").toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                  <div>
                    <span className="font-semibold">{formatCurrency(total)}</span>
                    {month === currentMonth && (
                      <Badge variant="secondary" className="ml-2">Current</Badge>
                    )}
                  </div>
                </div>
              ))}
            {Object.keys(monthlyTotals).length === 0 && (
              <p className="text-muted-foreground text-center py-4">No monthly expense data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Yearly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Yearly Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {Object.entries(yearlyTotals)
              .sort(([a], [b]) => b.localeCompare(a)) // Sort by year descending
              .map(([year, total]) => (
                <div key={year} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="font-medium">{year}</span>
                  <div>
                    <span className="font-semibold">{formatCurrency(total)}</span>
                    {year === currentYear && (
                      <Badge variant="secondary" className="ml-2">Current</Badge>
                    )}
                  </div>
                </div>
              ))}
            {Object.keys(yearlyTotals).length === 0 && (
              <p className="text-muted-foreground text-center py-4">No yearly expense data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}