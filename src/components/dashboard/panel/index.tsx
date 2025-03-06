"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSidebarStore } from "@/lib/store/sidebar-store";
import { useAuth } from "@/lib/hooks/use-auth";
import { Brand } from "./panel-brand";
import { Navigation } from "./panel-menu";
import { UserProfile } from "./panel-profile";
import { MobileTrigger } from "./panel-trigger";
import { Backdrop } from "./panel-backdrop";
import { sidebarVariants } from "./panel-variants";

export default function DashboardPanel() {
  const { isOpen, isMobileOpen, setMobileOpen } = useSidebarStore();
  const { user, signOut } = useAuth();
  const userIdentifier = user?.email || user?.phoneNumber || "User";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check
    setIsMobile(window.innerWidth < 1024);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setMobileOpen]);

  return (
    <>
      {/* Mobile menu trigger button */}
      <MobileTrigger
        isOpen={isMobileOpen}
        onToggle={() => setMobileOpen(!isMobileOpen)}
      />

      {/* Backdrop overlay for mobile - only shows when mobile sidebar is open */}
      <AnimatePresence>
        {isMobileOpen && (
          <Backdrop
            isOpen={isMobileOpen}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen || isMobileOpen ? "open" : "closed"}
        className={`fixed top-0 left-0 z-50 h-full bg-background border-r border-border shadow-sm 
          ${isMobileOpen ? "translate-x-0" : ""} 
          ${!isOpen && !isMobileOpen ? "w-[80px]" : "w-[280px]"} 
          ${isMobile && !isMobileOpen ? "-translate-x-full" : ""}
          lg:relative lg:translate-x-0 transition-transform duration-300`}
      >
        <div className="flex h-full flex-col">
          <Brand isOpen={isOpen || isMobileOpen} />
          <Navigation isOpen={isOpen || isMobileOpen} />
          <UserProfile
            email={userIdentifier}
            role={user?.role || ""}
            isOpen={isOpen || isMobileOpen}
            onSignOut={signOut}
          />
        </div>
      </motion.aside>
    </>
  );
}
