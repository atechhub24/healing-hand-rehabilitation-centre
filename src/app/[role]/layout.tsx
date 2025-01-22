"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  LogOut,
  Search,
  User,
  Stethoscope,
  UserCog,
  Microscope,
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

const roleConfig = {
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
      { label: "Settings", icon: Settings, href: "/settings" },
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
};

export default function RoleBasedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const { user, role, signOut } = useAuth();
  const currentRole = params.role as keyof typeof roleConfig;

  useEffect(() => {
    // Redirect if user is not authenticated or role doesn't match
    if (!user || !role || role !== currentRole) {
      router.replace("/auth/login");
    }
  }, [user, role, currentRole, router]);

  if (!user || !role || !roleConfig[currentRole]) {
    return null;
  }

  const { title, menuItems } = roleConfig[currentRole];

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">H+</span>
            </div>
            <span className="font-semibold text-gray-900">Healthcare+</span>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.email || user.phoneNumber}
                </p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
