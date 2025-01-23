"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import mutateData from "@/lib/firebase/mutate-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Clock, MapPin, Plus } from "lucide-react";

// Form schema for slot creation
const slotFormSchema = z.object({
  clinicId: z.string().min(1, "Please select a clinic"),
  slotDuration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  slotCost: z.coerce.number().min(0, "Cost cannot be negative"),
  startTime: z.string().min(1, "Please select a start time"),
  endTime: z.string().min(1, "Please select an end time"),
  days: z.array(z.string()).min(1, "Please select at least one day"),
});

type SlotFormValues = z.infer<typeof slotFormSchema>;

interface ClinicAddress {
  id?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  timings: {
    startTime: string;
    endTime: string;
    days: string[];
  };
}

interface Doctor {
  uid: string;
  clinicAddresses: ClinicAddress[];
}

interface Slot {
  id: string;
  clinicId: string;
  startTime: string;
  endTime: string;
  duration: number;
  cost: number;
  days: string[];
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export default function SlotsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<SlotFormValues>({
    resolver: zodResolver(slotFormSchema),
    defaultValues: {
      clinicId: "",
      slotDuration: 30,
      slotCost: 500,
      startTime: "09:00",
      endTime: "17:00",
      days: [],
    },
  });

  // Fetch doctor data including clinic addresses
  const [doctorData, isLoading] = useFetch<Doctor>(`/users/${user?.uid}`, {
    needRaw: true,
  });

  // Fetch existing slots
  const [slots] = useFetch<Record<string, Slot>>(`/slots/${user?.uid}`);

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!doctorData || !doctorData.clinicAddresses) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <p className="text-muted-foreground">
          No clinic addresses found. Please add clinic addresses to your profile
          first.
        </p>
      </div>
    );
  }

  const onSubmit = async (values: SlotFormValues) => {
    try {
      // Create a new slot
      await mutateData({
        path: `/slots/${user?.uid}/${values.clinicId}`,
        data: {
          clinicId: values.clinicId,
          startTime: values.startTime,
          endTime: values.endTime,
          duration: values.slotDuration,
          cost: values.slotCost,
          days: values.days,
        },
        action: "create",
      });

      toast({
        title: "Success",
        description: "Slot created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating slot:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create slot",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Slot Management</h2>
          <p className="text-muted-foreground">
            Create and manage your appointment slots for each clinic
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Slots
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Slots</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="clinicId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Clinic</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a clinic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {doctorData?.clinicAddresses.map((clinic, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {clinic.address}, {clinic.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="slotDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slot Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slotCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost per Slot</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter cost"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Days</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {daysOfWeek.map((day) => (
                          <Button
                            key={day}
                            type="button"
                            variant={
                              field.value.includes(day) ? "default" : "outline"
                            }
                            className="h-8"
                            onClick={() => {
                              const newValue = field.value.includes(day)
                                ? field.value.filter((d) => d !== day)
                                : [...field.value, day];
                              field.onChange(newValue);
                            }}
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit">Create Slots</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctorData?.clinicAddresses.map((clinic, clinicIndex) => {
          const clinicSlots = slots
            ? Object.values(slots).filter(
                (slot) => slot.clinicId === clinicIndex.toString()
              )
            : [];

          return (
            <Card key={clinicIndex} className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    Clinic {clinicIndex + 1}
                  </h3>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span className="text-sm">
                      {clinic.address}, {clinic.city}
                    </span>
                  </div>
                </div>

                {clinicSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>
                          {slot.startTime} - {slot.endTime} ({slot.duration}{" "}
                          mins)
                        </span>
                      </div>
                      <span className="text-sm font-medium">₹{slot.cost}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {slot.days.map((day) => (
                        <span
                          key={day}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {clinicSlots.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No slots created yet
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
