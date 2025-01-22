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
  Building,
  MapPin,
  Mail,
  Plus,
  X,
  ArrowLeft,
  Clock,
  FileText,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { database } from "@/lib/firebase";
import { ref, set } from "firebase/database";
import { useToast } from "@/hooks/use-toast";

interface Test {
  name: string;
  price: string;
  turnaroundTime: string;
}

export default function NewLaboratoryPage() {
  const router = useRouter();
  const { role } = useParams();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    license: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    operatingHours: {
      startTime: "09:00",
      endTime: "17:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  });

  const [tests, setTests] = useState<Test[]>([
    { name: "", price: "", turnaroundTime: "" },
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    const laboratoryData = {
      ...formData,
      role: "laboratory",
      tests: tests.filter(
        (test) => test.name && test.price && test.turnaroundTime
      ),
      createdAt: new Date().toISOString(),
    };

    try {
      const newLaboratoryRef = ref(database, `/laboratories/${Date.now()}`);
      await set(newLaboratoryRef, laboratoryData);
      toast({
        title: "Success",
        description: "Laboratory created successfully",
      });
      router.push(`/${role}/manage/laboratories`);
    } catch (error) {
      setError("Failed to create laboratory. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create laboratory",
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

  const handleAddressChange = (
    field: keyof typeof formData.address,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleOperatingHoursChange = (
    field: keyof typeof formData.operatingHours,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [field]: value,
      },
    }));
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

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/${role}/manage/laboratories`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Laboratories
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Add New Laboratory</h1>
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
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  name="name"
                  placeholder="Laboratory Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  name="license"
                  placeholder="License Number"
                  value={formData.license}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-medium pb-2 border-b">
              Location & Hours
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Street Address"
                  value={formData.address.street}
                  onChange={(e) =>
                    handleAddressChange("street", e.target.value)
                  }
                  required
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="City"
                    value={formData.address.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    required
                    className="pl-10"
                  />
                </div>
                <Input
                  type="text"
                  placeholder="State"
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="PIN Code"
                  value={formData.address.pincode}
                  onChange={(e) =>
                    handleAddressChange("pincode", e.target.value)
                  }
                  required
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">
                    Operating Hours
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        type="time"
                        value={formData.operatingHours.startTime}
                        onChange={(e) =>
                          handleOperatingHoursChange(
                            "startTime",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="time"
                        value={formData.operatingHours.endTime}
                        onChange={(e) =>
                          handleOperatingHoursChange("endTime", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">
                    Operating Days
                  </label>
                  <Select
                    value={formData.operatingHours.days.join(",")}
                    onValueChange={(value) =>
                      handleOperatingHoursChange("days", value.split(","))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Operating Days" />
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

          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Available Tests</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTest}
                className="flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Another Test
              </Button>
            </div>

            {tests.map((test, index) => (
              <div key={index} className="space-y-4 border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Test {index + 1}</h3>
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

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    type="text"
                    placeholder="Test Name"
                    value={test.name}
                    onChange={(e) =>
                      handleTestChange(index, "name", e.target.value)
                    }
                    required
                  />
                  <Input
                    type="number"
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
                      handleTestChange(index, "turnaroundTime", e.target.value)
                    }
                    required
                  />
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
              onClick={() => router.push(`/${role}/manage/laboratories`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Creating..." : "Create Laboratory"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
