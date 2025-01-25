"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import mutateData from "@/lib/firebase/mutate-data";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Clock, MapPin, Stethoscope, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

// Form schema for doctor search
const searchFormSchema = z.object({
  specialization: z.string().min(1, "Please select a specialization"),
  location: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface Doctor {
  uid: string;
  name: string;
  email: string;
  qualification: string;
  specialization: string;
  experience: number;
  role: string;
  clinicAddresses: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    timings: {
      startTime: string;
      endTime: string;
      days: string[];
    };
    slots?: Record<
      string,
      {
        id: string;
        slotNumber: number;
        startTime: string;
        endTime: string;
        duration: number;
        price: number;
        isBooked?: boolean;
      }
    >;
  }[];
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

export default function NewAppointmentPage() {
  const { user } = useAuth();
  const { userData } = useAuthStore();
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
  };

  const validateRequiredFields = (info: PatientInfo | null) => {
    if (!info) return [];

    const required = [
      { field: "name", label: "Full Name" },
      { field: "phoneNumber", label: "Phone Number" },
      { field: "age", label: "Age" },
      { field: "gender", label: "Gender" },
      { field: "bloodGroup", label: "Blood Group" },
    ];

    return required
      .filter(({ field }) => !info[field as keyof PatientInfo])
      .map(({ label }) => label);
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
      return;
    }

    try {
      // Create appointment
      const appointmentData = {
        doctorId: selectedDoctor.uid,
        doctorName: selectedDoctor.name,
        patientId: user.uid,
        clinicIndex: selectedClinicIndex,
        slotId: selectedSlotId,
        status: "scheduled",
        createdAt: new Date().toISOString(),
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

      // Reset selection
      setSelectedDoctor(null);
      setSelectedClinicIndex(null);
      setSelectedSlotId(null);
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to book appointment",
      });
    }
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
                        <SelectItem value="General Medicine">
                          General Medicine
                        </SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Dermatology">Dermatology</SelectItem>
                        <SelectItem value="Orthopedics">Orthopedics</SelectItem>
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
        ) : filteredDoctors && filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <Card key={doctor.uid} className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">Dr. {doctor.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {doctor.specialization} • {doctor.experience} years exp.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {doctor.qualification}
                  </p>
                </div>

                <div className="space-y-4">
                  {doctor.clinicAddresses.map((clinic, clinicIndex) => {
                    const availableSlots = clinic.slots
                      ? Object.values(clinic.slots).filter(
                          (slot) => !slot.isBooked
                        )
                      : [];

                    return (
                      <div
                        key={clinicIndex}
                        className="rounded-lg border p-4 space-y-2"
                      >
                        <div className="flex items-center text-sm">
                          <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>
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

                        {availableSlots.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            {availableSlots.map((slot) => (
                              <Button
                                key={slot.id}
                                variant={
                                  selectedSlotId === slot.id
                                    ? "default"
                                    : "outline"
                                }
                                className="h-auto py-2"
                                onClick={() => {
                                  setSelectedDoctor(doctor);
                                  setSelectedClinicIndex(clinicIndex);
                                  setSelectedSlotId(slot.id);
                                }}
                              >
                                <div className="text-left">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-xs">
                                      {slot.startTime} - {slot.endTime}
                                    </span>
                                  </div>
                                  <p className="text-xs font-medium pt-1">
                                    ₹{slot.price}
                                  </p>
                                </div>
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground pt-2">
                            No slots available
                          </p>
                        )}
                      </div>
                    );
                  })}
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
                  `/${
                    userData?.role
                  }/profile/edit?returnUrl=${encodeURIComponent(
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
