"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import { motion, AnimatePresence } from "framer-motion";
import { roleConfig } from "@/config/role-config";
import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";

// Layout component that wraps all pages within the [role] directory
// This provides a consistent UI shell (navigation, header, etc.) across all role-based pages
export default function RoleBasedLayout({
  children, // The actual page content that will be rendered inside this layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter(); // For programmatic navigation
  const params = useParams(); // To access URL parameters (like role)
  const { user, role, signOut } = useAuth(); // Authentication context
  const currentRole = params.role as keyof typeof roleConfig;

  // Authentication and role verification
  // This effect runs whenever user, role, or currentRole changes
  useEffect(() => {
    // Redirect to login if:
    // 1. User is not authenticated (no user)
    // 2. User has no role assigned
    // 3. User's role doesn't match the current route's role
    if (!user || !role || role !== currentRole) {
      router.replace("/auth/login");
    }
  }, [user, role, currentRole, router]);

  // Don't render anything if authentication/authorization fails
  if (!user || !role || !roleConfig[currentRole]) {
    return null;
  }

  // Get the configuration for the current role
  const { title } = roleConfig[currentRole];

  // Handle user sign out
  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  // The layout is split into two main sections:
  // 1. Sidebar (navigation)
  // 2. Main content area (header + page content)
  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} role={currentRole} onSignOut={handleSignOut} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 overflow-y-auto bg-gradient-to-br from-muted/50 to-background"
        >
          <div className="container mx-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.main>
      </div>

      {/* Toast notifications container */}
      <Toaster />
    </div>
  );
}
