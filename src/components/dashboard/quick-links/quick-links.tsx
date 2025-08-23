import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChartBar, Settings, UserCog, Users } from "lucide-react";
import Link from "next/link";

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
      title: "Manage Staff",
      href: "/admin/manage/staff",
      icon: Users,
      color: "text-emerald-500",
    },
    {
      title: "Manage Prescriptions",
      href: "/admin/prescriptions",
      icon: ChartBar,
      color: "text-indigo-500",
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
      color: "text-gray-500",
    },
  ],
  staff: [
    {
      title: "Edit Profile",
      href: "/admin/profile/edit",
      icon: UserCog,
      color: "text-blue-500",
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
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
