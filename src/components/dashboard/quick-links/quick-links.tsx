import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  Users,
  Settings,
  ClipboardList,
  Activity,
  TestTube,
  MessageSquare,
  Phone,
  Building2,
  Stethoscope,
  Ambulance,
  TestTubes,
  CalendarPlus,
  FilePlus,
  ChartBar,
  BadgeDollarSign,
  Pill,
  HeartPulse,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickLink {
  title: string;
  href: string;
  icon: React.ElementType;
  color: string;
  isNew?: boolean;
}

const quickLinks: Record<string, QuickLink[]> = {
  admin: [
    {
      title: "Edit Profile",
      href: "/admin/profile/edit",
      icon: UserCog,
      color: "text-blue-500",
    },
    {
      title: "New Doctor",
      href: "/admin/manage/doctors/new",
      icon: Stethoscope,
      color: "text-blue-500",
      isNew: true,
    },
    {
      title: "New Paramedic",
      href: "/admin/manage/paramedics/new",
      icon: Ambulance,
      color: "text-red-500",
      isNew: true,
    },
    {
      title: "New Laboratory",
      href: "/admin/manage/laboratories/new",
      icon: TestTubes,
      color: "text-purple-500",
      isNew: true,
    },
    {
      title: "Manage Staff",
      href: "/admin/manage/staff",
      icon: Users,
      color: "text-emerald-500",
    },
    {
      title: "Departments",
      href: "/admin/departments",
      icon: Building2,
      color: "text-orange-500",
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: ChartBar,
      color: "text-indigo-500",
    },
    {
      title: "Billing",
      href: "/admin/billing",
      icon: BadgeDollarSign,
      color: "text-green-500",
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
      color: "text-gray-500",
    },
  ],
  doctor: [
    {
      title: "Edit Profile",
      href: "/doctor/profile/edit",
      icon: UserCog,
      color: "text-blue-500",
    },
    {
      title: "New Appointment",
      href: "/doctor/appointments/new",
      icon: CalendarPlus,
      color: "text-blue-500",
      isNew: true,
    },
    {
      title: "New Prescription",
      href: "/doctor/prescriptions/new",
      icon: Pill,
      color: "text-purple-500",
      isNew: true,
    },
    {
      title: "Schedule",
      href: "/doctor/schedule",
      icon: Calendar,
      color: "text-emerald-500",
    },
    {
      title: "My Patients",
      href: "/doctor/patients",
      icon: Users,
      color: "text-orange-500",
    },
    {
      title: "Lab Orders",
      href: "/doctor/lab-orders",
      icon: TestTube,
      color: "text-indigo-500",
    },
    {
      title: "Medical Records",
      href: "/doctor/records",
      icon: FileText,
      color: "text-gray-500",
    },
  ],
  paramedic: [
    {
      title: "Edit Profile",
      href: "/paramedic/profile/edit",
      icon: UserCog,
      color: "text-blue-500",
    },
    {
      title: "New Emergency",
      href: "/paramedic/emergency/new",
      icon: HeartPulse,
      color: "text-red-500",
      isNew: true,
    },
    {
      title: "New Report",
      href: "/paramedic/reports/new",
      icon: FilePlus,
      color: "text-blue-500",
      isNew: true,
    },
    {
      title: "Active Calls",
      href: "/paramedic/calls",
      icon: Phone,
      color: "text-emerald-500",
    },
    {
      title: "Patient Records",
      href: "/paramedic/records",
      icon: FileText,
      color: "text-purple-500",
    },
    {
      title: "Team Status",
      href: "/paramedic/team",
      icon: Users,
      color: "text-orange-500",
    },
    {
      title: "Equipment",
      href: "/paramedic/equipment",
      icon: Activity,
      color: "text-indigo-500",
    },
  ],
  lab: [
    {
      title: "Edit Profile",
      href: "/lab/profile/edit",
      icon: UserCog,
      color: "text-blue-500",
    },
    {
      title: "New Test",
      href: "/lab/tests/new",
      icon: TestTube,
      color: "text-purple-500",
      isNew: true,
    },
    {
      title: "New Report",
      href: "/lab/reports/new",
      icon: FilePlus,
      color: "text-blue-500",
      isNew: true,
    },
    {
      title: "Test Orders",
      href: "/lab/orders",
      icon: TestTube,
      color: "text-emerald-500",
    },
    {
      title: "Results",
      href: "/lab/results",
      icon: Activity,
      color: "text-orange-500",
    },
    {
      title: "Inventory",
      href: "/lab/inventory",
      icon: ClipboardList,
      color: "text-indigo-500",
    },
    {
      title: "Analytics",
      href: "/lab/analytics",
      icon: ChartBar,
      color: "text-gray-500",
    },
  ],
  customer: [
    {
      title: "Edit Profile",
      href: "/customer/profile/edit",
      icon: UserCog,
      color: "text-blue-500",
    },
    {
      title: "Book Appointment",
      href: "/customer/appointments/new",
      icon: CalendarPlus,
      color: "text-blue-500",
      isNew: true,
    },
    {
      title: "New Test Request",
      href: "/customer/tests/new",
      icon: TestTubes,
      color: "text-purple-500",
      isNew: true,
    },
    {
      title: "My Appointments",
      href: "/customer/appointments",
      icon: Calendar,
      color: "text-emerald-500",
    },
    {
      title: "Medical Records",
      href: "/customer/records",
      icon: FileText,
      color: "text-orange-500",
    },
    {
      title: "Messages",
      href: "/customer/messages",
      icon: MessageSquare,
      color: "text-indigo-500",
    },
    {
      title: "Billing",
      href: "/customer/billing",
      icon: BadgeDollarSign,
      color: "text-gray-500",
    },
  ],
};

export default function QuickLinks({ role }: { role: string }) {
  const links = quickLinks[role] || [];

  if (links.length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Button
              key={link.href}
              variant="outline"
              className={cn(
                "h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent relative",
                link.isNew && "border-primary"
              )}
              asChild
            >
              <Link href={link.href}>
                {link.isNew && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
                <Icon className={cn("h-6 w-6", link.color)} />
                <span className="text-sm font-medium">{link.title}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
