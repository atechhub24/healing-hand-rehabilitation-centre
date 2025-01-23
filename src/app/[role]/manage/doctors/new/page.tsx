"use client";

import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { createUser } from "@/lib/firebase/create-user";
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

export default function NewDoctorPage() {
  const router = useRouter();
  const { role } = useParams();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [clinicAddresses, setClinicAddresses] = useState<ClinicAddress[]>([
    {
      address: "",
      city: "",
      state: "",
      pincode: "",
      timings: {
        startTime: "09:00",
        endTime: "17:00",
        days: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      },
    },
  ]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      // First create the user authentication
      const authResponse = await createUser(formData.email, formData.password);

      if (!authResponse.localId) {
        throw new Error("Failed to create user authentication");
      }

      // Prepare the doctor data
      const doctorData = {
        email: formData.email,
        name: formData.name,
        qualification: formData.qualification,
        specialization: formData.specialization,
        experience: parseInt(formData.experience),
        clinicAddresses,
        role: "doctor",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        uid: authResponse.localId,
      };

      // Store the doctor data in the database
      await mutateData({
        path: `/users/${authResponse.localId}`,
        data: doctorData,
        action: "create",
      });

      toast({
        title: "Success",
        description: "Doctor created successfully",
      });
      router.push(`/${role}/manage/doctors`);
    } catch (error) {
      console.error("Error creating doctor:", error);
      setError("Failed to create doctor. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create doctor",
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
    const newAddresses = [...clinicAddresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setClinicAddresses(newAddresses);
  };

  const handleTimingsChange = (
    index: number,
    field: keyof ClinicAddress["timings"],
    value: string | string[]
  ) => {
    const newAddresses = [...clinicAddresses];
    newAddresses[index] = {
      ...newAddresses[index],
      timings: {
        ...newAddresses[index].timings,
        [field]: value,
      },
    };
    setClinicAddresses(newAddresses);
  };

  const addClinicAddress = () => {
    setClinicAddresses([
      ...clinicAddresses,
      {
        address: "",
        city: "",
        state: "",
        pincode: "",
        timings: {
          startTime: "09:00",
          endTime: "17:00",
          days: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
      },
    ]);
  };

  const removeClinicAddress = (index: number) => {
    if (clinicAddresses.length > 1) {
      setClinicAddresses(clinicAddresses.filter((_, i) => i !== index));
    }
  };

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
            Add New Doctor
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-medium text-foreground pb-2 border-b border-border">
              Credentials
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
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-medium text-foreground pb-2 border-b border-border">
              Personal Information
            </h2>
            <div className="space-y-4">
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
            {clinicAddresses.map((clinic, index) => (
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
            <Link href={`/${role}/manage/doctors`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Creating..." : "Create Doctor"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
