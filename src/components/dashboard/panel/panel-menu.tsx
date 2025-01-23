"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { menuItemVariants } from "./panel-variants";
import { roleConfig } from "@/config/role-config";
import { LucideIcon } from "lucide-react";

interface NavigationItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

interface NavigationProps {
  isOpen: boolean;
}

export function Navigation({ isOpen }: NavigationProps) {
  const pathname = usePathname();
  const role = pathname.split("/")[1] as keyof typeof roleConfig;
  const menuItems = roleConfig[role]?.menuItems || [];
  const items = menuItems as unknown as NavigationItem[];

  return (
    <nav className="flex-1 space-y-1 p-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-accent/50 text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {isOpen && (
              <motion.span
                variants={menuItemVariants}
                initial="closed"
                animate="open"
                className="truncate"
              >
                {item.label}
              </motion.span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
