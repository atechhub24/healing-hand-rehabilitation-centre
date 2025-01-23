"use client";

import { motion } from "framer-motion";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/theme-switcher";
import { useSidebarStore } from "@/lib/store/sidebar-store";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const toggle = useSidebarStore((state) => state.toggle);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-30"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex hover:bg-muted"
            onClick={toggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <motion.div
            className="relative hidden md:block"
            whileHover={{ scale: 1.01 }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-muted/50"
            />
          </motion.div>
          {/* Theme Switcher */}
          <ThemeSwitcher />
          {/* Notifications */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-muted"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center animate-pulse shadow-sm">
                3
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
