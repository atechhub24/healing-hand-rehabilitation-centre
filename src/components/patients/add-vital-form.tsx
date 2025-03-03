"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
import { toast } from "@/hooks/use-toast";
import mutate from "@/lib/firebase/mutate-data";
import { Calendar } from "@/components/ui/calendar";

/**
 * Schema for vital sign form validation
 */
const vitalFormSchema = z.object({
  type: z.enum(["blood-pressure", "blood-glucose", "weight", "heart-rate"], {
    required_error: "Please select a vital type",
  }),
  date: z
    .date({
      required_error: "Please select a date",
    })
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: "Please select a valid date",
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
  date: (() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    return today;
  })(),
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
    console.log("Form submitted with data:", data);

    try {
      if (
        !data.date ||
        !(data.date instanceof Date) ||
        isNaN(data.date.getTime())
      ) {
        toast({
          title: "Invalid date",
          description: "Please select a valid date for the vital sign.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare the data based on vital type
      let vitalData: Record<string, unknown> = {
        date: format(data.date, "yyyy-MM-dd"),
        notes: data.notes || "",
        timestamp: new Date().toISOString(), // Add timestamp for sorting
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
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
              <div className="w-full">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    console.log("Calendar onSelect called with date:", date);
                    if (date) {
                      // Force the date to be set to noon to avoid timezone issues
                      const adjustedDate = new Date(date);
                      adjustedDate.setHours(12, 0, 0, 0);
                      field.onChange(adjustedDate);
                    } else {
                      field.onChange(undefined);
                    }
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  className="rounded-md border shadow mx-auto w-full max-w-[350px]"
                />
              </div>
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
                    <FormDescription>
                      The top number in a blood pressure reading.
                    </FormDescription>
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
                    <FormDescription>
                      The bottom number in a blood pressure reading.
                    </FormDescription>
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
                <FormDescription>
                  {vitalType === "blood-glucose"
                    ? "Blood glucose level in milligrams per deciliter."
                    : vitalType === "weight"
                    ? "Weight in pounds."
                    : "Heart rate in beats per minute."}
                </FormDescription>
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
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input
                  placeholder="Any additional notes"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Optional notes about the measurement.
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
