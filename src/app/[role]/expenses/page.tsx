"use client";

import { AddExpenseButton } from "@/components/expenses/add-expense-button";
import { ExpenseAnalytics } from "@/components/expenses/expense-analytics";
import { ExpenseList } from "@/components/expenses/expense-list";
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
import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import { UserData } from "@/types";
import { Expense } from "@/types/expense";
import { useState } from "react";
import { DateRange } from "react-day-picker"; // Import DateRange type

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [expenseType, setExpenseType] = useState<string>("");
  const [amountRange, setAmountRange] = useState<
    { from?: number; to?: number } | undefined
  >();
  const [selectedStaff, setSelectedStaff] = useState<string>("all");
  const { role } = useAuth();
  const [staffList] = useFetch<UserData[]>("users");
  const [expenses] = useFetch<Expense[]>("expenses");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Transform DateRange to the format expected by ExpenseList
  const transformedDateRange = 
    dateRange?.from && dateRange?.to 
      ? { from: dateRange.from, to: dateRange.to } 
      : undefined;

  // Transform amount range to the format expected by ExpenseList
  const transformedAmountRange = amountRange;

  // Filter staff members based on the current user's role
  const filteredStaffList = staffList?.filter(
    (staff) =>
      staff.role === "staff" ||
      staff.role === "paramedic" ||
      staff.role === "doctor"
  );

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
            {/* Show staff filter only for admin role */}
            {role === "admin" && (
              <div>
                <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by staff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Staff</SelectItem>
                    {filteredStaffList?.map((staff) => (
                      <SelectItem key={staff.uid} value={staff.uid}>
                        {staff.name || staff.email || "Unnamed"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Select value={expenseType || "all"} onValueChange={setExpenseType}>
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

      {/* Analytics - only show if user is admin */}
      {role === "admin" && <ExpenseAnalytics expenses={expenses} />}

      <ExpenseList
        searchQuery={searchQuery}
        dateRange={transformedDateRange}
        expenseType={expenseType}
        amountRange={transformedAmountRange}
        createdBy={selectedStaff || undefined}
      />
    </div>
  );
}
