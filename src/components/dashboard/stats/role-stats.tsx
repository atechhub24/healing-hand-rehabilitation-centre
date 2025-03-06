"use client";

import { useCallback } from "react";
import {
  Activity,
  Calendar,
  Users,
  Clock,
  FileText,
  TestTube,
  UserPlus,
} from "lucide-react";
import StatCard, { DashboardCard } from "./stat-card";
import useFetch from "@/lib/hooks/use-fetch";
import { Patient } from "@/types/patient";

interface Staff {
  id: string;
  name: string;
  role: string;
  status: string;
}

interface RoleStatsProps {
  role: string;
  onError?: (message: string) => void;
}

export default function RoleStats({ role, onError }: RoleStatsProps) {
  // Fetch patients data
  const [patients] = useFetch<Patient[]>("patients");

  // Fetch staff data
  const [staff] = useFetch<Staff[]>("staff");

  // Calculate active patients (patients with status "active")
  const activePatients = useCallback(() => {
    if (!patients) return 0;
    return patients.filter((patient) => patient.status === "active").length;
  }, [patients]);

  // Get total patients count
  const totalPatients = patients?.length || 0;

  // Get total staff count
  const totalStaff = staff?.length || 0;

  // Define role-based cards with dynamic data
  const roleBasedCards: Record<string, DashboardCard[]> = {
    admin: [
      {
        title: "Total Patients",
        value: totalPatients.toString(),
        description: "Registered patients",
        icon: Users,
        action: {
          label: "Add Patient",
          href: `/${role}/patients/add`,
          icon: UserPlus,
        },
      },
      {
        title: "Active Patients",
        value: activePatients().toString(),
        description: "Currently active patients",
        icon: Activity,
      },
      {
        title: "Total Staff",
        value: totalStaff.toString(),
        description: "Medical staff members",
        icon: Users,
      },
    ],
    doctor: [
      {
        title: "Total Patients",
        value: totalPatients.toString(),
        description: "Under your care",
        icon: Users,
        action: {
          label: "Add Patient",
          href: `/${role}/patients/add`,
          icon: UserPlus,
        },
      },
      {
        title: "Active Patients",
        value: activePatients().toString(),
        description: "Currently active patients",
        icon: Activity,
      },
      {
        title: "Today's Appointments",
        value: "0",
        description: "Scheduled appointments",
        icon: Calendar,
      },
    ],
    paramedic: [
      {
        title: "Total Patients",
        value: totalPatients.toString(),
        description: "In the system",
        icon: Users,
        action: {
          label: "Add Patient",
          href: `/${role}/patients/add`,
          icon: UserPlus,
        },
      },
      {
        title: "Active Cases",
        value: activePatients().toString(),
        description: "Currently active cases",
        icon: Activity,
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
        title: "Total Patients",
        value: totalPatients.toString(),
        description: "In the system",
        icon: Users,
      },
      {
        title: "Pending Tests",
        value: "0",
        description: "Tests to be processed",
        icon: TestTube,
      },
      {
        title: "Reports",
        value: "0",
        description: "Ready for delivery",
        icon: FileText,
      },
    ],
    patient: [
      {
        title: "Appointments",
        value: "0",
        description: "Upcoming appointments",
        icon: Calendar,
      },
      {
        title: "Test Results",
        value: "0",
        description: "Pending results",
        icon: TestTube,
      },
      {
        title: "Prescriptions",
        value: "0",
        description: "Active prescriptions",
        icon: FileText,
      },
    ],
  };

  const cards = roleBasedCards[role] || [];

  if (cards.length === 0) {
    onError?.("Invalid role or no stats available");
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <StatCard key={card.title + index} card={card} />
      ))}
    </div>
  );
}
