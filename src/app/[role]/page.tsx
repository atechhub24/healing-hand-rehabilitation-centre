"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";

type DashboardCard = {
  title: string;
  value: string;
  description: string;
};

const roleBasedCards: Record<string, DashboardCard[]> = {
  admin: [
    {
      title: "Total Users",
      value: "1,234",
      description: "Active users in the system",
    },
    {
      title: "Appointments",
      value: "156",
      description: "Scheduled today",
    },
    {
      title: "Revenue",
      value: "$12,345",
      description: "This month",
    },
  ],
  doctor: [
    {
      title: "Today's Appointments",
      value: "8",
      description: "Scheduled appointments",
    },
    {
      title: "Patients",
      value: "45",
      description: "Under your care",
    },
    {
      title: "Reviews",
      value: "4.8",
      description: "Average rating",
    },
  ],
  paramedic: [
    {
      title: "Emergency Calls",
      value: "5",
      description: "Pending responses",
    },
    {
      title: "Patients Attended",
      value: "12",
      description: "Today",
    },
    {
      title: "Response Time",
      value: "8.5",
      description: "Minutes (average)",
    },
  ],
  lab: [
    {
      title: "Pending Tests",
      value: "12",
      description: "Awaiting processing",
    },
    {
      title: "Completed Tests",
      value: "89",
      description: "This week",
    },
    {
      title: "Revenue",
      value: "$5,678",
      description: "This month",
    },
  ],
  customer: [
    {
      title: "Upcoming Appointments",
      value: "2",
      description: "Next 7 days",
    },
    {
      title: "Test Results",
      value: "3",
      description: "Pending review",
    },
    {
      title: "Prescriptions",
      value: "5",
      description: "Active medications",
    },
  ],
};

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

export default function RoleDashboardPage() {
  const params = useParams();
  const { role } = useAuth();
  const currentRole = params.role as string;

  // Ensure user's role matches the current page role
  if (role !== currentRole || !roleBasedCards[currentRole]) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <p className="text-gray-500">Here's what's happening today</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roleBasedCards[currentRole].map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}
