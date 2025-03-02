"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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

// Define the surgical procedure schema
const surgicalProcedureSchema = z.object({
  procedure: z.string().min(1, { message: "Procedure name is required" }),
  date: z.date().optional(),
  hospital: z.string().optional(),
  surgeon: z.string().optional(),
  notes: z.string().optional(),
});

// Define the type for surgical procedure
export type SurgicalProcedure = z.infer<typeof surgicalProcedureSchema>;

/**
 * EditSurgicalHistory component provides a dialog to add or edit a surgical procedure
 * @param procedure - Optional existing procedure to edit
 * @param onSave - Function to handle saving the procedure
 * @param onCancel - Function to handle canceling the edit
 */
export function EditSurgicalHistory({
  procedure,
  onSave,
  onCancel,
}: {
  procedure?: SurgicalProcedure;
  onSave: (data: SurgicalProcedure) => void;
  onCancel: () => void;
}) {
  const [open, setOpen] = useState(false);

  // Initialize form with default values
  const form = useForm<SurgicalProcedure>({
    resolver: zodResolver(surgicalProcedureSchema),
    defaultValues: procedure || {
      procedure: "",
      hospital: "",
      surgeon: "",
      notes: "",
    },
  });

  // Handle form submission
  const handleSubmit = (data: SurgicalProcedure) => {
    onSave(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {procedure ? "Edit Procedure" : "Add Procedure"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {procedure ? "Edit Surgical Procedure" : "Add Surgical Procedure"}
          </DialogTitle>
          <DialogDescription>
            {procedure
              ? "Update the details of this surgical procedure"
              : "Add a new surgical procedure to the patient's record"}
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
                name="procedure"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Procedure Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Appendectomy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Procedure</FormLabel>
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
                name="hospital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital</FormLabel>
                    <FormControl>
                      <Input placeholder="Hospital name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="surgeon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surgeon</FormLabel>
                    <FormControl>
                      <Input placeholder="Surgeon name" {...field} />
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
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details about the procedure"
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
