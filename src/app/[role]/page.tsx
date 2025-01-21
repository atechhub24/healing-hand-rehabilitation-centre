"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Users,
  DollarSign,
  Clock,
  FileText,
  TestTube,
} from "lucide-react";

type DashboardCard = {
  title: string;
  value: string;
  change?: {
    value: string;
    trend: "up" | "down";
  };
  description: string;
  icon: any;
};

type RecentActivity = {
  id: string;
  title: string;
  time: string;
  description: string;
};

const roleBasedCards: Record<string, DashboardCard[]> = {
  admin: [
    {
      title: "Total Users",
      value: "1,234",
      change: { value: "+12.5%", trend: "up" },
      description: "Active users in the system",
      icon: Users,
    },
    {
      title: "Appointments",
      value: "156",
      change: { value: "+8.2%", trend: "up" },
      description: "Scheduled today",
      icon: Calendar,
    },
    {
      title: "Revenue",
      value: "$12,345",
      change: { value: "-2.4%", trend: "down" },
      description: "This month",
      icon: DollarSign,
    },
  ],
  doctor: [
    {
      title: "Today's Appointments",
      value: "8",
      change: { value: "+2", trend: "up" },
      description: "Scheduled appointments",
      icon: Calendar,
    },
    {
      title: "Patients",
      value: "45",
      change: { value: "+5", trend: "up" },
      description: "Under your care",
      icon: Users,
    },
    {
      title: "Average Time",
      value: "25min",
      description: "Per consultation",
      icon: Clock,
    },
  ],
  paramedic: [
    {
      title: "Emergency Calls",
      value: "5",
      change: { value: "-2", trend: "down" },
      description: "Pending responses",
      icon: Activity,
    },
    {
      title: "Patients Attended",
      value: "12",
      description: "Today",
      icon: Users,
    },
    {
      title: "Response Time",
      value: "8.5min",
      change: { value: "-1.2min", trend: "up" },
      description: "Average",
      icon: Clock,
    },
  ],
  lab: [
    {
      title: "Pending Tests",
      value: "12",
      change: { value: "+3", trend: "up" },
      description: "Awaiting processing",
      icon: TestTube,
    },
    {
      title: "Completed Tests",
      value: "89",
      description: "This week",
      icon: FileText,
    },
    {
      title: "Revenue",
      value: "$5,678",
      change: { value: "+15.3%", trend: "up" },
      description: "This month",
      icon: DollarSign,
    },
  ],
  customer: [
    {
      title: "Upcoming Appointments",
      value: "2",
      description: "Next 7 days",
      icon: Calendar,
    },
    {
      title: "Test Results",
      value: "3",
      change: { value: "+1", trend: "up" },
      description: "Pending review",
      icon: TestTube,
    },
    {
      title: "Prescriptions",
      value: "5",
      description: "Active medications",
      icon: FileText,
    },
  ],
};

const recentActivities: Record<string, RecentActivity[]> = {
  admin: [
    {
      id: "1",
      title: "New Doctor Registration",
      time: "2 hours ago",
      description: "Dr. Sarah Johnson completed registration",
    },
    {
      id: "2",
      title: "System Update",
      time: "5 hours ago",
      description: "Successfully deployed version 2.1.0",
    },
  ],
  doctor: [
    {
      id: "1",
      title: "New Appointment",
      time: "1 hour ago",
      description: "Patient John Doe scheduled for 3:00 PM",
    },
    {
      id: "2",
      title: "Prescription Updated",
      time: "3 hours ago",
      description: "Updated medication for Patient ID #12345",
    },
  ],
  // Add activities for other roles...
};

function DashboardCard({
  title,
  value,
  change,
  description,
  icon: Icon,
}: DashboardCard) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change && (
              <span
                className={`inline-flex items-center gap-1 text-sm font-medium ${
                  change.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {change.value}
                {change.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="rounded-lg bg-gray-100 p-3">
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
}

function RecentActivityCard({ activities }: { activities: RecentActivity[] }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <div className="relative">
              <div className="h-3 w-3 rounded-full bg-blue-600" />
              <div className="absolute top-3 bottom-0 left-1.5 w-px bg-gray-200" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
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
      <div>
        <h2 className="text-lg font-medium text-gray-800">Overview</h2>
        <p className="text-sm text-gray-500">Here's what's happening today</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roleBasedCards[currentRole].map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>

      {recentActivities[currentRole] && (
        <div className="mt-8">
          <RecentActivityCard activities={recentActivities[currentRole]} />
        </div>
      )}
    </div>
  );
}
