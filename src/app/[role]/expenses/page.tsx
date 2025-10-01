"use client";

import { useState, useCallback } from "react";
import { ExpenseList } from "@/components/expenses/expense-list";
import { AddExpenseButton } from "@/components/expenses/add-expense-button";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker"; // Import DateRange type

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [expenseType, setExpenseType] = useState<string>("");
  const [amountRange, setAmountRange] = useState<
    { from?: number; to?: number } | undefined
  >();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Transform DateRange to the format expected by ExpenseList
  const transformedDateRange =
    dateRange?.from && dateRange.to
      ? { from: dateRange.from, to: dateRange.to }
      : undefined;

  // Transform amount range to the format expected by ExpenseList
  const transformedAmountRange =
    amountRange?.from !== undefined && amountRange?.to !== undefined
      ? { from: amountRange.from, to: amountRange.to }
      : undefined;

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Expenses</h2>
              <p className="text-sm text-gray-500">
                Track and manage your expenses
              </p>
            </div>
            <div className="flex gap-2">
              <AddExpenseButton onExpenseAdded={() => {}} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search expenses..."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div>
              <DateRangePicker onUpdate={({ range }) => setDateRange(range)} />
            </div>
            <div>
              <Select onValueChange={setExpenseType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="grocery">Grocery</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min amount"
                  onChange={(e) =>
                    setAmountRange((prev) => ({
                      ...prev,
                      from: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Max amount"
                  onChange={(e) =>
                    setAmountRange((prev) => ({
                      ...prev,
                      to: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ExpenseList
        searchQuery={searchQuery}
        dateRange={transformedDateRange}
        expenseType={expenseType}
        amountRange={transformedAmountRange}
      />
    </div>
  );
}
