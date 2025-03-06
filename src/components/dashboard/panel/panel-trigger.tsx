"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileTrigger({ isOpen, onToggle }: MobileTriggerProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed top-4 left-4 z-[60] lg:hidden bg-background/90 backdrop-blur-sm border shadow-md hover:bg-background/95 transition-all"
      onClick={onToggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );
}
