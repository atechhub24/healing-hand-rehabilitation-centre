"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
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
  Eye,
  EyeOff,
  Mail,
  User,
  Briefcase,
  MapPin,
  Lock,
  UserCheck,
  Plus,
  X,
} from "lucide-react";

type UserRole = "doctor" | "paramedic" | "lab";

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

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    confirmPassword: "",
    role: "" as UserRole | "",
    name: "",
    qualification: "",
    specialization: "",
    experience: "",
    location: "",
    labType: "",
    certifications: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const userData = {
      name: formData.name,
      qualification: formData.qualification,
      specialization: formData.specialization,
      experience: parseInt(formData.experience),
      location: formData.location,
      ...(formData.role === "doctor" && { clinicAddresses }),
      ...(formData.role === "paramedic" && {
        certifications: formData.certifications,
      }),
      ...(formData.role === "lab" && { labType: formData.labType }),
    };

    const result = await signUpWithEmail(
      formData.email,
      formData.password,
      formData.role as UserRole,
      userData
    );

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError("Registration failed. Please try again.");
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
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-[450px] space-y-6 rounded-lg border border-border/50 bg-card p-6 shadow-sm">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Healthcare Provider Registration
          </h1>
          <p className="text-sm text-muted-foreground">
            Create your account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 sm:space-y-3">
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
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <div className="relative">
              <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Select
                name="role"
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  handleChange({ target: { name: "role", value } })
                }
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="paramedic">Paramedic</SelectItem>
                  <SelectItem value="lab">Laboratory</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

            {formData.role === "doctor" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Clinic Addresses</h3>
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
                  <div key={index} className="space-y-3 border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">
                        Clinic {index + 1}
                      </h4>
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
                            handleTimingsChange(
                              index,
                              "startTime",
                              e.target.value
                            )
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
                  </div>
                ))}
              </div>
            )}

            {formData.role === "paramedic" && (
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  name="certifications"
                  placeholder="Professional Certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
            )}

            {formData.role === "lab" && (
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  name="labType"
                  placeholder="Laboratory Type"
                  value={formData.labType}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>

        {error && (
          <p className="text-sm text-red-500 text-center mt-2">{error}</p>
        )}

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
