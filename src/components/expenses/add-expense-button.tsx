"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddExpenseForm } from "./add-expense-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface AddExpenseButtonProps {
  onExpenseAdded: () => void;
}

export function AddExpenseButton({ onExpenseAdded }: AddExpenseButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <AddExpenseForm
          onSubmit={() => {
            onExpenseAdded();
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
