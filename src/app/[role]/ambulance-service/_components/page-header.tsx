"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Receipt } from "lucide-react";

interface PageHeaderProps {
  onAddBooking: () => void;
  onAddExpense: () => void;
}

export function PageHeader({ onAddBooking, onAddExpense }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ambulance Service</h1>
        <p className="text-muted-foreground">
          Emergency response and ambulance management system
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2" onClick={onAddBooking}>
          <Plus className="h-4 w-4" />
          Add a booking
        </Button>
        <Button variant="outline" className="gap-2" onClick={onAddExpense}>
          <Receipt className="h-4 w-4" />
          Add Expense
        </Button>
      </div>
    </div>
  );
}
