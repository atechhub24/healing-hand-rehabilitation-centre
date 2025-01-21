"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Activity, TrendingUp, Users, DollarSign } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface AnalyticsData {
  revenue: {
    total: string;
    growth: string;
    data: number[];
  };
  users: {
    total: string;
    growth: string;
    data: number[];
  };
  appointments: {
    total: string;
    growth: string;
    data: number[];
  };
}

const analyticsData: AnalyticsData = {
  revenue: {
    total: "$45,678",
    growth: "+12.5%",
    data: [4500, 5000, 4800, 5200, 5500, 6000, 5800],
  },
  users: {
    total: "1,234",
    growth: "+8.2%",
    data: [1000, 1050, 1100, 1150, 1200, 1250, 1234],
  },
  appointments: {
    total: "456",
    growth: "+15.3%",
    data: [350, 380, 400, 420, 440, 450, 456],
  },
};

interface AnalyticsCardProps {
  title: string;
  value: string;
  growth: string;
  icon: LucideIcon;
}

function AnalyticsCard({
  title,
  value,
  growth,
  icon: Icon,
}: AnalyticsCardProps) {
  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <span className="text-sm font-medium text-green-600">{growth}</span>
          </div>
        </div>
        <div className="rounded-lg bg-gray-100 p-3">
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const params = useParams();
  const { role } = useAuth();

  if (role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500">
          Track key metrics and performance indicators
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnalyticsCard
          title="Total Revenue"
          value={analyticsData.revenue.total}
          growth={analyticsData.revenue.growth}
          icon={DollarSign}
        />
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.users.total}
          growth={analyticsData.users.growth}
          icon={Users}
        />
        <AnalyticsCard
          title="Total Appointments"
          value={analyticsData.appointments.total}
          growth={analyticsData.appointments.growth}
          icon={Activity}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Trend
          </h3>
          <div className="h-[300px] flex items-end justify-between gap-2">
            {analyticsData.revenue.data.map((value, index) => (
              <div
                key={index}
                className="w-full bg-blue-100 rounded-t"
                style={{
                  height: `${(value / 6000) * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Growth
          </h3>
          <div className="h-[300px] flex items-end justify-between gap-2">
            {analyticsData.users.data.map((value, index) => (
              <div
                key={index}
                className="w-full bg-green-100 rounded-t"
                style={{
                  height: `${(value / 1234) * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
