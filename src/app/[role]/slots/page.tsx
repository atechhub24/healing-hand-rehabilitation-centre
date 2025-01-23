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
import { Clock, MapPin, Plus, Trash2 } from "lucide-react";

// Form schema for slot creation
const slotFormSchema = z.object({
  clinicId: z.string().min(1, "Please select a clinic"),
  numberOfSlots: z.coerce.number().min(1, "Must create at least 1 slot"),
  slotDuration: z.coerce
    .number()
    .min(15, "Slot duration must be at least 15 minutes"),
  pricePerSlot: z.coerce.number().min(0, "Price cannot be negative"),
});

type SlotFormValues = z.infer<typeof slotFormSchema>;

interface Slot {
  id: string;
  slotNumber: number;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
}

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
  slots?: Record<string, Slot>;
}

interface Doctor {
  uid: string;
  clinicAddresses: ClinicAddress[];
}

export default function SlotsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);

  const form = useForm<SlotFormValues>({
    resolver: zodResolver(slotFormSchema),
    defaultValues: {
      clinicId: "",
      numberOfSlots: 1,
      slotDuration: 30,
      pricePerSlot: 500,
    },
  });

  // Fetch doctor data including clinic addresses
  const [doctorData, isLoading] = useFetch<Doctor>(`/users/${user?.uid}`, {
    needRaw: true,
  });

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
      const clinicIndex = parseInt(values.clinicId);
      const clinic = doctorData.clinicAddresses[clinicIndex];
      const { numberOfSlots, slotDuration, pricePerSlot } = values;

      // Use clinic's timing
      const baseTime = new Date(`2000-01-01T${clinic.timings.startTime}`);
      const endTimeDate = new Date(`2000-01-01T${clinic.timings.endTime}`);

      // Create slots
      for (let i = 0; i < numberOfSlots; i++) {
        const slotStartTime = new Date(
          baseTime.getTime() + i * slotDuration * 60000
        );
        const slotEndTime = new Date(
          slotStartTime.getTime() + slotDuration * 60000
        );

        // Skip if slot would exceed end time
        if (slotEndTime > endTimeDate) break;

        const slotId = i.toString();
        const slotData = {
          id: slotId,
          slotNumber: i + 1,
          startTime: slotStartTime.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          endTime: slotEndTime.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          duration: slotDuration,
          price: pricePerSlot,
        };

        // Create slot using create action
        await mutateData({
          path: `/users/${user?.uid}/clinicAddresses/${clinicIndex}/slots/${slotId}`,
          data: slotData,
          action: "create",
        });
      }

      toast({
        title: "Success",
        description: `Created ${numberOfSlots} slots successfully`,
      });
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating slots:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create slots",
      });
    }
  };

  const deleteSlot = async (clinicIndex: number, slotId: string) => {
    try {
      await mutateData({
        path: `/users/${user?.uid}/clinicAddresses/${clinicIndex}/slots/${slotId}`,
        action: "delete",
      });

      toast({
        title: "Success",
        description: "Slot deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting slot:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete slot",
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
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedClinicId(value);
                        }}
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
                              <br />
                              <span className="text-xs text-muted-foreground">
                                Timings: {clinic.timings.startTime} -{" "}
                                {clinic.timings.endTime}
                              </span>
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
                    name="numberOfSlots"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Slots</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slotDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slot Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" min="15" step="15" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="pricePerSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Slot</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Enter price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedClinicId && (
                  <div className="rounded-lg bg-muted p-4 text-sm">
                    <h4 className="font-medium mb-2">
                      Selected Clinic Schedule
                    </h4>
                    <p>
                      Time:{" "}
                      {
                        doctorData.clinicAddresses[parseInt(selectedClinicId)]
                          .timings.startTime
                      }{" "}
                      -{" "}
                      {
                        doctorData.clinicAddresses[parseInt(selectedClinicId)]
                          .timings.endTime
                      }
                    </p>
                    <p>
                      Days:{" "}
                      {doctorData.clinicAddresses[
                        parseInt(selectedClinicId)
                      ].timings.days.join(", ")}
                    </p>
                  </div>
                )}

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
          const clinicSlots = clinic.slots
            ? Object.values(clinic.slots).sort(
                (a, b) => a.slotNumber - b.slotNumber
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
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Time: {clinic.timings.startTime} -{" "}
                      {clinic.timings.endTime}
                    </p>
                    <p>Days: {clinic.timings.days.join(", ")}</p>
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
                          Slot {slot.slotNumber}: {slot.startTime} -{" "}
                          {slot.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          ₹{slot.price}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => deleteSlot(clinicIndex, slot.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
