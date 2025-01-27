"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/hooks/use-auth";
import { Calendar, Lock, MapPin, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
        // Add +91 prefix to the phone number
        const formattedPhone = `+91${formData.phoneNumber.replace(/\D/g, "")}`;
        const result = await signInWithPhone(formattedPhone);
        if (result.success) {
          setShowOTP(true);
        } else {
          setError(
            "Failed to send OTP. Please verify your phone number and try again."
          );
        }
      } else {
        const { otp, ...userData } = formData;
        const result = await verifyOTP(otp, userData);
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
    if (name === "phoneNumber") {
      // Only allow numbers and limit to 10 digits
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-[450px] space-y-6 rounded-lg border border-border/50 bg-card p-6 shadow-sm">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Customer Registration
          </h1>
          <p className="text-sm text-muted-foreground">
            Create your account to access healthcare services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {!showOTP ? (
              <>
                <div className="space-y-1">
                  <div className="flex">
                    <div className="flex items-center justify-center rounded-l-md border border-r-0 bg-gray-50 px-3">
                      +91
                    </div>
                    <Input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Enter 10-digit mobile number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="rounded-l-none"
                      required
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter your 10-digit mobile number
                  </p>
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
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="date"
                    name="dateOfBirth"
                    placeholder="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Select
                    name="gender"
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleChange({ target: { name: "gender", value } })
                    }
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </>
            ) : (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  pattern="[0-9]*"
                  maxLength={6}
                  title="Please enter the 6-digit OTP"
                  className="pl-10"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the 6-digit OTP sent to your phone
                </p>
              </div>
            )}
          </div>

          {!showOTP && (
            <div
              id="recaptcha-container"
              className="flex justify-center my-4"
            ></div>
          )}

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Processing..." : showOTP ? "Verify OTP" : "Send OTP"}
          </Button>
        </form>

        {error && (
          <p className="text-sm text-red-500 text-center mt-2">{error}</p>
        )}

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login">
            <a className="text-blue-500 hover:underline">Sign in</a>
          </Link>
        </p>
      </div>
    </div>
  );
}
