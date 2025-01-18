"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Phone } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithPhone, verifyOTP } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [emailForm, setEmailForm] = useState({
    email: "",
    password: "",
  });

  const [phoneForm, setPhoneForm] = useState({
    phoneNumber: "",
    otp: "",
  });

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signInWithEmail(emailForm.email, emailForm.password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
    setIsLoading(false);
  };

  const handlePhoneLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!showOTP) {
        const formattedPhone = `+91${phoneForm.phoneNumber.replace(/\D/g, "")}`;
        const result = await signInWithPhone(formattedPhone);
        if (result.success) {
          setShowOTP(true);
        } else {
          setError(
            "Failed to send OTP. Please verify your phone number and try again."
          );
        }
      } else {
        const result = await verifyOTP(phoneForm.otp);
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneForm((prev) => ({ ...prev, phoneNumber: sanitizedValue }));
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPhoneForm((prev) => ({ ...prev, otp: sanitizedValue }));
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-[450px] space-y-6 rounded-lg border border-border/50 bg-card p-6 shadow-sm">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={emailForm.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmailForm({ ...emailForm, email: e.target.value })
                    }
                    required
                    className="pl-10 w-full"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={emailForm.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmailForm({ ...emailForm, password: e.target.value })
                    }
                    required
                    className="pl-10 pr-10 w-full"
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
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="phone">
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div className="space-y-3">
                {!showOTP ? (
                  <div className="space-y-2">
                    <div className="flex">
                      <div className="flex items-center justify-center rounded-l-md border border-r-0 bg-muted px-3">
                        +91
                      </div>
                      <Input
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={phoneForm.phoneNumber}
                        onChange={handlePhoneChange}
                        className="rounded-l-none"
                        required
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit mobile number"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter your 10-digit mobile number
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter OTP"
                        value={phoneForm.otp}
                        onChange={handleOTPChange}
                        required
                        pattern="[0-9]{6}"
                        maxLength={6}
                        title="Please enter the 6-digit OTP"
                        className="pl-10 w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter the 6-digit OTP sent to your phone
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {!showOTP && (
                <div
                  id="recaptcha-container"
                  className="flex justify-center my-4"
                ></div>
              )}

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading
                  ? "Processing..."
                  : showOTP
                  ? "Verify OTP"
                  : "Send OTP"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {error && (
          <p className="text-sm text-red-500 text-center mt-2">{error}</p>
        )}

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="text-blue-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
