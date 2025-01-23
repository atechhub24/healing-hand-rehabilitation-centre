"use client";

import { motion } from "framer-motion";

interface BackdropProps {
  isOpen: boolean;
  onClick: () => void;
}

export function Backdrop({ isOpen, onClick }: BackdropProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 0.5 : 0 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    />
  );
}
