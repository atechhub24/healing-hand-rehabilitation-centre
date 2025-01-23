"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { Toaster } from "@/components/ui/toaster";
import { motion, AnimatePresence } from "framer-motion";
import { roleConfig } from "@/config/role-config";
import Header from "@/components/dashboard/header";
import Panel from "@/components/dashboard/panel";

interface LayoutProps {
  children: React.ReactNode;
}

// Layout component that wraps all pages within the [role] directory
// This provides a consistent UI shell (navigation, header, etc.) across all role-based pages
export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const params = useParams();
  const { user, signOut } = useAuth();
  const { userData, role } = useAuthStore();
  const currentRole = params.role as keyof typeof roleConfig;

  useEffect(() => {
    if (!user || !role || role !== currentRole) {
      router.replace("/auth/login");
    }
  }, [user, role, currentRole, router]);

  if (!user || !role || !userData || !roleConfig[currentRole]) {
    return null;
  }

  const { title } = roleConfig[currentRole];

  // The layout is split into two main sections:
  // 1. Sidebar (navigation)
  // 2. Main content area (header + page content)
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Panel user={userData} onSignOut={signOut} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRole}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
