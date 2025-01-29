"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import {
  ActivityLevel,
  activityLevels,
  GoalType,
} from "@/components/tdee/activity-levels";
import {
  TDEEResult,
  calculateTDEEWithMacros,
} from "@/components/tdee/tdee-calculator";
import { TDEEResults } from "@/components/tdee/tdee-result";

const tdeeFormSchema = z.object({
  age: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0 && num < 120;
    },
    { message: "Age must be between 1 and 120 years" }
  ),
  gender: z.enum(["male", "female"]),
  weight: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 && num < 500;
    },
    { message: "Weight must be between 0 and 500 kg" }
  ),
  height: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 && num < 300;
    },
    { message: "Height must be between 0 and 300 cm" }
  ),
  activityLevel: z.enum([
    "sedentary",
    "lightlyActive",
    "moderatelyActive",
    "veryActive",
    "extraActive",
  ] as const),
  goal: z.enum(["maintenance", "weightLoss", "muscleGain"] as const),
});

export default function TDEECalculator() {
  const [result, setResult] = useState<TDEEResult | null>(null);

  const form = useForm<z.infer<typeof tdeeFormSchema>>({
    resolver: zodResolver(tdeeFormSchema),
    defaultValues: {
      age: "",
      gender: "male",
      weight: "",
      height: "",
      activityLevel: "sedentary",
      goal: "maintenance",
    },
  });

  const onSubmit = (values: z.infer<typeof tdeeFormSchema>) => {
    const tdeeResult = calculateTDEEWithMacros(
      parseFloat(values.weight),
      parseFloat(values.height),
      parseInt(values.age),
      values.gender,
      values.activityLevel as ActivityLevel,
      values.goal as GoalType
    );
    setResult(tdeeResult);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Dumbbell className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-semibold">TDEE Calculator</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Calculate your Total Daily Energy Expenditure (TDEE) and get
          personalized macro recommendations based on your goals.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Details</CardTitle>
              <CardDescription>
                Provide your measurements and activity level for accurate
                calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your age" {...field} />
                          </FormControl>
                          <FormDescription>Your age in years</FormDescription>
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
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Biological sex for BMR calculation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter your weight"
                                {...field}
                                className="pr-12"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                kg
                              </span>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Your weight in kilograms
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter your height"
                                {...field}
                                className="pr-12"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                cm
                              </span>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Your height in centimeters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="activityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(activityLevels).map(
                              ([key, { label, description }]) => (
                                <SelectItem key={key} value={key}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{label}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {description}
                                    </span>
                                  </div>
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the option that best matches your typical week
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="maintenance">
                              <div className="flex flex-col">
                                <span className="font-medium">Maintenance</span>
                                <span className="text-xs text-muted-foreground">
                                  Maintain current weight
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="weightLoss">
                              <div className="flex flex-col">
                                <span className="font-medium">Weight Loss</span>
                                <span className="text-xs text-muted-foreground">
                                  20% calorie deficit
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="muscleGain">
                              <div className="flex flex-col">
                                <span className="font-medium">Muscle Gain</span>
                                <span className="text-xs text-muted-foreground">
                                  10% calorie surplus
                                </span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select your fitness goal for personalized
                          recommendations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Calculate TDEE
                  </Button>
                </form>
              </Form>

              <div className="mt-8 border-t pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">What is TDEE?</h3>
                    <p className="text-sm text-muted-foreground">
                      Total Daily Energy Expenditure (TDEE) is the total number
                      of calories your body burns each day. It includes your
                      Basal Metabolic Rate (BMR) and additional calories burned
                      through physical activity and digestion.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      How it&apos;s Calculated
                    </h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        1. Calculate BMR using the Mifflin-St Jeor Equation
                        <br />
                        2. Multiply BMR by activity level factor
                        <br />
                        3. Adjust calories based on your goal
                        <br />
                        4. Calculate macronutrient ratios
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {result ? (
              <TDEEResults result={result} goal={form.getValues("goal")} />
            ) : (
              <Card className="p-6">
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Dumbbell className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">Enter your details</p>
                  <p className="text-sm">
                    Fill out the form to see your personalized TDEE and macro
                    recommendations
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
