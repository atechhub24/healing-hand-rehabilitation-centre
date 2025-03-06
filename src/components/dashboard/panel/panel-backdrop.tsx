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
      animate={{ opacity: isOpen ? 0.7 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[45] lg:hidden"
    />
  );
}
