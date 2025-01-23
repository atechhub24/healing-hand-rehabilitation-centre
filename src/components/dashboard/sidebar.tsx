"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { roleConfig } from "@/config/role-config";
import { useRouter } from "next/navigation";
import { useSidebarStore } from "@/lib/store/sidebar-store";

interface SidebarProps {
  user: any;
  role: keyof typeof roleConfig;
  onSignOut: () => void;
}

export default function Sidebar({ user, role, onSignOut }: SidebarProps) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("");
  const [currentPath, setCurrentPath] = useState("");

  const { isOpen, isMobileOpen, toggleMobile, setOpen, setMobileOpen } =
    useSidebarStore();

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setOpen, setMobileOpen]);

  const { menuItems } = roleConfig[role];

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1,
      },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1,
      },
    },
  };

  const menuItemVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    closed: {
      x: -20,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex h-full flex-col w-full">
      {/* Brand/Logo Section */}
      <motion.div
        className="flex items-center gap-3 px-6 py-5 border-b border-border"
        whileHover={{ scale: 1.01 }}
      >
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-primary-foreground font-bold text-lg">H+</span>
        </div>
        {isOpen && (
          <motion.span
            variants={menuItemVariants}
            className="font-semibold text-foreground text-lg"
          >
            Healthcare+
          </motion.span>
        )}
      </motion.div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1.5">
          {menuItems.map((item) => (
            <motion.li
              key={item.href}
              whileHover={{ scale: 1.01, x: 2 }}
              whileTap={{ scale: 0.99 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200",
                  currentPath === item.href &&
                    "bg-accent text-accent-foreground font-medium"
                )}
                onClick={() => {
                  setActiveItem(item.href);
                  if (isMobile) {
                    setMobileOpen(false);
                  }
                }}
              >
                <item.icon className="h-5 w-5" />
                {isOpen && (
                  <motion.span variants={menuItemVariants}>
                    {item.label}
                  </motion.span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* User Profile Section */}
      <motion.div
        className="border-t border-border p-4 bg-muted/50"
        whileHover={{ backgroundColor: "var(--muted)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="h-10 w-10 rounded-xl bg-card flex items-center justify-center shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="h-5 w-5 text-muted-foreground" />
          </motion.div>
          {isOpen && (
            <motion.div variants={menuItemVariants}>
              <p className="text-sm font-medium text-foreground">
                {user.email || user.phoneNumber}
              </p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </motion.div>
          )}
        </div>
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl"
            onClick={onSignOut}
          >
            <LogOut className="h-5 w-5" />
            {isOpen && (
              <motion.span variants={menuItemVariants}>Sign Out</motion.span>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-background/50 backdrop-blur-sm border shadow-sm"
        onClick={toggleMobile}
      >
        {isMobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/80 backdrop-blur-sm lg:hidden z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex w-72 bg-card/80 backdrop-blur-md border-r border-border",
          !isOpen && "lg:w-20"
        )}
      >
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-card/80 backdrop-blur-md border-r border-border shadow-lg lg:hidden"
          >
            {renderSidebarContent(true)}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
