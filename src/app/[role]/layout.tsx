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
} from "lucide-react";

const roleConfig = {
  admin: {
    title: "Admin Dashboard",
    menuItems: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      { label: "User Management", icon: Users, href: "/admin/users" },
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm">
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
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

          {/* Sidebar Footer */}
          <div className="border-t p-4">
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
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
