"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";
import { useParams } from "next/navigation";

interface BrandProps {
  isOpen: boolean;
}

export function Brand({ isOpen }: BrandProps) {
  const { role } = useParams();
  return (
    <Link href="/" className="flex items-center gap-2 px-4 py-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
        <span className="font-bold text-primary-foreground">
          <Shield className="h-5 w-5" />
        </span>
      </div>
      <motion.span
        initial={{ opacity: 0, width: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          width: isOpen ? "auto" : 0,
        }}
        className={cn(
          "font-semibold text-xl overflow-hidden capitalize whitespace-nowrap",
          isOpen ? "ml-2" : "w-0 ml-0"
        )}
      >
        {typeof role === "string" ? role : "Admin"} {" Panel"}
      </motion.span>
    </Link>
  );
}
