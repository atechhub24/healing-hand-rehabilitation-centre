"use client";

import { motion } from "framer-motion";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { menuItemVariants } from "./panel-variants";

interface UserProfileProps {
  email: string;
  role: string;
  isOpen: boolean;
  onSignOut: () => void;
}

export function UserProfile({
  email,
  role,
  isOpen,
  onSignOut,
}: UserProfileProps) {
  return (
    <div className="mt-auto border-t border-border p-2">
      <div className="flex items-center gap-2 rounded-lg px-3 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
        {isOpen && (
          <motion.div
            variants={menuItemVariants}
            initial="closed"
            animate="open"
            className="flex flex-col overflow-hidden"
          >
            <span className="truncate text-sm font-medium">{email}</span>
            <span className="truncate text-xs text-muted-foreground capitalize">
              {role}
            </span>
          </motion.div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className={`mt-2 w-full justify-start gap-2 ${
          !isOpen ? "px-0 py-2" : ""
        }`}
        onClick={onSignOut}
      >
        <LogOut className="h-4 w-4" />
        {isOpen && (
          <motion.span
            variants={menuItemVariants}
            initial="closed"
            animate="open"
            className="truncate"
          >
            Sign out
          </motion.span>
        )}
      </Button>
    </div>
  );
}
