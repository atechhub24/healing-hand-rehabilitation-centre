"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  DialogTrigger,
} from "@/components/ui/dialog";

// Define the family history schema
const familyHistorySchema = z.object({
  relation: z.string().min(1, { message: "Relation is required" }),
  condition: z.string().min(1, { message: "Condition is required" }),
  age: z.string().optional(),
  notes: z.string().optional(),
});

// Define the type for family history
export type FamilyHistory = z.infer<typeof familyHistorySchema>;

/**
 * EditFamilyHistory component provides a dialog to add or edit a family history record
 * @param history - Optional existing family history to edit
 * @param onSave - Function to handle saving the family history
 * @param onCancel - Function to handle canceling the edit
 */
export function EditFamilyHistory({
  history,
  onSave,
  onCancel,
}: {
  history?: FamilyHistory;
  onSave: (data: FamilyHistory) => void;
  onCancel: () => void;
}) {
  const [open, setOpen] = useState(false);

  // Initialize form with default values
  const form = useForm<FamilyHistory>({
    resolver: zodResolver(familyHistorySchema),
    defaultValues: history || {
      relation: "",
      condition: "",
      age: "",
      notes: "",
    },
  });

  // Handle form submission
  const handleSubmit = (data: FamilyHistory) => {
    onSave(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {history ? "Edit Family History" : "Add Family History"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {history ? "Edit Family History" : "Add Family History"}
          </DialogTitle>
          <DialogDescription>
            {history
              ? "Update the details of this family history record"
              : "Add a new family history record to the patient's medical history"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 py-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="relation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Father">Father</SelectItem>
                        <SelectItem value="Mother">Mother</SelectItem>
                        <SelectItem value="Brother">Brother</SelectItem>
                        <SelectItem value="Sister">Sister</SelectItem>
                        <SelectItem value="Grandfather (Paternal)">
                          Grandfather (Paternal)
                        </SelectItem>
                        <SelectItem value="Grandmother (Paternal)">
                          Grandmother (Paternal)
                        </SelectItem>
                        <SelectItem value="Grandfather (Maternal)">
                          Grandfather (Maternal)
                        </SelectItem>
                        <SelectItem value="Grandmother (Maternal)">
                          Grandmother (Maternal)
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Condition</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Diabetes, Heart Disease"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age of Onset/Diagnosis</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 45, Unknown" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional details about the family history"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
