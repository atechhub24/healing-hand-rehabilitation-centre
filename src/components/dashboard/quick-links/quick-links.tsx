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
  patient: [
    {
      title: "Edit Profile",
      href: "/patient/profile/edit",
      icon: UserCog,
      color: "text-blue-500",
    },
    {
      title: "Book Appointment",
      href: "/patient/appointments/new",
      icon: CalendarPlus,
      color: "text-blue-500",
      isNew: true,
    },
    {
      title: "New Test Request",
      href: "/patient/tests/new",
      icon: TestTubes,
      color: "text-purple-500",
      isNew: true,
    },
    {
      title: "My Appointments",
      href: "/patient/appointments",
      icon: Calendar,
      color: "text-emerald-500",
    },
    {
      title: "Medical Records",
      href: "/patient/records",
      icon: FileText,
      color: "text-orange-500",
    },
    {
      title: "Messages",
      href: "/patient/messages",
      icon: MessageSquare,
      color: "text-indigo-500",
    },
    {
      title: "Billing",
      href: "/patient/billing",
      icon: BadgeDollarSign,
      color: "text-gray-500",
    },
  ],
};

interface QuickLinksProps {
  role: string;
  onError?: (message: string) => void;
}

export default function QuickLinks({ role, onError }: QuickLinksProps) {
  const links = quickLinks[role] || [];

  if (links.length === 0) {
    onError?.("Invalid role or no quick links available");
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          <Card className="hover:bg-accent transition-colors">
            <Button
              variant="ghost"
              className="w-full h-full justify-start gap-4"
            >
              <link.icon className={cn("h-5 w-5", link.color)} />
              <span>{link.title}</span>
              {link.isNew && (
                <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  New
                </span>
              )}
            </Button>
          </Card>
        </Link>
      ))}
    </div>
  );
}
