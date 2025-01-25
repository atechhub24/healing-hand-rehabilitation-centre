"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import mutate from "@/lib/firebase/mutate-data";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  UserCircle,
  Users2,
  Users,
  AlertCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string(),
  age: z.coerce.number().min(1, "Age is required"),
  gender: z.enum(["male", "female", "other"]),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  height: z.coerce.number().min(0, "Height must be positive").optional(),
  weight: z.coerce.number().min(1, "Weight is required"),
  emergencyContact: z.string().optional(),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
  currentMedications: z.string().optional(),
  chronicConditions: z.string().optional(),
  surgicalHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  lifestyle: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UserData {
  name?: string;
  phoneNumber: string;
  age?: number;
  gender?: "male" | "female" | "other";
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  height?: number;
  weight?: number;
  emergencyContact?: string;
  allergies?: string;
  medicalHistory?: string;
  currentMedications?: string;
  chronicConditions?: string;
  surgicalHistory?: string;
  familyHistory?: string;
  lifestyle?: string;
}

const genderOptions = [
  {
    value: "male",
    label: "Male",
    icon: <UserCircle className="h-5 w-5" />,
    description: "I identify as male",
    color:
      "hover:border-blue-500 [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50",
  },
  {
    value: "female",
    label: "Female",
    icon: <Users2 className="h-5 w-5" />,
    description: "I identify as female",
    color:
      "hover:border-pink-500 [&:has([data-state=checked])]:border-pink-500 [&:has([data-state=checked])]:bg-pink-50",
  },
  {
    value: "other",
    label: "Other",
    icon: <Users className="h-5 w-5" />,
    description: "I identify as non-binary",
    color:
      "hover:border-purple-500 [&:has([data-state=checked])]:border-purple-500 [&:has([data-state=checked])]:bg-purple-50",
  },
];

const bloodGroupOptions = [
  {
    value: "A+",
    label: "A+",
    color:
      "hover:border-red-500 [&:has([data-state=checked])]:border-red-500 [&:has([data-state=checked])]:bg-red-50",
  },
  {
    value: "A-",
    label: "A-",
    color:
      "hover:border-red-500 [&:has([data-state=checked])]:border-red-500 [&:has([data-state=checked])]:bg-red-50",
  },
  {
    value: "B+",
    label: "B+",
    color:
      "hover:border-blue-500 [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50",
  },
  {
    value: "B-",
    label: "B-",
    color:
      "hover:border-blue-500 [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50",
  },
  {
    value: "AB+",
    label: "AB+",
    color:
      "hover:border-purple-500 [&:has([data-state=checked])]:border-purple-500 [&:has([data-state=checked])]:bg-purple-50",
  },
  {
    value: "AB-",
    label: "AB-",
    color:
      "hover:border-purple-500 [&:has([data-state=checked])]:border-purple-500 [&:has([data-state=checked])]:bg-purple-50",
  },
  {
    value: "O+",
    label: "O+",
    color:
      "hover:border-green-500 [&:has([data-state=checked])]:border-green-500 [&:has([data-state=checked])]:bg-green-50",
  },
  {
    value: "O-",
    label: "O-",
    color:
      "hover:border-green-500 [&:has([data-state=checked])]:border-green-500 [&:has([data-state=checked])]:bg-green-50",
  },
];

export default function EditProfilePage() {
  const { user } = useAuth();
  const { userData } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const [profileData] = useFetch<UserData>(`/users/${user?.uid}`, {
    needRaw: true,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      age: 0,
      gender: "male",
      bloodGroup: "A+",
      height: 0,
      weight: 0,
      emergencyContact: "",
      allergies: "",
      medicalHistory: "",
      currentMedications: "",
      chronicConditions: "",
      surgicalHistory: "",
      familyHistory: "",
      lifestyle: "",
    },
  });

  useEffect(() => {
    if (profileData) {
      form.reset({
        name: profileData.name || "",
        phoneNumber: profileData.phoneNumber,
        age: profileData.age || 0,
        gender: profileData.gender || "male",
        bloodGroup: profileData.bloodGroup || "A+",
        height: profileData.height || 0,
        weight: profileData.weight || 0,
        emergencyContact: profileData.emergencyContact || "",
        allergies: profileData.allergies || "",
        medicalHistory: profileData.medicalHistory || "",
        currentMedications: profileData.currentMedications || "",
        chronicConditions: profileData.chronicConditions || "",
        surgicalHistory: profileData.surgicalHistory || "",
        familyHistory: profileData.familyHistory || "",
        lifestyle: profileData.lifestyle || "",
      });
    }
  }, [profileData, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      const updateData: Partial<UserData> = {
        ...data,
        phoneNumber: profileData?.phoneNumber,
      };

      await mutate({
        action: "update",
        path: `/users/${user?.uid}`,
        data: updateData,
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });

      // Redirect to view page after successful update
      router.push(`/${userData?.role}/profile`);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!profileData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="container px-0">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Edit Profile</h2>
        <p className="text-muted-foreground">
          Update your profile information below
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your basic profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            className="h-12"
                            placeholder="Enter your full name"
                            {...field}
                          />
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
                        <FormLabel className="text-base">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-12 bg-muted"
                            {...field}
                            disabled
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          Phone number cannot be changed
                        </p>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="h-12"
                            placeholder="Enter your age"
                            {...field}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value >= 0) {
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Emergency Contact (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-12"
                            placeholder="Emergency contact number (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Height (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            className="h-12"
                            placeholder="Enter height in cm (optional)"
                            {...field}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value) && value >= 0) {
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="h-12"
                            placeholder="Enter weight in kg"
                            {...field}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value >= 0) {
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          {genderOptions.map((option) => (
                            <FormItem key={option.value}>
                              <FormControl>
                                <RadioGroupItem
                                  value={option.value}
                                  id={option.value}
                                  className="peer sr-only"
                                />
                              </FormControl>
                              <label
                                htmlFor={option.value}
                                className={cn(
                                  "flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all duration-200",
                                  option.color
                                )}
                              >
                                {option.icon}
                                <div className="mt-3 space-y-1 text-center">
                                  <div className="text-base font-medium leading-none">
                                    {option.label}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {option.description}
                                  </div>
                                </div>
                              </label>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">Blood Group</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-4 gap-4"
                        >
                          {bloodGroupOptions.map((option) => (
                            <FormItem key={option.value}>
                              <FormControl>
                                <RadioGroupItem
                                  value={option.value}
                                  id={option.value}
                                  className="peer sr-only"
                                />
                              </FormControl>
                              <label
                                htmlFor={option.value}
                                className={cn(
                                  "flex h-16 items-center justify-center rounded-xl border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-lg font-semibold transition-all duration-200",
                                  option.color
                                )}
                              >
                                {option.label}
                              </label>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Medical Information
                  </CardTitle>
                  <CardDescription>Your health-related details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Allergies</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any allergies you have..."
                            className="min-h-[80px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentMedications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Current Medications
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List your current medications..."
                            className="min-h-[80px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="chronicConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Chronic Conditions
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any chronic conditions..."
                            className="min-h-[80px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Medical History
                  </CardTitle>
                  <CardDescription>Your past medical records</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="surgicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Surgical History
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any past surgeries..."
                            className="min-h-[80px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="familyHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Family Medical History
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe any significant family medical history..."
                            className="min-h-[80px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lifestyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Lifestyle & Habits
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your lifestyle (exercise, smoking, alcohol, etc.)..."
                            className="min-h-[80px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" className="w-full">
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
