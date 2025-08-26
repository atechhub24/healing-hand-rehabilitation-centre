"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DosageComboboxProps {
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly placeholder?: string;
  readonly className?: string;
}

export function DosageCombobox({
  value,
  onValueChange,
  placeholder = "Enter dosage...",
  className,
}: DosageComboboxProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      placeholder={placeholder}
      className={cn("w-full", className)}
    />
  );
}
