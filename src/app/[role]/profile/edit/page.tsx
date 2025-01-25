"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import mutateData from "@/lib/firebase/mutate-data";
import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import { useAuthStore } from "@/lib/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface UserData {
  uid: string;
  role: string;
  phoneNumber: string;
  name?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  allergies?: string;
  medicalHistory?: string;
  createdAt: string;
  lastLogin: string;
  creatorInfo?: {
    actionBy: string;
    browser: string;
    language: string;
    platform: string;
    screenResolution: string;
    timestamp: string;
    userAgent: string;
  };
  updaterInfo?: {
    actionBy: string;
    browser: string;
    language: string;
    platform: string;
    screenResolution: string;
    timestamp: string;
    userAgent: string;
  };
}

const profileFormSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  age: z.coerce.number().min(1, "Age is required"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select your gender",
  }),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    required_error: "Please select your blood group",
  }),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileEditPage() {
  const { user } = useAuth();
  const { userData } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const [profileData] = useFetch<UserData>(`/users/${user?.uid}`, {
    needRaw: true,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      phoneNumber: profileData?.phoneNumber || "",
      age: 0,
      gender: undefined,
      bloodGroup: undefined,
      allergies: "",
      medicalHistory: "",
    },
  });

  useEffect(() => {
    if (profileData) {
      // Only update form with existing data, preserving phoneNumber
      form.reset({
        ...profileData,
        phoneNumber: profileData.phoneNumber || "",
        // Ensure optional fields are empty strings if undefined
        name: profileData.name || "",
        age: profileData.age || 0,
        gender: profileData.gender || undefined,
        bloodGroup: profileData.bloodGroup || undefined,
        allergies: profileData.allergies || "",
        medicalHistory: profileData.medicalHistory || "",
      });
    }
  }, [profileData, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Preserve existing data that shouldn't be modified
      const updateData: Partial<UserData> = {
        ...data,
        phoneNumber: profileData?.phoneNumber, // Keep original phone number
        role: profileData?.role, // Preserve role
        uid: profileData?.uid, // Preserve uid
      };

      await mutateData({
        path: `/users/${user?.uid}`,
        data: updateData,
        action: "update",
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      // Check if we came from appointment booking
      const returnUrl = new URLSearchParams(window.location.search).get(
        "returnUrl"
      );
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push(`/${userData?.role}/profile/view`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Profile</h2>
        <p className="text-muted-foreground">
          Update your personal and medical information
        </p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number"
                        {...field}
                        disabled
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormDescription>
                      Phone number cannot be changed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your age"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your blood group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List any allergies you have (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include any food, drug, or environmental allergies
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your medical history (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include any chronic conditions, surgeries, or ongoing
                      treatments
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
