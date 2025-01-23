import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Settings,
  FileText,
  Activity,
  TestTube,
  Bell,
  Stethoscope,
  UserCog,
  Microscope,
} from "lucide-react";

// Configuration object that defines the navigation menu and title for each role
// This helps in maintaining role-based UI elements in one place
export const roleConfig = {
  admin: {
    title: "Admin Dashboard",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      { label: "User Management", icon: Users, href: "/admin/users" },
      { label: "Doctors", icon: Stethoscope, href: "/admin/manage/doctors" },
      { label: "Paramedics", icon: UserCog, href: "/admin/manage/paramedics" },
      {
        label: "Laboratories",
        icon: Microscope,
        href: "/admin/manage/laboratories",
      },
      { label: "Analytics", icon: Activity, href: "/admin/analytics" },
      { label: "Settings", icon: Settings, href: "/admin/settings" },
    ],
  },
  doctor: {
    title: "Doctor Dashboard",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/doctor" },
      { label: "Appointments", icon: Calendar, href: "/doctor/appointments" },
      { label: "Patients", icon: Users, href: "/doctor/patients" },
      { label: "Prescriptions", icon: FileText, href: "/doctor/prescriptions" },
      { label: "Settings", icon: Settings, href: "/doctor/settings" },
    ],
  },
  paramedic: {
    title: "Paramedic Dashboard",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/paramedic" },
      {
        label: "Emergency Calls",
        icon: Bell,
        href: "/paramedic/emergency-calls",
      },
      { label: "Patients", icon: Users, href: "/paramedic/patients" },
      { label: "Reports", icon: FileText, href: "/paramedic/reports" },
      { label: "Settings", icon: Settings, href: "/paramedic/settings" },
    ],
  },
  lab: {
    title: "Laboratory Dashboard",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/lab" },
      { label: "Test Orders", icon: TestTube, href: "/lab/test-orders" },
      { label: "Reports", icon: FileText, href: "/lab/reports" },
      { label: "Inventory", icon: ClipboardList, href: "/lab/inventory" },
      { label: "Settings", icon: Settings, href: "/lab/settings" },
    ],
  },
  customer: {
    title: "Patient Dashboard",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/customer" },
      {
        label: "Appointments",
        icon: Calendar,
        href: "/customer/appointments",
      },
      {
        label: "Medical Records",
        icon: FileText,
        href: "/customer/medical-records",
      },
      {
        label: "Test Results",
        icon: TestTube,
        href: "/customer/test-results",
      },
      { label: "Settings", icon: Settings, href: "/customer/settings" },
    ],
  },
} as const;
