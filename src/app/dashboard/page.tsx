"use client";

import { useAuthStore } from "@/lib/store/auth-store";

export default function DashboardPage() {
  const { role } = useAuthStore();

  const renderDashboard = () => {
    switch (role) {
      case "admin":
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Total Users"
              value="1,234"
              description="Active users in the system"
            />
            <DashboardCard
              title="Appointments"
              value="156"
              description="Scheduled today"
            />
            <DashboardCard
              title="Revenue"
              value="$12,345"
              description="This month"
            />
          </div>
        );

      case "doctor":
      case "paramedic":
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Today's Appointments"
              value="8"
              description="Scheduled appointments"
            />
            <DashboardCard
              title="Patients"
              value="45"
              description="Under your care"
            />
            <DashboardCard
              title="Reviews"
              value="4.8"
              description="Average rating"
            />
          </div>
        );

      case "lab":
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Pending Tests"
              value="12"
              description="Awaiting processing"
            />
            <DashboardCard
              title="Completed Tests"
              value="89"
              description="This week"
            />
            <DashboardCard
              title="Revenue"
              value="$5,678"
              description="This month"
            />
          </div>
        );

      case "customer":
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Upcoming Appointments"
              value="2"
              description="Next 7 days"
            />
            <DashboardCard
              title="Test Results"
              value="3"
              description="Pending review"
            />
            <DashboardCard
              title="Prescriptions"
              value="5"
              description="Active medications"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-500">Welcome to your healthcare dashboard</p>
      {renderDashboard()}
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}
