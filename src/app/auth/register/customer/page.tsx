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

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { signInWithPhone, verifyOTP } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const [formData, setFormData] = useState({
    phoneNumber: "",
    otp: "",
    name: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!showOTP) {
        // Format phone number to E.164 format
        const formattedPhone = formData.phoneNumber.startsWith("+")
          ? formData.phoneNumber
          : `+${formData.phoneNumber}`;

        const result = await signInWithPhone(formattedPhone);
        if (result.success) {
          setShowOTP(true);
        } else {
          setError(
            "Failed to send OTP. Please verify your phone number and try again."
          );
        }
      } else {
        const result = await verifyOTP(formData.otp);
        if (result.success) {
          router.push("/dashboard");
        } else {
          setError("Invalid OTP. Please try again.");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Customer Registration
          </h1>
          <p className="text-sm text-muted-foreground">
            Create your account to access healthcare services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {!showOTP ? (
              <>
                <div className="space-y-1">
                  <Input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number (e.g., +1234567890)"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Please include your country code (e.g., +1 for US)
                  </p>
                </div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="date"
                  name="dateOfBirth"
                  placeholder="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
                <Select
                  name="gender"
                  value={formData.gender}
                  onValueChange={(value) =>
                    handleChange({ target: { name: "gender", value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </>
            ) : (
              <Input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                required
              />
            )}
          </div>

          {/* reCAPTCHA container - visible size */}
          {!showOTP && (
            <div
              id="recaptcha-container"
              className="flex justify-center my-4"
            ></div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : showOTP ? "Verify OTP" : "Send OTP"}
          </Button>
        </form>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <p className="text-sm text-center">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
