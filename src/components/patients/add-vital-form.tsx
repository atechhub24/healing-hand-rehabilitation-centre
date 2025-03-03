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
 * Schema for vital sign form validation
 */
const vitalFormSchema = z.object({
  type: z.enum(["blood-pressure", "blood-glucose", "weight", "heart-rate"], {
    required_error: "Please select a vital type",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  systolic: z.coerce
    .number()
    .min(70, "Systolic pressure must be at least 70")
    .max(250, "Systolic pressure must be less than 250")
    .optional(),
  diastolic: z.coerce
    .number()
    .min(40, "Diastolic pressure must be at least 40")
    .max(150, "Diastolic pressure must be less than 150")
    .optional(),
  value: z.coerce.number().min(0, "Value must be at least 0").optional(),
  notes: z.string().optional(),
});

/**
 * Type for the form values
 */
type VitalFormValues = z.infer<typeof vitalFormSchema>;

/**
 * Default values for the form
 */
const defaultValues: Partial<VitalFormValues> = {
  type: "blood-pressure",
  date: new Date(),
};

/**
 * AddVitalForm component for adding new vital signs
 * @param patientId - The ID of the patient
 * @param onSuccess - Callback function to execute on successful submission
 */
export function AddVitalForm({
  patientId,
  onSuccess,
}: {
  patientId: string;
  onSuccess?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VitalFormValues>({
    resolver: zodResolver(vitalFormSchema),
    defaultValues,
  });

  const vitalType = form.watch("type");

  const onSubmit = async (data: VitalFormValues) => {
    setIsSubmitting(true);
    try {
      // Prepare the data based on vital type
      let vitalData: Record<string, unknown> = {
        date: format(data.date, "yyyy-MM-dd"),
        notes: data.notes || "",
      };

      // Add specific fields based on vital type
      if (data.type === "blood-pressure") {
        if (!data.systolic || !data.diastolic) {
          toast({
            title: "Missing values",
            description:
              "Both systolic and diastolic values are required for blood pressure.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        vitalData = {
          ...vitalData,
          systolic: data.systolic,
          diastolic: data.diastolic,
        };
      } else {
        if (!data.value) {
          toast({
            title: "Missing value",
            description: "Value is required for this vital type.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        vitalData = {
          ...vitalData,
          value: data.value,
        };
      }

      // Save to Firebase
      const result = await mutate({
        path: `/patients/${patientId}/vitals/${data.type}`,
        data: vitalData,
        action: "createWithId",
      });

      if (result.success) {
        toast({
          title: "Vital sign added",
          description: "The vital sign has been successfully recorded.",
        });
        form.reset(defaultValues);
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Error",
          description:
            result.error || "Failed to add vital sign. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding vital sign:", error);
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
              <FormLabel>Vital Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vital type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="blood-pressure">Blood Pressure</SelectItem>
                  <SelectItem value="blood-glucose">Blood Glucose</SelectItem>
                  <SelectItem value="weight">Weight</SelectItem>
                  <SelectItem value="heart-rate">Heart Rate</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of vital sign you want to record.
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
                The date when the vital sign was measured.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {vitalType === "blood-pressure" ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="systolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Systolic (mmHg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="120"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diastolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diastolic (mmHg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="80"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        ) : (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {vitalType === "blood-glucose"
                    ? "Blood Glucose (mg/dL)"
                    : vitalType === "weight"
                    ? "Weight (lbs)"
                    : "Heart Rate (bpm)"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={
                      vitalType === "blood-glucose"
                        ? "100"
                        : vitalType === "weight"
                        ? "170"
                        : "72"
                    }
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Any additional notes"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Add any relevant notes about this measurement.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : "Save Vital Sign"}
        </Button>
      </form>
    </Form>
  );
}
