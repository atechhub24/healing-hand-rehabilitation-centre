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
  Pencil,
} from "lucide-react";

interface BreadcrumbSegment {
  title: string;
  href: string;
  icon?: React.ElementType;
}

// Virtual segments that shouldn't appear in breadcrumbs
const virtualSegments = new Set(["manage"]);

// Segments that represent IDs and their display titles
const idSegmentTitles: Record<string, string> = {
  doctors: "Doctor Details",
  paramedics: "Paramedic Details",
  laboratories: "Laboratory Details",
  patients: "Patient Details",
  appointments: "Appointment Details",
};

const routeConfig: Record<string, { title: string; icon?: React.ElementType }> =
  {
    admin: { title: "Admin", icon: Settings },
    doctor: { title: "Doctor", icon: Stethoscope },
    paramedic: { title: "Paramedic", icon: Ambulance },
    lab: { title: "Laboratory", icon: TestTubes },
    customer: { title: "Customer", icon: Users },
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
    edit: { title: "Edit", icon: Pencil },
  };

function isIdSegment(
  segment: string,
  prevSegment: string | undefined
): boolean {
  // Check if the segment looks like an ID (contains numbers or is longer than typical route names)
  return (
    (prevSegment &&
      idSegmentTitles[prevSegment] !== undefined &&
      segment.length > 12) ||
    /[0-9]/.test(segment)
  );
}

export function generateBreadcrumbs(path: string): BreadcrumbSegment[] {
  const segments = path.replace(/^\/+|\/+$/g, "").split("/");
  const breadcrumbs: BreadcrumbSegment[] = [];
  let currentPath = "";

  segments.forEach((segment, index) => {
    // Skip virtual segments
    if (virtualSegments.has(segment)) {
      currentPath += `/${segment}`;
      return;
    }

    currentPath += `/${segment}`;
    const config = routeConfig[segment];
    const prevSegment = segments[index - 1];

    // Handle ID segments
    if (isIdSegment(segment, prevSegment)) {
      const title = prevSegment && idSegmentTitles[prevSegment];
      if (title) {
        breadcrumbs.push({
          title,
          href: currentPath,
          icon: routeConfig[prevSegment]?.icon,
        });
      }
      return;
    }

    if (config) {
      breadcrumbs.push({
        title: config.title,
        href: currentPath,
        icon: config.icon,
      });
    } else {
      // Handle unknown segments
      breadcrumbs.push({
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
      });
    }
  });

  return breadcrumbs;
}
