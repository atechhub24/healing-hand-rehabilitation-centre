"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// icons removed for common dosages section
import {
  type MedicationOption,
  MEDICATION_CATEGORIES,
} from "@/lib/data/medications";
import { useAuth } from "@/lib/hooks/use-auth";
import mutate from "@/lib/firebase/mutate-data";
import { toast } from "@/components/ui/use-toast";

interface EditMedicationDialogProps {
  medication: MedicationOption | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function EditMedicationDialog({
  medication,
  isOpen,
  onClose,
  onSave,
}: EditMedicationDialogProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    category: "",
    description: "",
  });

  // Initialize form data when medication changes
  React.useEffect(() => {
    if (medication) {
      setFormData({
        label: medication.label,
        category: medication.category,
        description: medication.description || "",
      });
    } else {
      setFormData({
        label: "",
        category: "Other",
        description: "",
      });
    }
  }, [medication]);

  const handleSave = async () => {
    if (!user || !formData.label.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the medication name",
      });
      return;
    }

    setIsLoading(true);
    try {
      const medicationData = {
        value: formData.label.toLowerCase().replace(/\s+/g, "-"),
        label: formData.label,
        category: formData.category,
        description: formData.description,
      };

      if (medication) {
        // Update existing medication - we need to find the medication ID from Firebase
        // For now, we'll create a new one with the updated data
        const result = await mutate({
          path: `medications/${user.uid}/${(medication as unknown as { id: string }).id}`,
          data: medicationData as unknown as Record<string, unknown>,
          action: "update",
        });

        if (result.success) {
          toast({
            title: "Medication updated successfully!",
          });
          onSave();
          onClose();
        } else {
          throw new Error(result.error || "Failed to update medication");
        }
      } else {
        // Create new medication
        const result = await mutate({
          path: `medications/${user.uid}`,
          data: medicationData as unknown as Record<string, unknown>,
          action: "createWithId",
        });

        if (result.success) {
          toast({
            title: "Medication created successfully!",
          });
          onSave();
          onClose();
        } else {
          throw new Error(result.error || "Failed to create medication");
        }
      }
    } catch (error) {
      console.error("Error saving medication:", error);
      toast({
        title: "Failed to save medication",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // common dosages removed per requirement

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {medication ? "Edit Medication" : "Add New Medication"}
          </DialogTitle>
          <DialogDescription>
            {medication
              ? "Update the medication information below."
              : "Add a new medication to your database."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="label">Medication Name *</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              placeholder="e.g., Amoxicillin"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {MEDICATION_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the medication..."
              rows={3}
            />
          </div>

          {/* Common Dosages UI removed */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : medication ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
