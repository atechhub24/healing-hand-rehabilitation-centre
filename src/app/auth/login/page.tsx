"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithPhone, verifyOTP } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);

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

    if (!showOTP) {
      const result = await signInWithPhone(phoneForm.phoneNumber);
      if (result.success) {
        setShowOTP(true);
      } else {
        setError("Failed to send OTP");
      }
    } else {
      const result = await verifyOTP(phoneForm.otp);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError("Invalid OTP");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={emailForm.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmailForm({ ...emailForm, email: e.target.value })
                  }
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={emailForm.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmailForm({ ...emailForm, password: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="phone">
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div className="space-y-2">
                {!showOTP ? (
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    value={phoneForm.phoneNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPhoneForm({
                        ...phoneForm,
                        phoneNumber: e.target.value,
                      })
                    }
                    required
                  />
                ) : (
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={phoneForm.otp}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPhoneForm({ ...phoneForm, otp: e.target.value })
                    }
                    required
                  />
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? "Processing..."
                  : showOTP
                  ? "Verify OTP"
                  : "Send OTP"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <div id="recaptcha-container" />
      </div>
    </div>
  );
}
