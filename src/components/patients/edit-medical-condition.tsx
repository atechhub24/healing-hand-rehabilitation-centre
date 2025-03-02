"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define the medical condition schema
const medicalConditionSchema = z.object({
  condition: z.string().min(1, { message: "Condition is required" }),
  diagnosedDate: z.date().optional(),
  status: z.string().min(1, { message: "Status is required" }),
  notes: z.string().optional(),
  medications: z.array(z.string()).optional(),
});

// Define the type for medical condition
export type MedicalCondition = z.infer<typeof medicalConditionSchema>;

/**
 * EditMedicalCondition component provides a dialog to add or edit a medical condition
 * @param condition - Optional existing condition to edit
 * @param onSave - Function to handle saving the condition
 * @param onCancel - Function to handle canceling the edit
 */
export function EditMedicalCondition({
  condition,
  onSave,
  onCancel,
}: {
  condition?: MedicalCondition;
  onSave: (data: MedicalCondition) => void;
  onCancel: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [medications, setMedications] = useState<string[]>(
    condition?.medications || []
  );
  const [newMedication, setNewMedication] = useState("");

  // Initialize form with default values
  const form = useForm<MedicalCondition>({
    resolver: zodResolver(medicalConditionSchema),
    defaultValues: condition || {
      condition: "",
      status: "Active",
      notes: "",
      medications: [],
    },
  });

  // Add a new medication to the list
  const addMedication = () => {
    if (newMedication.trim()) {
      setMedications([...medications, newMedication.trim()]);
      setNewMedication("");
    }
  };

  // Remove a medication from the list
  const removeMedication = (index: number) => {
    const updatedMedications = [...medications];
    updatedMedications.splice(index, 1);
    setMedications(updatedMedications);
  };

  // Handle form submission
  const handleSubmit = (data: MedicalCondition) => {
    // Include the medications in the form data
    data.medications = medications;
    onSave(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {condition ? "Edit Condition" : "Add Condition"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {condition ? "Edit Medical Condition" : "Add Medical Condition"}
          </DialogTitle>
          <DialogDescription>
            {condition
              ? "Update the details of this medical condition"
              : "Add a new medical condition to the patient's record"}
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
                name="condition"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Condition Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Hypertension" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diagnosedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Diagnosed</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Managed">Managed</SelectItem>
                        <SelectItem value="Chronic">Chronic</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details about the condition"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Medications</FormLabel>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add medication"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addMedication}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {medications.map((medication, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <span>{medication}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMedication(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {medications.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No medications added
                  </p>
                )}
              </div>
            </div>

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
