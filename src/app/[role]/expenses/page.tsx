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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<string>("list");
  const { role } = useAuth();
  const [staffList] = useFetch<UserData[]>("users");
  const [expenses] = useFetch<Expense[]>("expenses");
  const [layout, setLayout] = useState("3");

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

  // Determine tabs to show based on role
  const showAnalyticsTab = role === "admin";
  const tabCols = showAnalyticsTab ? "grid-cols-2" : "grid-cols-1";

  // Function to generate and download expense report
  const downloadExpenseReport = () => {
    if (!expenses) return;

    // Filter expenses based on current filters
    let filteredExpenses = [...expenses];

    // Apply search filter
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filteredExpenses = filteredExpenses.filter(
        (expense) =>
          expense.description?.toLowerCase().includes(lowercaseQuery) ||
          expense.type?.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Apply date range filter
    if (transformedDateRange?.from && transformedDateRange?.to) {
      const startDate = new Date(transformedDateRange.from);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(transformedDateRange.to);
      endDate.setHours(23, 59, 59, 999);

      filteredExpenses = filteredExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
      });
    }

    // Apply expense type filter
    if (expenseType && expenseType !== "all") {
      filteredExpenses = filteredExpenses.filter(
        (expense) => expense.type === expenseType
      );
    }

    // Apply amount range filter
    if (amountRange) {
      if (amountRange.from !== undefined && amountRange.to !== undefined) {
        filteredExpenses = filteredExpenses.filter(
          (expense) =>
            expense.amount >= (amountRange.from as number) &&
            expense.amount <= (amountRange.to as number)
        );
      } else if (amountRange.from !== undefined) {
        filteredExpenses = filteredExpenses.filter(
          (expense) => expense.amount >= (amountRange.from as number)
        );
      } else if (amountRange.to !== undefined) {
        filteredExpenses = filteredExpenses.filter(
          (expense) => expense.amount <= (amountRange.to as number)
        );
      }
    }

    // Apply staff filter (admin only)
    if (role === "admin" && selectedStaff && selectedStaff !== "all") {
      filteredExpenses = filteredExpenses.filter(
        (expense) => expense.createdBy === selectedStaff
      );
    }

    // Generate CSV content
    const headers = ["Date", "Type", "Amount", "Description", "Created By"];

    const csvContent = [
      headers.join(","),
      ...filteredExpenses.map((expense) =>
        [
          expense.date,
          expense.type,
          expense.amount,
          `"${expense.description || ""}"`,
          expense.creatorName || expense.createdBy || "",
        ].join(",")
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `expense-report-${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <Select value={layout} onValueChange={setLayout}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">List</SelectItem>
                  <SelectItem value="2">Grid (2x2)</SelectItem>
                  <SelectItem value="3">Grid (3x3)</SelectItem>
                  <SelectItem value="4">Grid (4x4)</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={downloadExpenseReport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
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
              <Select
                value={expenseType || "all"}
                onValueChange={setExpenseType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="meals-refreshments">
                    Meals & Refreshments
                  </SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="medical-supplies">
                    Medical Supplies
                  </SelectItem>
                  <SelectItem value="office-supplies">
                    Office Supplies
                  </SelectItem>
                  <SelectItem value="client-patient-related">
                    Client & Patient Related
                  </SelectItem>
                  <SelectItem value="travel-accommodation">
                    Travel & Accommodation
                  </SelectItem>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${tabCols}`}>
          <TabsTrigger value="list">Expense List</TabsTrigger>
          {showAnalyticsTab && (
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="list" className="mt-6">
          <ExpenseList
            searchQuery={searchQuery}
            dateRange={transformedDateRange}
            expenseType={expenseType}
            amountRange={transformedAmountRange}
            createdBy={selectedStaff || undefined}
            gridCols={parseInt(layout, 10)}
          />
        </TabsContent>
        {showAnalyticsTab && (
          <TabsContent value="analytics" className="mt-6">
            <ExpenseAnalytics expenses={expenses} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
