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
} from "lucide-react";
import Link from "next/link";
import useFetch from "@/lib/hooks/use-fetch";
import { useToast } from "@/hooks/use-toast";
import mutateData from "@/lib/firebase/mutate-data";
import { Label } from "@/components/ui/label";

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

interface Staff {
  uid: string;
  email: string;
  name: string;
  title?: string; // Job title/position
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

export default function EditStaffPage() {
  const router = useRouter();
  const rawParams = useParams();
  const params: PageParams = {
    role: rawParams.role as string,
    id: rawParams.id as string,
  };
  const { role } = params;
  const staffId = params.id;

  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [staff, isLoading] = useFetch<Staff>(`/users/${staffId}`, {
    needRaw: true,
  });
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    title: "",
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
    if (staff && !isFormInitialized) {
      setFormData({
        email: staff.email || "",
        name: staff.name || "",
        title: staff.title || "",
        qualification: staff.qualification || "",
        specialization: staff.specialization || "",
        experience: staff.experience?.toString() || "",
        clinicAddresses: staff.clinicAddresses || [
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
  }, [staff, isFormInitialized]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      // Prepare the staff data - remove email from update data
      const staffData = {
        name: formData.name,
        title: formData.title,
        qualification: formData.qualification,
        specialization: formData.specialization,
        experience: parseInt(formData.experience),
        clinicAddresses: formData.clinicAddresses,
        role: "doctor",
        lastLogin: new Date().toISOString(),
      };

      // Update the staff data in the database
      await mutateData({
        path: `/users/${staffId}`,
        data: staffData,
        action: "update",
      });

      toast({
        title: "Success",
        description: "Staff updated successfully",
      });
      router.push(`/${role}/manage/staff`);
    } catch (error) {
      console.error("Error updating staff:", error);
      setError("Failed to update staff. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update staff",
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
          <Link href={`/${role}/manage/staff`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Staff
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">Edit Staff</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-medium text-foreground pb-2 border-b border-border">
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="doctor@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Dr. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="e.g. Senior Doctor, Nurse, Receptionist"
                    value={formData.title}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="qualification"
                    type="text"
                    name="qualification"
                    placeholder="MBBS, MD"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select
                  name="specialization"
                  value={formData.specialization}
                  onValueChange={(value) =>
                    handleChange({ target: { name: "specialization", value } })
                  }
                  required
                >
                  <SelectTrigger id="specialization">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                    <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                    <SelectItem value="Gastroenterology">
                      Gastroenterology
                    </SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Oncology">Oncology</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (years)</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="experience"
                    type="number"
                    name="experience"
                    placeholder="Years of experience"
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
                onClick={addClinicAddress}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Another Clinic
              </Button>
            </div>
            {formData.clinicAddresses.map((clinic, index) => (
              <div key={index} className="space-y-4 pt-4">
                {index > 0 && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeClinicAddress(index)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4 mr-2" /> Remove Clinic
                    </Button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`address-${index}`}>Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id={`address-${index}`}
                        type="text"
                        placeholder="Clinic address"
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`city-${index}`}>City</Label>
                    <Input
                      id={`city-${index}`}
                      type="text"
                      placeholder="City"
                      value={clinic.city}
                      onChange={(e) =>
                        handleClinicAddressChange(index, "city", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`state-${index}`}>State</Label>
                    <Input
                      id={`state-${index}`}
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`pincode-${index}`}>Pincode</Label>
                    <Input
                      id={`pincode-${index}`}
                      type="text"
                      placeholder="Pincode"
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
                  <div className="space-y-2">
                    <Label htmlFor={`startTime-${index}`}>Start Time</Label>
                    <Input
                      id={`startTime-${index}`}
                      type="time"
                      value={clinic.timings.startTime}
                      onChange={(e) =>
                        handleTimingsChange(index, "startTime", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`endTime-${index}`}>End Time</Label>
                    <Input
                      id={`endTime-${index}`}
                      type="time"
                      value={clinic.timings.endTime}
                      onChange={(e) =>
                        handleTimingsChange(index, "endTime", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Link href={`/${role}/manage/staff`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
