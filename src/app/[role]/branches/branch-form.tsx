"use client";

import { useState } from "react";
import { Branch } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Calendar, Clock } from "lucide-react";

interface BranchFormProps {
  branch?: Branch | null;
  onSubmit: (data: Omit<Branch, "id" | "createdAt" | "creatorInfo">) => void;
  onClose: () => void;
}

/**
 * Branch Form Component
 * 
 * This component provides a form for creating and editing clinic branches.
 * It includes validation and handles all branch-related fields.
 */
export default function BranchForm({ branch, onSubmit, onClose }: BranchFormProps) {
  const [formData, setFormData] = useState({
    name: branch?.name || "",
    address: branch?.address || "",
    city: branch?.city || "",
    state: branch?.state || "",
    pincode: branch?.pincode || "",
    phoneNumber: branch?.phoneNumber || "",
    email: branch?.email || "",
    managerName: branch?.managerName || "",
    managerPhone: branch?.managerPhone || "",
    timings: {
      startTime: branch?.timings.startTime || "09:00",
      endTime: branch?.timings.endTime || "18:00",
      days: branch?.timings.days || [],
    },
    isActive: branch?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Available days for selection
  const availableDays = [
    "Monday",
    "Tuesday", 
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  // Time options for select dropdowns
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Handle timing changes
  const handleTimingChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      timings: {
        ...prev.timings,
        [field]: value
      }
    }));
  };

  // Handle day selection
  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      timings: {
        ...prev.timings,
        days: prev.timings.days.includes(day)
          ? prev.timings.days.filter(d => d !== day)
          : [...prev.timings.days, day]
      }
    }));
  };

  // Validate form data
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Branch name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.managerPhone && !/^\+?[\d\s-()]+$/.test(formData.managerPhone)) {
      newErrors.managerPhone = "Invalid manager phone format";
    }

    if (formData.timings.days.length === 0) {
      newErrors.days = "At least one day must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {branch ? "Edit Branch" : "Add New Branch"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Branch Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter branch name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="+91 9876543210"
                    className={errors.phoneNumber ? "border-red-500" : ""}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter complete address"
                  className={errors.address ? "border-red-500" : ""}
                  rows={3}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Enter city"
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="Enter state"
                    className={errors.state ? "border-red-500" : ""}
                  />
                  {errors.state && (
                    <p className="text-sm text-red-500">{errors.state}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    placeholder="400001"
                    maxLength={6}
                    className={errors.pincode ? "border-red-500" : ""}
                  />
                  {errors.pincode && (
                    <p className="text-sm text-red-500">{errors.pincode}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="branch@clinic.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Manager Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Manager Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="managerName">Manager Name</Label>
                  <Input
                    id="managerName"
                    value={formData.managerName}
                    onChange={(e) => handleInputChange("managerName", e.target.value)}
                    placeholder="Enter manager name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="managerPhone">Manager Phone</Label>
                  <Input
                    id="managerPhone"
                    value={formData.managerPhone}
                    onChange={(e) => handleInputChange("managerPhone", e.target.value)}
                    placeholder="+91 9876543211"
                    className={errors.managerPhone ? "border-red-500" : ""}
                  />
                  {errors.managerPhone && (
                    <p className="text-sm text-red-500">{errors.managerPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Operating Hours</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Select
                    value={formData.timings.startTime}
                    onValueChange={(value) => handleTimingChange("startTime", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Select
                    value={formData.timings.endTime}
                    onValueChange={(value) => handleTimingChange("endTime", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Operating Days *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableDays.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={formData.timings.days.includes(day)}
                        onCheckedChange={() => handleDayToggle(day)}
                      />
                      <Label htmlFor={day} className="text-sm">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.days && (
                  <p className="text-sm text-red-500">{errors.days}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status</h3>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                />
                <Label htmlFor="isActive">
                  Branch is active and operational
                </Label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {branch ? "Update Branch" : "Create Branch"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}