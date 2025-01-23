import {
  Activity,
  Calendar,
  Users,
  DollarSign,
  Clock,
  FileText,
  TestTube,
} from "lucide-react";
import StatCard, { DashboardCard } from "./stat-card";

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
      value: "3",
      description: "Active emergency calls",
      icon: Activity,
    },
    {
      title: "Patients Attended",
      value: "12",
      change: { value: "+2", trend: "up" },
      description: "Today",
      icon: Users,
    },
    {
      title: "Response Time",
      value: "8min",
      description: "Average response time",
      icon: Clock,
    },
  ],
  lab: [
    {
      title: "Test Orders",
      value: "24",
      change: { value: "+4", trend: "up" },
      description: "Pending tests",
      icon: TestTube,
    },
    {
      title: "Reports",
      value: "18",
      description: "Ready for delivery",
      icon: FileText,
    },
    {
      title: "Processing Time",
      value: "45min",
      description: "Average processing time",
      icon: Clock,
    },
  ],
  customer: [
    {
      title: "Appointments",
      value: "2",
      description: "Upcoming appointments",
      icon: Calendar,
    },
    {
      title: "Test Results",
      value: "3",
      description: "Pending results",
      icon: TestTube,
    },
    {
      title: "Prescriptions",
      value: "5",
      description: "Active prescriptions",
      icon: FileText,
    },
  ],
};

export default function RoleStats({ role }: { role: string }) {
  const cards = roleBasedCards[role] || [];

  if (cards.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <StatCard key={card.title + index} card={card} />
      ))}
    </div>
  );
}
