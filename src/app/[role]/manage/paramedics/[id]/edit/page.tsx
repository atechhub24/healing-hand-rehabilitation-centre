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
  Clock,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import useFetch from "@/lib/hooks/use-fetch";
import { useToast } from "@/hooks/use-toast";
import mutateData from "@/lib/firebase/mutate-data";

interface Paramedic {
  uid: string;
  email: string;
  name: string;
  role: string;
  qualification: string;
  specialization: string;
  experience: number;
  availability: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  serviceArea: {
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
  lastLogin: string;
}

interface PageParams {
  role: string;
  id: string;
}

export default function EditParamedicPage() {
  const router = useRouter();
  const rawParams = useParams();
  const params: PageParams = {
    role: rawParams.role as string,
    id: rawParams.id as string,
  };
  const { role } = params;
  const paramedicId = params.id;

  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [paramedic, isLoading] = useFetch<Paramedic>(`/users/${paramedicId}`, {
    needRaw: true,
  });
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    qualification: "",
    specialization: "",
    experience: "",
    availability: {
      startTime: "09:00",
      endTime: "17:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    serviceArea: {
      city: "",
      state: "",
      pincode: "",
    },
  });

  useEffect(() => {
    if (paramedic && !isFormInitialized) {
      setFormData({
        email: paramedic.email || "",
        name: paramedic.name || "",
        qualification: paramedic.qualification || "",
        specialization: paramedic.specialization || "",
        experience: paramedic.experience?.toString() || "",
        availability: paramedic.availability || {
          startTime: "09:00",
          endTime: "17:00",
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
        serviceArea: paramedic.serviceArea || {
          city: "",
          state: "",
          pincode: "",
        },
      });
      setIsFormInitialized(true);
    }
  }, [paramedic, isFormInitialized]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      // Prepare the paramedic data - remove email from update data
      const paramedicData = {
        name: formData.name,
        qualification: formData.qualification,
        specialization: formData.specialization,
        experience: parseInt(formData.experience),
        availability: formData.availability,
        serviceArea: formData.serviceArea,
        role: "paramedic",
        lastLogin: new Date().toISOString(),
      };

      // Update the paramedic data in the database
      await mutateData({
        path: `/users/${paramedicId}`,
        data: paramedicData,
        action: "update",
      });

      toast({
        title: "Success",
        description: "Paramedic updated successfully",
      });
      router.push(`/${role}/manage/paramedics`);
    } catch (error) {
      console.error("Error updating paramedic:", error);
      setError("Failed to update paramedic. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update paramedic",
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

  const handleServiceAreaChange = (
    field: keyof typeof formData.serviceArea,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      serviceArea: {
        ...prev.serviceArea,
        [field]: value,
      },
    }));
  };

  const handleAvailabilityChange = (
    field: keyof typeof formData.availability,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [field]: value,
      },
    }));
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
          <Link href={`/${role}/manage/paramedics`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Paramedics
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">
            Edit Paramedic
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-medium text-foreground pb-2 border-b border-border">
              Basic Information
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
                      <SelectItem value="emergency">Emergency Care</SelectItem>
                      <SelectItem value="critical">Critical Care</SelectItem>
                      <SelectItem value="trauma">Trauma Care</SelectItem>
                      <SelectItem value="cardiac">Cardiac Care</SelectItem>
                      <SelectItem value="pediatric">Pediatric Care</SelectItem>
                      <SelectItem value="geriatric">Geriatric Care</SelectItem>
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
            <h2 className="text-lg font-medium text-foreground pb-2 border-b border-border">
              Service Area
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Input
                  type="text"
                  placeholder="City"
                  value={formData.serviceArea.city}
                  onChange={(e) =>
                    handleServiceAreaChange("city", e.target.value)
                  }
                  required
                />
                <Input
                  type="text"
                  placeholder="State"
                  value={formData.serviceArea.state}
                  onChange={(e) =>
                    handleServiceAreaChange("state", e.target.value)
                  }
                  required
                />
                <Input
                  type="text"
                  placeholder="PIN Code"
                  value={formData.serviceArea.pincode}
                  onChange={(e) =>
                    handleServiceAreaChange("pincode", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-medium text-foreground pb-2 border-b border-border">
              Availability
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Working Hours
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="time"
                      value={formData.availability.startTime}
                      onChange={(e) =>
                        handleAvailabilityChange("startTime", e.target.value)
                      }
                      required
                    />
                    <Input
                      type="time"
                      value={formData.availability.endTime}
                      onChange={(e) =>
                        handleAvailabilityChange("endTime", e.target.value)
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
                    value={formData.availability.days.join(",")}
                    onValueChange={(value) =>
                      handleAvailabilityChange("days", value.split(","))
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
