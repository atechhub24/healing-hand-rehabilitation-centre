import {
  Dumbbell,
  LayoutDashboard,
  Scale,
  Settings,
  Users,
  FileSpreadsheet,
  Pill,
  Building2,
  Stethoscope,
  UserCog,
  Clock,
  DollarSign,
  Truck,
  ShoppingCart,
} from "lucide-react";

// Configuration object that defines the navigation menu and title for each role
// This helps in maintaining role-based UI elements in one place
export const roleConfig = {
  admin: {
    title: "Healing Hand Rehabilitation Center",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      {
        label: "Branches",
        icon: Building2,
        href: "/admin/branches",
      },
      {
        label: "Services",
        icon: Stethoscope,
        href: "/admin/services",
      },
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
        label: "Staff Management",
        icon: UserCog,
        href: "/admin/manage/staff",
      },
      {
        label: "Attendance",
        icon: Clock,
        href: "/admin/manage/attendance",
      },
      {
        label: "Expense Tracker",
        icon: DollarSign,
        href: "/admin/expenses",
      },
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
    title: "Staff Dashboard",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/staff" },
      { label: "Attendance", icon: Clock, href: "/staff/attendance" },
      { label: "Expenses", icon: DollarSign, href: "/staff/expenses" },
      { label: "Patients", icon: Users, href: "/staff/patients" },
      {
        label: "Ambulance Service",
        icon: Truck,
        href: "/staff/ambulance-service",
      },
      {
        label: "Pharmacy",
        icon: ShoppingCart,
        href: "/staff/pharmacy",
      },
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
