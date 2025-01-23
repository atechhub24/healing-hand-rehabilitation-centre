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
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickLink {
  title: string;
  href: string;
  icon: React.ElementType;
  color: string;
}

const quickLinks: Record<string, QuickLink[]> = {
  admin: [
    {
      title: "Manage Users",
      href: "/admin/users",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
      color: "text-gray-500",
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: FileText,
      color: "text-emerald-500",
    },
  ],
  doctor: [
    {
      title: "Schedule",
      href: "/doctor/schedule",
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      title: "Patients",
      href: "/doctor/patients",
      icon: Users,
      color: "text-emerald-500",
    },
    {
      title: "Prescriptions",
      href: "/doctor/prescriptions",
      icon: ClipboardList,
      color: "text-purple-500",
    },
  ],
  paramedic: [
    {
      title: "Active Calls",
      href: "/paramedic/calls",
      icon: Phone,
      color: "text-red-500",
    },
    {
      title: "Reports",
      href: "/paramedic/reports",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Emergency Contacts",
      href: "/paramedic/contacts",
      icon: Users,
      color: "text-emerald-500",
    },
  ],
  lab: [
    {
      title: "Test Orders",
      href: "/lab/orders",
      icon: TestTube,
      color: "text-purple-500",
    },
    {
      title: "Results",
      href: "/lab/results",
      icon: Activity,
      color: "text-blue-500",
    },
    {
      title: "Reports",
      href: "/lab/reports",
      icon: FileText,
      color: "text-emerald-500",
    },
  ],
  customer: [
    {
      title: "Book Appointment",
      href: "/customer/book",
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      title: "My Records",
      href: "/customer/records",
      icon: FileText,
      color: "text-emerald-500",
    },
    {
      title: "Messages",
      href: "/customer/messages",
      icon: MessageSquare,
      color: "text-purple-500",
    },
  ],
};

export default function QuickLinks({ role }: { role: string }) {
  const links = quickLinks[role] || [];

  if (links.length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Button
              key={link.href}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent"
              asChild
            >
              <Link href={link.href}>
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
