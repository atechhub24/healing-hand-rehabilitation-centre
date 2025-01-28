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
  FileText,
  Clock,
} from "lucide-react";
import Link from "next/link";

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

interface Test {
  name: string;
  price: string;
  turnaroundTime: string;
}

const defaultTimings = {
  startTime: "09:00",
  endTime: "17:00",
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

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
      timings: defaultTimings,
    },
  ]);

  const [tests, setTests] = useState<Test[]>([
    { name: "", price: "", turnaroundTime: "" },
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
    certifications: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    startTime: "09:00",
    endTime: "17:00",
    workingDays: "Monday,Tuesday,Wednesday,Thursday,Friday",
    license: "",
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
      ...formData,
      role: formData.role as UserRole,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      address: formData.role === "lab" ? formData.address : undefined,
      license: formData.role === "lab" ? formData.license : undefined,
      location:
        formData.role === "doctor"
          ? clinicAddresses[0]?.address || ""
          : formData.city + "," + formData.state,
      certifications:
        formData.role === "paramedic" ? formData.certifications : undefined,
      clinicAddresses: formData.role === "doctor" ? clinicAddresses : undefined,
      specialization: formData.specialization || undefined,
      experience: formData.experience
        ? parseInt(formData.experience)
        : undefined,
    };

    const result = await signUpWithEmail(
      formData.email,
      formData.password,
      formData.role as UserRole,
      userData
    );

    if (result.success) {
      router.push(`/${formData.role}`);
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
        timings: defaultTimings,
      },
    ]);
  };

  const removeClinicAddress = (index: number) => {
    if (clinicAddresses.length > 1) {
      setClinicAddresses(clinicAddresses.filter((_, i) => i !== index));
    }
  };

  const handleTestChange = (
    index: number,
    field: keyof Test,
    value: string
  ) => {
    const newTests = [...tests];
    newTests[index] = { ...newTests[index], [field]: value };
    setTests(newTests);
  };

  const addTest = () => {
    setTests([...tests, { name: "", price: "", turnaroundTime: "" }]);
  };

  const removeTest = (index: number) => {
    if (tests.length > 1) {
      setTests(tests.filter((_, i) => i !== index));
    }
  };

  const renderField = (
    icon: React.ReactNode,
    name: string,
    placeholder: string,
    type = "text"
  ) => (
    <div className="relative">
      {icon}
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        required
        className="pl-10"
      />
    </div>
  );

  const renderTimingSelect = (
    value: string,
    onChange: (value: string) => void
  ) => (
    <div className="relative">
      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="pl-10">
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
  );

  const renderTimeInputs = (
    startTime: string,
    endTime: string,
    onChange: (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | { target: { name: string; value: string } }
    ) => void
  ) => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Start Time</label>
        <Input
          type="time"
          name="startTime"
          value={startTime}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">End Time</label>
        <Input
          type="time"
          name="endTime"
          value={endTime}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );

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
            {renderField(
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />,
              "email",
              "Email",
              "email"
            )}

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

            {renderField(
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />,
              "name",
              "Full Name"
            )}
            {renderField(
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />,
              "qualification",
              "Qualification"
            )}
            {renderField(
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />,
              "specialization",
              "Specialization"
            )}
            {renderField(
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />,
              "experience",
              "Years of Experience",
              "number"
            )}

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
              <>
                {renderField(
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />,
                  "certifications",
                  "Professional Certifications"
                )}
                {renderTimingSelect(formData.workingDays, (value) =>
                  handleChange({ target: { name: "workingDays", value } })
                )}
                {renderTimeInputs(
                  formData.startTime,
                  formData.endTime,
                  handleChange
                )}
                {renderField(
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />,
                  "city",
                  "City"
                )}
                {renderField(
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />,
                  "state",
                  "State"
                )}
                {renderField(
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />,
                  "pincode",
                  "PIN Code"
                )}
              </>
            )}

            {formData.role === "lab" && (
              <>
                {renderField(
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />,
                  "license",
                  "Laboratory License Number"
                )}
                {renderField(
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />,
                  "address",
                  "Laboratory Address"
                )}
                {renderField(
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />,
                  "city",
                  "City"
                )}
                {renderField(
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />,
                  "state",
                  "State"
                )}
                {renderField(
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />,
                  "pincode",
                  "PIN Code"
                )}
                {renderTimingSelect(formData.workingDays, (value) =>
                  handleChange({ target: { name: "workingDays", value } })
                )}
                {renderTimeInputs(
                  formData.startTime,
                  formData.endTime,
                  handleChange
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Test Services</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTest}
                      className="flex items-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Test
                    </Button>
                  </div>
                  {tests.map((test, index) => (
                    <div
                      key={index}
                      className="space-y-3 border rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">
                          Test {index + 1}
                        </h4>
                        {tests.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTest(index)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <Input
                        type="text"
                        placeholder="Test Name"
                        value={test.name}
                        onChange={(e) =>
                          handleTestChange(index, "name", e.target.value)
                        }
                        required
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="text"
                          placeholder="Price"
                          value={test.price}
                          onChange={(e) =>
                            handleTestChange(index, "price", e.target.value)
                          }
                          required
                        />
                        <Input
                          type="text"
                          placeholder="Turnaround Time"
                          value={test.turnaroundTime}
                          onChange={(e) =>
                            handleTestChange(
                              index,
                              "turnaroundTime",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
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
          <Link href="/auth/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
