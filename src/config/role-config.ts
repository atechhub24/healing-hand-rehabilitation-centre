import {
  Activity,
  Bell,
  Calendar,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Microscope,
  Settings,
  Stethoscope,
  TestTube,
  UserCog,
  Users,
  Ambulance,
  BookOpen,
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
      {
        label: "Paramedic Bookings",
        icon: Ambulance,
        href: "/admin/paramedic-booking/bookings",
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
      {
        label: "Request Paramedic",
        icon: Ambulance,
        href: "/doctor/paramedic-booking",
      },
      {
        label: "My Paramedic Bookings",
        icon: BookOpen,
        href: "/doctor/paramedic-booking/bookings",
      },
      { label: "Settings", icon: Settings, href: "/doctor/settings" },
      {
        label: "Slot Management",
        icon: CalendarDays,
        href: "/doctor/slots",
      },
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
      {
        label: "My Bookings",
        icon: BookOpen,
        href: "/paramedic/appointments",
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
      {
        label: "Request Paramedic",
        icon: Ambulance,
        href: "/lab/paramedic-booking",
      },
      {
        label: "My Paramedic Bookings",
        icon: BookOpen,
        href: "/lab/paramedic-booking/bookings",
      },
      { label: "Settings", icon: Settings, href: "/lab/settings" },
    ],
  },
  patient: {
    title: "Patient Dashboard",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/patient" },
      {
        label: "Appointments",
        icon: Calendar,
        href: "/patient/appointments",
      },
      {
        label: "Medical Records",
        icon: FileText,
        href: "/patient/medical-records",
      },
      {
        label: "Test Results",
        icon: TestTube,
        href: "/patient/test-results",
      },
      {
        label: "Book Paramedic",
        icon: Ambulance,
        href: "/patient/paramedic-booking",
      },
      {
        label: "My Paramedic Bookings",
        icon: BookOpen,
        href: "/patient/paramedic-booking/bookings",
      },
      { label: "Settings", icon: Settings, href: "/patient/settings" },
    ],
  },
} as const;
