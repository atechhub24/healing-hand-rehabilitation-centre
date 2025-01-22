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
import { database } from "@/lib/firebase";
import { ref, update } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import useFetch from "@/lib/hooks/use-fetch";

interface Paramedic {
  id: string;
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
    password: "",
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
        password: "",
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

    const paramedicData = {
      ...formData,
      role: "paramedic",
      experience: parseInt(formData.experience),
    };

    try {
      const paramedicRef = ref(database, `/paramedics/${paramedicId}`);
      await update(paramedicRef, paramedicData);
      toast({
        title: "Success",
        description: "Paramedic updated successfully",
      });
      router.push(`/${role}/manage/paramedics`);
    } catch (error) {
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
        <div className="max-w-3xl mx-auto text-center">Loading...</div>
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
          <h1 className="text-2xl font-semibold">Edit Paramedic</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-medium pb-2 border-b">Credentials</h2>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password (leave empty to keep unchanged)"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-medium pb-2 border-b">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="number"
                  name="experience"
                  placeholder="Years of Experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-medium pb-2 border-b">
              Service Area & Availability
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="City"
                    value={formData.serviceArea.city}
                    onChange={(e) =>
                      handleServiceAreaChange("city", e.target.value)
                    }
                    required
                    className="pl-10"
                  />
                </div>
                <Input
                  type="text"
                  placeholder="State"
                  value={formData.serviceArea.state}
                  onChange={(e) =>
                    handleServiceAreaChange("state", e.target.value)
                  }
                  required
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="PIN Code"
                  value={formData.serviceArea.pincode}
                  onChange={(e) =>
                    handleServiceAreaChange("pincode", e.target.value)
                  }
                  required
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">
                    Working Hours
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        type="time"
                        value={formData.availability.startTime}
                        onChange={(e) =>
                          handleAvailabilityChange("startTime", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
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
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">
                    Working Days
                  </label>
                  <Select
                    value={formData.availability.days.join(",")}
                    onValueChange={(value) =>
                      handleAvailabilityChange("days", value.split(","))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Working Days" />
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
            <p className="text-sm text-red-500 text-center mt-2">{error}</p>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/${role}/manage/paramedics`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
