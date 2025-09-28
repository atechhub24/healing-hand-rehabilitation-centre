"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/types/expense";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Filter,
  PieChart,
  Plus,
  TrendingUp
} from "lucide-react";
import { useParams } from "next/navigation";

// Mock data - In real implementation, this would come from your database
const mockExpenseData = {
  totalExpenses: 285000,
  monthlyChange: 12.5,
  categoryTotals: {
    canteen: 35000,
    ambulance: 45000, 
    external: 25000,
    medicine_supply: 65000,
    equipment: 40000,
    utilities: 18000,
    maintenance: 22000,
    staff_salary: 150000,
    office_supplies: 8000,
    fuel: 15000,
    consultation: 12000,
    marketing: 5000,
    training: 8000,
    insurance: 15000,
    rent: 25000,
    other: 7000
  },
  monthlyTrends: [
    { month: "Jan", total: 265000 },
    { month: "Feb", total: 278000 },
    { month: "Mar", total: 285000 },
    { month: "Apr", total: 292000 },
    { month: "May", total: 285000 },
    { month: "Jun", total: 285000 }
  ]
};

export default function ExpensesPage() {
  const { role } = useParams();

  // Only allow admin access
  if (role !== "admin") {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600">Only admin users can access expense tracking.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getCategoryInfo = (category: ExpenseCategory) => {
    return EXPENSE_CATEGORIES.find(cat => cat.value === category) || EXPENSE_CATEGORIES[0];
  };

  const calculatePercentage = (amount: number, total: number) => {
    return ((amount / total) * 100).toFixed(1);
  };

  const sortedCategories = Object.entries(mockExpenseData.categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: calculatePercentage(amount, mockExpenseData.totalExpenses)
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Tracker</h1>
          <p className="text-muted-foreground">
            Comprehensive view of all clinic expenses by category
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{mockExpenseData.totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{mockExpenseData.monthlyChange}%</span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Category</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Staff Salary</div>
            <p className="text-xs text-muted-foreground">
              ₹{mockExpenseData.categoryTotals.staff_salary.toLocaleString()} (52.6%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(mockExpenseData.categoryTotals).length}</div>
            <p className="text-xs text-muted-foreground">
              Categories with expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{mockExpenseData.totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current month total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Spending Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Top Spending Categories</CardTitle>
                <CardDescription>Highest expense categories this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedCategories.slice(0, 6).map(({ category, amount, percentage }) => {
                    const categoryInfo = getCategoryInfo(category);
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{categoryInfo.icon}</span>
                          <div>
                            <div className="font-medium">{categoryInfo.label}</div>
                            <div className="text-sm text-muted-foreground">{percentage}% of total</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{amount.toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Statistics</CardTitle>
                <CardDescription>Key expense insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>🚑 Ambulance Total</span>
                    <span className="font-semibold">₹{mockExpenseData.categoryTotals.ambulance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>🍽️ Canteen Total</span>
                    <span className="font-semibold">₹{mockExpenseData.categoryTotals.canteen.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>🏢 External Services</span>
                    <span className="font-semibold">₹{mockExpenseData.categoryTotals.external.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>💊 Medicine Supply</span>
                    <span className="font-semibold">₹{mockExpenseData.categoryTotals.medicine_supply.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>⛽ Fuel & Transport</span>
                    <span className="font-semibold">₹{mockExpenseData.categoryTotals.fuel.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Expense Categories</CardTitle>
              <CardDescription>Complete breakdown of expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedCategories.map(({ category, amount, percentage }) => {
                  const categoryInfo = getCategoryInfo(category);
                  return (
                    <Card key={category} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{categoryInfo.icon}</span>
                          <Badge className={categoryInfo.color}>
                            {percentage}%
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-1">{categoryInfo.label}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {categoryInfo.description}
                        </p>
                        <div className="text-xl font-bold">
                          ₹{amount.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expense Trends</CardTitle>
              <CardDescription>Expense patterns over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockExpenseData.monthlyTrends.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-2 rounded border">
                    <span className="font-medium">{month.month} 2024</span>
                    <span className="font-semibold">₹{month.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}