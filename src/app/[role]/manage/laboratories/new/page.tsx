"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import { createUser } from "@/lib/firebase/create-user";
import mutateData from "@/lib/firebase/mutate-data";
import { Label } from "@/components/ui/label";

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
    email: "",
    password: "",
    name: "",
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

    try {
      // First create the user authentication
      const authResponse = await createUser(formData.email, formData.password);

      if (!authResponse.localId) {
        throw new Error("Failed to create user authentication");
      }

      // Prepare the laboratory data
      const laboratoryData = {
        email: formData.email,
        name: formData.name,
        license: formData.license,
        address: formData.address,
        operatingHours: formData.operatingHours,
        tests: tests.filter(
          (test) => test.name && test.price && test.turnaroundTime
        ),
        role: "laboratory",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        uid: authResponse.localId,
      };

      // Store the laboratory data in the database
      await mutateData({
        path: `/users/${authResponse.localId}`,
        data: laboratoryData,
        action: "create",
      });

      toast({
        title: "Success",
        description: "Laboratory created successfully",
      });
      router.push(`/${role}/manage/laboratories`);
    } catch (error) {
      console.error("Error creating laboratory:", error);
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
          <h1 className="text-2xl font-semibold text-foreground">
            Add New Laboratory
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
                    placeholder="laboratory@example.com"
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
              Basic Information
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Laboratory Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter laboratory name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="license"
                    type="text"
                    name="license"
                    placeholder="Enter license number"
                    value={formData.license}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-medium text-foreground pb-2 border-b border-border">
              Address Information
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="street"
                    type="text"
                    placeholder="Enter street address"
                    value={formData.address.street}
                    onChange={(e) =>
                      handleAddressChange("street", e.target.value)
                    }
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Enter city"
                    value={formData.address.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="Enter state"
                    value={formData.address.state}
                    onChange={(e) =>
                      handleAddressChange("state", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    type="text"
                    placeholder="Enter pincode"
                    value={formData.address.pincode}
                    onChange={(e) =>
                      handleAddressChange("pincode", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-medium text-foreground pb-2 border-b border-border">
              Operating Hours
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.operatingHours.startTime}
                    onChange={(e) =>
                      handleOperatingHoursChange("startTime", e.target.value)
                    }
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.operatingHours.endTime}
                    onChange={(e) =>
                      handleOperatingHoursChange("endTime", e.target.value)
                    }
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h2 className="text-lg font-medium text-foreground">
                Available Tests
              </h2>
              <Button type="button" variant="outline" onClick={addTest}>
                <Plus className="h-4 w-4 mr-2" /> Add Test
              </Button>
            </div>
            {tests.map((test, index) => (
              <div key={index} className="space-y-4 pt-4">
                {index > 0 && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTest(index)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4 mr-2" /> Remove Test
                    </Button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`test-name-${index}`}>Test Name</Label>
                    <Input
                      id={`test-name-${index}`}
                      type="text"
                      placeholder="Enter test name"
                      value={test.name}
                      onChange={(e) =>
                        handleTestChange(index, "name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`test-price-${index}`}>Price (₹)</Label>
                    <Input
                      id={`test-price-${index}`}
                      type="number"
                      placeholder="Enter price"
                      value={test.price}
                      onChange={(e) =>
                        handleTestChange(index, "price", e.target.value)
                      }
                      required
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`test-turnaround-${index}`}>
                      Turnaround Time
                    </Label>
                    <Input
                      id={`test-turnaround-${index}`}
                      type="text"
                      placeholder="e.g., 24 hours"
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
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Link href={`/${role}/manage/laboratories`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Creating..." : "Create Laboratory"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
