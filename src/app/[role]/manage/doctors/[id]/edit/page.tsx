"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Briefcase,
  MapPin,
  Mail,
  Plus,
  X,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import useFetch from "@/lib/hooks/use-fetch";
import { useToast } from "@/hooks/use-toast";
import mutateData from "@/lib/firebase/mutate-data";

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
}

interface Doctor {
  uid: string;
  email: string;
  name: string;
  qualification: string;
  specialization: string;
  experience: number;
  clinicAddresses: ClinicAddress[];
  role: string;
  createdAt: string;
  lastLogin: string;
}

interface PageParams {
  role: string;
  id: string;
}

export default function EditDoctorPage() {
  const router = useRouter();
  const rawParams = useParams();
  const params: PageParams = {
    role: rawParams.role as string,
    id: rawParams.id as string,
  };
  const { role } = params;
  const doctorId = params.id;

  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [doctor, isLoading] = useFetch<Doctor>(`/users/${doctorId}`, {
    needRaw: true,
  });
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    qualification: "",
    specialization: "",
    experience: "",
    clinicAddresses: [
      {
        address: "",
        city: "",
        state: "",
        pincode: "",
        timings: {
          startTime: "09:00",
          endTime: "17:00",
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
      },
    ],
  });

  useEffect(() => {
    if (doctor && !isFormInitialized) {
      setFormData({
        email: doctor.email || "",
        name: doctor.name || "",
        qualification: doctor.qualification || "",
        specialization: doctor.specialization || "",
        experience: doctor.experience?.toString() || "",
        clinicAddresses: doctor.clinicAddresses || [
          {
            address: "",
            city: "",
            state: "",
            pincode: "",
            timings: {
              startTime: "09:00",
              endTime: "17:00",
              days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            },
          },
        ],
      });
      setIsFormInitialized(true);
    }
  }, [doctor, isFormInitialized]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      // Prepare the doctor data - remove email from update data
      const doctorData = {
        name: formData.name,
        qualification: formData.qualification,
        specialization: formData.specialization,
        experience: parseInt(formData.experience),
        clinicAddresses: formData.clinicAddresses,
        role: "doctor",
        lastLogin: new Date().toISOString(),
      };

      // Update the doctor data in the database
      await mutateData({
        path: `/users/${doctorId}`,
        data: doctorData,
        action: "update",
      });

      toast({
        title: "Success",
        description: "Doctor updated successfully",
      });
      router.push(`/${role}/manage/doctors`);
    } catch (error) {
      console.error("Error updating doctor:", error);
      setError("Failed to update doctor. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update doctor",
      });
    }
    setIsSaving(false);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClinicAddressChange = (
    index: number,
    field: keyof Omit<ClinicAddress, "timings">,
    value: string
  ) => {
    setFormData((prev) => {
      const newAddresses = [...prev.clinicAddresses];
      newAddresses[index] = { ...newAddresses[index], [field]: value };
      return { ...prev, clinicAddresses: newAddresses };
    });
  };

  const handleTimingsChange = (
    index: number,
    field: keyof ClinicAddress["timings"],
    value: string | string[]
  ) => {
    setFormData((prev) => {
      const newAddresses = [...prev.clinicAddresses];
      newAddresses[index] = {
        ...newAddresses[index],
        timings: {
          ...newAddresses[index].timings,
          [field]: value,
        },
      };
      return { ...prev, clinicAddresses: newAddresses };
    });
  };

  const addClinicAddress = () => {
    setFormData((prev) => ({
      ...prev,
      clinicAddresses: [
        ...prev.clinicAddresses,
        {
          address: "",
          city: "",
          state: "",
          pincode: "",
          timings: {
            startTime: "09:00",
            endTime: "17:00",
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          },
        },
      ],
    }));
  };

  const removeClinicAddress = (index: number) => {
    if (formData.clinicAddresses.length > 1) {
      setFormData((prev) => ({
        ...prev,
        clinicAddresses: prev.clinicAddresses.filter((_, i) => i !== index),
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-3xl mx-auto text-center text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/${role}/manage/doctors`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Doctors
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">
            Edit Doctor
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-medium text-foreground pb-2 border-b border-border">
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  name="qualification"
                  placeholder="Qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Select
                    name="specialization"
                    value={formData.specialization}
                    onValueChange={(value) =>
                      handleChange({
                        target: { name: "specialization", value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="dermatology">Dermatology</SelectItem>
                      <SelectItem value="endocrinology">
                        Endocrinology
                      </SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    name="experience"
                    placeholder="Years of Experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    min="0"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h2 className="text-lg font-medium text-foreground">
                Clinic Addresses
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addClinicAddress}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Another Clinic
              </Button>
            </div>

            <div className="space-y-6">
              {formData.clinicAddresses.map((clinic, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-border bg-muted/50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-foreground">
                      Clinic {index + 1}
                    </h3>
                    {formData.clinicAddresses.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeClinicAddress(index)}
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 -mt-2 -mr-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Street Address"
                        value={clinic.address}
                        onChange={(e) =>
                          handleClinicAddressChange(
                            index,
                            "address",
                            e.target.value
                          )
                        }
                        required
                        className="pl-10"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        type="text"
                        placeholder="City"
                        value={clinic.city}
                        onChange={(e) =>
                          handleClinicAddressChange(
                            index,
                            "city",
                            e.target.value
                          )
                        }
                        required
                      />
                      <Input
                        type="text"
                        placeholder="State"
                        value={clinic.state}
                        onChange={(e) =>
                          handleClinicAddressChange(
                            index,
                            "state",
                            e.target.value
                          )
                        }
                        required
                      />
                      <Input
                        type="text"
                        placeholder="PIN Code"
                        value={clinic.pincode}
                        onChange={(e) =>
                          handleClinicAddressChange(
                            index,
                            "pincode",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Working Hours
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="time"
                            value={clinic.timings.startTime}
                            onChange={(e) =>
                              handleTimingsChange(
                                index,
                                "startTime",
                                e.target.value
                              )
                            }
                            required
                          />
                          <Input
                            type="time"
                            value={clinic.timings.endTime}
                            onChange={(e) =>
                              handleTimingsChange(
                                index,
                                "endTime",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Working Days
                        </label>
                        <Select
                          value={clinic.timings.days.join(",")}
                          onValueChange={(value) =>
                            handleTimingsChange(index, "days", value.split(","))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Days" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monday,Tuesday,Wednesday,Thursday,Friday">
                              Weekdays
                            </SelectItem>
                            <SelectItem value="Monday,Tuesday,Wednesday,Thursday,Friday,Saturday">
                              Weekdays + Saturday
                            </SelectItem>
                            <SelectItem value="Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday">
                              All Days
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
