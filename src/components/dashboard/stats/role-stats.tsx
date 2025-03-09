"use client";

import useFetch from "@/lib/hooks/use-fetch";
import { Patient } from "@/types/patient";
import { Activity, UserPlus, Users } from "lucide-react";
import { useCallback } from "react";
import StatCard, { DashboardCard } from "./stat-card";

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

    staff: [
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
