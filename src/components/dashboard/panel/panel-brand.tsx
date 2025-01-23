"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandProps {
  isOpen: boolean;
}

export function Brand({ isOpen }: BrandProps) {
  return (
    <Link href="/" className="flex items-center gap-2 px-4 py-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
        <span className="font-bold text-primary-foreground">H+</span>
      </div>
      <motion.span
        initial={{ opacity: 0, width: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          width: isOpen ? "auto" : 0,
        }}
        className={cn(
          "font-semibold text-xl overflow-hidden whitespace-nowrap",
          isOpen ? "ml-2" : "w-0 ml-0"
        )}
      >
        HPluz
      </motion.span>
    </Link>
  );
}
