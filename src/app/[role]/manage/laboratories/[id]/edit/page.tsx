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
import useFetch from "@/lib/hooks/use-fetch";
import { useToast } from "@/hooks/use-toast";
import mutateData from "@/lib/firebase/mutate-data";
import { Label } from "@/components/ui/label";

interface Test {
  name: string;
  price: string;
  turnaroundTime: string;
}

interface Laboratory {
  uid: string;
  email: string;
  name: string;
  license: string;
  role: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  operatingHours: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  tests: Test[];
  createdAt: string;
  lastLogin: string;
}

interface PageParams {
  role: string;
  id: string;
}

export default function EditLaboratoryPage() {
  const router = useRouter();
  const rawParams = useParams();
  const params: PageParams = {
    role: rawParams.role as string,
    id: rawParams.id as string,
  };
  const { role } = params;
  const laboratoryId = params.id;

  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [laboratory, isLoading] = useFetch<Laboratory>(
    `/users/${laboratoryId}`,
    {
      needRaw: true,
    }
  );
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
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

  useEffect(() => {
    if (laboratory && !isFormInitialized) {
      setFormData({
        email: laboratory.email || "",
        name: laboratory.name || "",
        license: laboratory.license || "",
        address: laboratory.address || {
          street: "",
          city: "",
          state: "",
          pincode: "",
        },
        operatingHours: laboratory.operatingHours || {
          startTime: "09:00",
          endTime: "17:00",
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
      });
      setTests(
        laboratory.tests || [{ name: "", price: "", turnaroundTime: "" }]
      );
      setIsFormInitialized(true);
    }
  }, [laboratory, isFormInitialized]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      // Prepare the laboratory data - remove email from update data
      const laboratoryData = {
        name: formData.name,
        license: formData.license,
        address: formData.address,
        operatingHours: formData.operatingHours,
        tests: tests.filter(
          (test) => test.name && test.price && test.turnaroundTime
        ),
        role: "laboratory",
        lastLogin: new Date().toISOString(),
      };

      // Update the laboratory data in the database
      await mutateData({
        path: `/users/${laboratoryId}`,
        data: laboratoryData,
        action: "update",
      });

      toast({
        title: "Success",
        description: "Laboratory updated successfully",
      });
      router.push(`/${role}/manage/laboratories`);
    } catch (error) {
      console.error("Error updating laboratory:", error);
      setError("Failed to update laboratory. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update laboratory",
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
          <Link href={`/${role}/manage/laboratories`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Laboratories
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">
            Edit Laboratory
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-medium text-foreground pb-2 border-b border-border">
              Basic Information
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
                    disabled
                    className="pl-10"
                  />
                </div>
              </div>
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
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
