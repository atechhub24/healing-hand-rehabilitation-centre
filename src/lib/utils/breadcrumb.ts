import {
  Users,
  Stethoscope,
  Ambulance,
  TestTubes,
  Settings,
  Building2,
  ChartBar,
  BadgeDollarSign,
  Calendar,
  FileText,
  MessageSquare,
  Activity,
  ClipboardList,
} from "lucide-react";

interface BreadcrumbSegment {
  title: string;
  href: string;
  icon?: React.ElementType;
}

const routeConfig: Record<string, { title: string; icon?: React.ElementType }> =
  {
    admin: { title: "Admin", icon: Settings },
    doctor: { title: "Doctor", icon: Stethoscope },
    paramedic: { title: "Paramedic", icon: Ambulance },
    lab: { title: "Laboratory", icon: TestTubes },
    customer: { title: "Customer", icon: Users },
    manage: { title: "Manage" },
    doctors: { title: "Doctors", icon: Stethoscope },
    paramedics: { title: "Paramedics", icon: Ambulance },
    laboratories: { title: "Laboratories", icon: TestTubes },
    staff: { title: "Staff", icon: Users },
    departments: { title: "Departments", icon: Building2 },
    analytics: { title: "Analytics", icon: ChartBar },
    billing: { title: "Billing", icon: BadgeDollarSign },
    settings: { title: "Settings", icon: Settings },
    appointments: { title: "Appointments", icon: Calendar },
    records: { title: "Records", icon: FileText },
    messages: { title: "Messages", icon: MessageSquare },
    calls: { title: "Calls", icon: Activity },
    inventory: { title: "Inventory", icon: ClipboardList },
    new: { title: "New" },
  };

export function generateBreadcrumbs(path: string): BreadcrumbSegment[] {
  // Remove leading and trailing slashes and split into segments
  const segments = path.replace(/^\/+|\/+$/g, "").split("/");
  const breadcrumbs: BreadcrumbSegment[] = [];
  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const config = routeConfig[segment];

    if (config) {
      breadcrumbs.push({
        title: config.title,
        href: currentPath,
        icon: config.icon,
      });
    } else {
      // Handle dynamic segments or unknown routes
      breadcrumbs.push({
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
      });
    }
  });

  return breadcrumbs;
}
