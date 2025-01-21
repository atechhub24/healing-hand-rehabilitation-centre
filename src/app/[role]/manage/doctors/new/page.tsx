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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    setError("");

    const doctorData = {
      ...formData,
      experience: parseInt(formData.experience),
      clinicAddresses,
    };

    try {
      // TODO: Implement API call to create doctor
      router.push(`/${role}/manage/doctors`);
    } catch (error) {
      setError("Failed to create doctor. Please try again.");
    }
    setIsLoading(false);
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
          <h1 className="text-2xl font-semibold">Add New Doctor</h1>
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
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
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
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Clinic Addresses</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addClinicAddress}
                className="flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Another Clinic
              </Button>
            </div>

            {clinicAddresses.map((clinic, index) => (
              <div key={index} className="space-y-4 border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Clinic {index + 1}</h3>
                  {clinicAddresses.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeClinicAddress(index)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Clinic Address"
                    value={clinic.address}
                    onChange={(e) =>
                      handleClinicAddressChange(
                        index,
                        "address",
                        e.target.value
                      )
                    }
                    required
                    className="pl-9"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="text"
                    placeholder="City"
                    value={clinic.city}
                    onChange={(e) =>
                      handleClinicAddressChange(index, "city", e.target.value)
                    }
                    required
                  />
                  <Input
                    type="text"
                    placeholder="State"
                    value={clinic.state}
                    onChange={(e) =>
                      handleClinicAddressChange(index, "state", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
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
                  <Select
                    value={clinic.timings.days.join(",")}
                    onValueChange={(value) =>
                      handleTimingsChange(index, "days", value.split(","))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Working Days" />
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

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Opening Time
                    </label>
                    <Input
                      type="time"
                      value={clinic.timings.startTime}
                      onChange={(e) =>
                        handleTimingsChange(index, "startTime", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Closing Time
                    </label>
                    <Input
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
            <p className="text-sm text-red-500 text-center mt-2">{error}</p>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/${role}/manage/doctors`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Doctor"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
