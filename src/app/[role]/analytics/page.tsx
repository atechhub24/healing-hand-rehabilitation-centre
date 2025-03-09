"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { Users, DollarSign, Calendar, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// Mock data for analytics
const monthlyRevenueData = [
  { name: "Jan", revenue: 4500 },
  { name: "Feb", revenue: 5200 },
  { name: "Mar", revenue: 4800 },
  { name: "Apr", revenue: 5500 },
  { name: "May", revenue: 6200 },
  { name: "Jun", revenue: 5800 },
  { name: "Jul", revenue: 6500 },
  { name: "Aug", revenue: 7200 },
  { name: "Sep", revenue: 6800 },
  { name: "Oct", revenue: 7500 },
  { name: "Nov", revenue: 8200 },
  { name: "Dec", revenue: 9000 },
];

const userGrowthData = [
  { name: "Jan", patients: 120, doctors: 8, paramedics: 15, labs: 5 },
  { name: "Feb", patients: 150, doctors: 10, paramedics: 18, labs: 6 },
  { name: "Mar", patients: 180, doctors: 12, paramedics: 20, labs: 7 },
  { name: "Apr", patients: 220, doctors: 15, paramedics: 22, labs: 8 },
  { name: "May", patients: 280, doctors: 18, paramedics: 25, labs: 10 },
  { name: "Jun", patients: 310, doctors: 20, paramedics: 28, labs: 12 },
];

const appointmentStatusData = [
  { name: "Completed", value: 540, color: "#10b981" },
  { name: "Scheduled", value: 320, color: "#3b82f6" },
  { name: "Cancelled", value: 120, color: "#ef4444" },
];

const specialtyDistributionData = [
  { name: "Cardiology", value: 25 },
  { name: "Orthopedics", value: 20 },
  { name: "Neurology", value: 18 },
  { name: "Pediatrics", value: 15 },
  { name: "Dermatology", value: 12 },
  { name: "Other", value: 10 },
];

const patientSatisfactionData = [
  { name: "Jan", satisfaction: 4.2 },
  { name: "Feb", satisfaction: 4.3 },
  { name: "Mar", satisfaction: 4.1 },
  { name: "Apr", satisfaction: 4.4 },
  { name: "May", satisfaction: 4.6 },
  { name: "Jun", satisfaction: 4.7 },
];

const weekdayAppointmentsData = [
  { name: "Monday", appointments: 85 },
  { name: "Tuesday", appointments: 78 },
  { name: "Wednesday", appointments: 92 },
  { name: "Thursday", appointments: 75 },
  { name: "Friday", appointments: 68 },
  { name: "Saturday", appointments: 120 },
  { name: "Sunday", appointments: 45 },
];

interface AnalyticsData {
  revenue: {
    total: string;
    growth: string;
  };
  users: {
    total: string;
    growth: string;
  };
  appointments: {
    total: string;
    growth: string;
  };
  averageRating: {
    value: string;
    growth: string;
  };
}

const analyticsData: AnalyticsData = {
  revenue: {
    total: "$78,450",
    growth: "+15.3%",
  },
  users: {
    total: "1,234",
    growth: "+8.2%",
  },
  appointments: {
    total: "980",
    growth: "+12.5%",
  },
  averageRating: {
    value: "4.7",
    growth: "+0.3",
  },
};

interface AnalyticsCardProps {
  title: string;
  value: string;
  growth: string;
  icon: LucideIcon;
  description?: string;
}

function AnalyticsCard({
  title,
  value,
  growth,
  icon: Icon,
  description,
}: AnalyticsCardProps) {
  const isPositive = growth.startsWith("+");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1">
          <span
            className={`text-xs ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {growth}
          </span>
          {description && (
            <span className="text-xs text-muted-foreground ml-2">
              {description}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

export default function AnalyticsPage() {
  const { role } = useAuth();

  if (role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Analytics Dashboard
        </h2>
        <p className="text-muted-foreground">
          Track key metrics and performance indicators for your clinic
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AnalyticsCard
              title="Total Revenue"
              value={analyticsData.revenue.total}
              growth={analyticsData.revenue.growth}
              icon={DollarSign}
              description="vs. last month"
            />
            <AnalyticsCard
              title="Total Users"
              value={analyticsData.users.total}
              growth={analyticsData.users.growth}
              icon={Users}
              description="vs. last month"
            />
            <AnalyticsCard
              title="Total Appointments"
              value={analyticsData.appointments.total}
              growth={analyticsData.appointments.growth}
              icon={Calendar}
              description="vs. last month"
            />
            <AnalyticsCard
              title="Average Rating"
              value={analyticsData.averageRating.value}
              growth={analyticsData.averageRating.growth}
              icon={Star}
              description="vs. last month"
            />
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyRevenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Two Charts Side by Side */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Appointment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appointmentStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {appointmentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Appointments"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* User Growth */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={userGrowthData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="patients" fill="#8884d8" name="Patients" />
                      <Bar dataKey="doctors" fill="#82ca9d" name="Doctors" />
                      <Bar
                        dataKey="paramedics"
                        fill="#ffc658"
                        name="Paramedics"
                      />
                      <Bar dataKey="labs" fill="#ff8042" name="Labs" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyRevenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={userGrowthData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="patients" fill="#8884d8" name="Patients" />
                      <Bar dataKey="doctors" fill="#82ca9d" name="Doctors" />
                      <Bar
                        dataKey="paramedics"
                        fill="#ffc658"
                        name="Paramedics"
                      />
                      <Bar dataKey="labs" fill="#ff8042" name="Labs" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Specialty Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={specialtyDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {specialtyDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Percentage"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appointmentStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {appointmentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Appointments"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointments by Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weekdayAppointmentsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="appointments"
                        fill="#3b82f6"
                        name="Appointments"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Patient Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={patientSatisfactionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip formatter={(value) => [`${value}/5`, "Rating"]} />
                    <Line
                      type="monotone"
                      dataKey="satisfaction"
                      stroke="#10b981"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
