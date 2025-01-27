"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import mutateData from "@/lib/firebase/mutate-data";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAuthStore } from "@/lib/store/auth-store";
import useFetch from "@/lib/hooks/use-fetch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Building2,
  CalendarDays,
  Clock,
  IndianRupee,
  Mail,
  MapPin,
  Stethoscope,
  Timer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form schema for doctor search
const searchFormSchema = z.object({
  specialization: z.string().min(1, "Please select a specialization"),
  location: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface Slot {
  id: string;
  slotNumber: number;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  isBooked?: boolean;
}

interface ClinicAddress {
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
  name: string;
  email: string;
  qualification: string;
  specialization: string;
  experience: number;
  role: string;
  clinicAddresses: ClinicAddress[];
}

interface PatientInfo {
  name?: string;
  phoneNumber?: string;
  email: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  allergies?: string;
  medicalHistory?: string;
}

const specializations = [
  "General Medicine",
  "Pediatrics",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Gynecology",
  "ENT",
  "Ophthalmology",
  "Neurology",
  "Psychiatry",
  "Dental",
] as const;

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export default function NewAppointmentPage() {
  const { user } = useAuth();
  const { role } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedClinicIndex, setSelectedClinicIndex] = useState<number | null>(
    null
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [specialization, setSpecialization] = useState<string>("");

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      specialization: "",
      location: "",
    },
  });

  // Fetch all doctors
  const [doctors, isLoading] = useFetch<Doctor[]>("users", {
    filter: (item: unknown) => {
      const doctor = item as Doctor;
      return doctor.role === "doctor";
    },
  });

  // Filter doctors based on search criteria
  const filteredDoctors = doctors?.filter((doctor) => {
    if (!specialization) return true;
    return doctor.specialization === specialization;
  });

  // Fetch patient information
  const [patientInfo] = useFetch<PatientInfo>(`/users/${user?.uid}`);

  // Handle form submission
  const onSubmit = (values: SearchFormValues) => {
    setSpecialization(values.specialization);
    // Reset selections when search criteria changes
    setSelectedDoctor(null);
    setSelectedClinicIndex(null);
    setSelectedSlotId(null);
  };

  const validateRequiredFields = (info: PatientInfo | null) => {
    if (!info) return [];

    const missing = [];
    if (!info.name) missing.push("Full Name");
    if (!info.phoneNumber) missing.push("Phone Number");
    if (!info.age) missing.push("Age");
    if (!info.gender) missing.push("Gender");
    if (!info.bloodGroup) missing.push("Blood Group");

    return missing;
  };

  const handleBookSlot = async () => {
    if (
      !user ||
      !selectedDoctor ||
      selectedClinicIndex === null ||
      !selectedSlotId
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a slot to book",
      });
      return;
    }

    // Check for required patient information
    const missing = validateRequiredFields(patientInfo);
    if (missing.length > 0) {
      setMissingFields(missing);
      setShowProfileDialog(true);
      toast({
        variant: "destructive",
        title: "Profile Incomplete",
        description: "Please update your profile to continue booking.",
      });
      return;
    }

    try {
      // Create appointment
      const appointmentData = {
        doctorId: selectedDoctor.uid,
        doctorName: selectedDoctor.name,
        doctorSpecialization: selectedDoctor.specialization,
        patientId: user.uid,
        patientName: patientInfo?.name,
        patientPhone: patientInfo?.phoneNumber,
        clinicIndex: selectedClinicIndex,
        clinicAddress: selectedDoctor.clinicAddresses[selectedClinicIndex],
        slotId: selectedSlotId,
        slotInfo:
          selectedDoctor.clinicAddresses[selectedClinicIndex].slots?.[
            selectedSlotId
          ],
        status: "scheduled",
        createdAt: Date.now(),
      };

      // Create appointment record
      await mutateData({
        path: `/appointments/${user.uid}_${selectedSlotId}`,
        data: appointmentData,
        action: "create",
      });

      // Mark slot as booked
      await mutateData({
        path: `/users/${selectedDoctor.uid}/clinicAddresses/${selectedClinicIndex}/slots/${selectedSlotId}`,
        data: { isBooked: true },
        action: "update",
      });

      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });

      // Redirect to appointments list
      router.push(`/${role}/appointments`);
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to book appointment",
      });
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getAvailableSlots = (clinic: ClinicAddress) => {
    if (!clinic.slots) return [];
    return Object.entries(clinic.slots)
      .filter(([, slot]) => !slot.isBooked)
      .map(([slotId, slot]) => ({ ...slot, id: slotId }))
      .sort((a, b) => a.slotNumber - b.slotNumber);
  };

  const isClinicOpen = (clinic: ClinicAddress) => {
    const today = daysOfWeek[new Date().getDay()];
    return clinic.timings.days.includes(today);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Book Appointment</h2>
        <p className="text-muted-foreground">
          Search for doctors and book your appointment
        </p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city or area" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Search</Button>
            </div>
          </form>
        </Form>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-muted-foreground">Loading doctors...</p>
        ) : filteredDoctors?.length ? (
          filteredDoctors.map((doctor) => (
            <Card
              key={doctor.uid}
              className={cn(
                "transition-all duration-200",
                selectedDoctor?.uid === doctor.uid
                  ? "ring-2 ring-primary"
                  : "hover:shadow-md"
              )}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {doctor.qualification}
                    </p>
                  </div>
                  <Badge variant="secondary">{doctor.experience}+ Years</Badge>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    <span>{doctor.specialization}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{doctor.email}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Clinic Locations</h4>
                  <div className="space-y-4">
                    {doctor.clinicAddresses.map((clinic, index) => (
                      <div
                        key={index}
                        className={cn(
                          "rounded-lg border p-4 transition-all duration-200",
                          selectedDoctor?.uid === doctor.uid &&
                            selectedClinicIndex === index
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-primary" />
                              <span className="font-medium">
                                {clinic.address}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {clinic.city}, {clinic.state} - {clinic.pincode}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              isClinicOpen(clinic) ? "default" : "secondary"
                            }
                          >
                            {isClinicOpen(clinic) ? "Open" : "Closed"}
                          </Badge>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            <span>
                              Available on: {clinic.timings.days.join(", ")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>
                              {formatTime(clinic.timings.startTime)} -{" "}
                              {formatTime(clinic.timings.endTime)}
                            </span>
                          </div>
                        </div>

                        {selectedDoctor?.uid === doctor.uid &&
                          selectedClinicIndex === index && (
                            <div className="mt-4 space-y-3">
                              <h5 className="font-medium text-sm">
                                Available Slots
                              </h5>
                              <div className="grid grid-cols-2 gap-2">
                                {getAvailableSlots(clinic).map((slot) => (
                                  <button
                                    key={slot.id}
                                    onClick={() => setSelectedSlotId(slot.id)}
                                    className={cn(
                                      "flex flex-col items-center rounded-lg border p-3 transition-all duration-200",
                                      selectedSlotId === slot.id
                                        ? "border-primary bg-primary/5"
                                        : "hover:border-primary/50"
                                    )}
                                  >
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                      <Timer className="h-4 w-4" />
                                      <span>
                                        {formatTime(slot.startTime)} -{" "}
                                        {formatTime(slot.endTime)}
                                      </span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                      <IndianRupee className="h-3 w-3" />
                                      <span>{slot.price}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                        <div className="mt-4">
                          <Button
                            type="button"
                            variant={
                              selectedDoctor?.uid === doctor.uid &&
                              selectedClinicIndex === index
                                ? "default"
                                : "secondary"
                            }
                            className="w-full"
                            onClick={() => {
                              if (
                                selectedDoctor?.uid === doctor.uid &&
                                selectedClinicIndex === index
                              ) {
                                // Reset all selections when hiding slots
                                setSelectedDoctor(null);
                                setSelectedClinicIndex(null);
                                setSelectedSlotId(null);
                              } else {
                                // Set selections when viewing slots
                                setSelectedDoctor(doctor);
                                setSelectedClinicIndex(index);
                                setSelectedSlotId(null);
                              }
                            }}
                          >
                            {selectedDoctor?.uid === doctor.uid &&
                            selectedClinicIndex === index
                              ? "Hide Slots"
                              : "View Slots"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No doctors found</p>
        )}
      </div>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Complete Your Profile
            </DialogTitle>
            <div className="space-y-2">
              <DialogDescription>
                Please update your profile with the following required
                information before booking an appointment:
              </DialogDescription>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {missingFields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </div>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="default"
              onClick={() => {
                setShowProfileDialog(false);
                router.push(
                  `/${role}/profile/edit?returnUrl=${encodeURIComponent(
                    window.location.pathname
                  )}`
                );
              }}
            >
              Update Profile
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowProfileDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedSlotId && (
        <div className="flex justify-end">
          <Button onClick={handleBookSlot}>Book Appointment</Button>
        </div>
      )}
    </div>
  );
}
