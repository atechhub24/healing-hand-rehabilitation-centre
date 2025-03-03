"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "@/hooks/use-toast";
import mutate from "@/lib/firebase/mutate-data";

/**
 * Schema for activity form validation
 */
const activityFormSchema = z.object({
  type: z.enum(["Appointment", "Prescription", "Lab Results", "Note"], {
    required_error: "Please select an activity type",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  details: z.string().optional(),
});

/**
 * Type for the form values
 */
type ActivityFormValues = z.infer<typeof activityFormSchema>;

/**
 * Default values for the form
 */
const defaultValues: Partial<ActivityFormValues> = {
  type: "Appointment",
  date: new Date(),
  description: "",
  details: "",
};

/**
 * AddActivityForm component for adding new patient activities
 * @param patientId - The ID of the patient
 * @param onSuccess - Callback function to execute on successful submission
 */
export function AddActivityForm({
  patientId,
  onSuccess,
}: {
  patientId: string;
  onSuccess?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: ActivityFormValues) => {
    setIsSubmitting(true);
    try {
      // Prepare the data
      const activityData = {
        type: data.type,
        date: format(data.date, "yyyy-MM-dd"),
        description: data.description,
        details: data.details || "",
      };

      // Save to Firebase
      const result = await mutate({
        path: `/patients/${patientId}/activities`,
        data: activityData,
        action: "createWithId",
      });

      if (result.success) {
        toast({
          title: "Activity added",
          description: "The activity has been successfully recorded.",
        });
        form.reset(defaultValues);
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Error",
          description:
            result.error || "Failed to add activity. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding activity:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Appointment">Appointment</SelectItem>
                  <SelectItem value="Prescription">Prescription</SelectItem>
                  <SelectItem value="Lab Results">Lab Results</SelectItem>
                  <SelectItem value="Note">Note</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of activity you want to record.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
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
              <FormDescription>
                The date when the activity occurred.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Brief description of the activity"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                A short description of the activity (e.g., "Checkup with Dr.
                Smith").
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional details about the activity"
                  className="min-h-[100px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Any additional details or notes about this activity.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : "Save Activity"}
        </Button>
      </form>
    </Form>
  );
}
