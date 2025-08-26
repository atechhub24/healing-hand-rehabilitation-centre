import {
  Dumbbell,
  LayoutDashboard,
  Scale,
  Settings,
  Users,
  FileSpreadsheet,
  Pill,
} from "lucide-react";

// Configuration object that defines the navigation menu and title for each role
// This helps in maintaining role-based UI elements in one place
export const roleConfig = {
  admin: {
    title: "Admin Dashboard",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      {
        label: "Prescriptions",
        icon: FileSpreadsheet,
        href: "/admin/prescriptions",
      },
      {
        label: "Medications",
        icon: Pill,
        href: "/admin/medications",
      },
      { label: "Patients", icon: Users, href: "/admin/patients" },
      {
        label: "BMI Calculator",
        icon: Scale,
        href: "/admin/bmi-calculator",
      },
      {
        label: "TDEE Calculator",
        icon: Dumbbell,
        href: "/admin/tdee-calculator",
      },
      { label: "Settings", icon: Settings, href: "/admin/settings" },
    ],
  },
  staff: {
    title: "Admin Dashboard",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/staff" },
      { label: "Patients", icon: Users, href: "/staff/patients" },
      {
        label: "BMI Calculator",
        icon: Scale,
        href: "/staff/bmi-calculator",
      },
      {
        label: "TDEE Calculator",
        icon: Dumbbell,
        href: "/staff/tdee-calculator",
      },
      { label: "Settings", icon: Settings, href: "/staff/settings" },
    ],
  },
} as const;
