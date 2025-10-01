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

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [expenseType, setExpenseType] = useState<string>("");
  const [amountRange, setAmountRange] = useState<{ from: number; to: number } | undefined>();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

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
            <Input
              placeholder="Search expenses..."
              onChange={(e) => handleSearch(e.target.value)}
            />
            <DateRangePicker
              onUpdate={({ range }) => setDateRange(range)}
            />
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
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min amount"
                onChange={(e) =>
                  setAmountRange((prev) => ({
                    ...prev,
                    from: Number(e.target.value),
                  }))
                }
              />
              <Input
                type="number"
                placeholder="Max amount"
                onChange={(e) =>
                  setAmountRange((prev) => ({
                    ...prev,
                    to: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <ExpenseList
        searchQuery={searchQuery}
        dateRange={dateRange}
        expenseType={expenseType}
        amountRange={amountRange}
      />
    </div>
  );
}
