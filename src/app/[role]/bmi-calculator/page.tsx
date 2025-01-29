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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Scale } from "lucide-react";
import { BMIScale } from "@/components/ui/bmi-scale";

// Define the form schema with Zod
const bmiFormSchema = z.object({
  height: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 && num < 300;
    },
    { message: "Height must be a valid number between 0 and 300 cm" }
  ),
  weight: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 && num < 500;
    },
    { message: "Weight must be a valid number between 0 and 500 kg" }
  ),
});

// BMI calculation helper function
const calculateBMI = (weight: number, height: number) => {
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

// Get BMI category and color
const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return { category: "Underweight", color: "text-blue-500" };
  if (bmi < 25) return { category: "Normal weight", color: "text-green-500" };
  if (bmi < 30) return { category: "Overweight", color: "text-yellow-500" };
  return { category: "Obese", color: "text-red-500" };
};

export default function BMICalculator() {
  const [bmiResult, setBMIResult] = useState<{
    bmi: string;
    category: string;
    color: string;
  } | null>(null);

  const form = useForm<z.infer<typeof bmiFormSchema>>({
    resolver: zodResolver(bmiFormSchema),
    defaultValues: {
      height: "",
      weight: "",
    },
  });

  const onSubmit = (values: z.infer<typeof bmiFormSchema>) => {
    const bmi = calculateBMI(
      parseFloat(values.weight),
      parseFloat(values.height)
    );
    const { category, color } = getBMICategory(parseFloat(bmi));
    setBMIResult({ bmi, category, color });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Scale className="w-6 h-6 text-primary" />
              <CardTitle>BMI Calculator</CardTitle>
            </div>
            <CardDescription>
              Calculate your Body Mass Index (BMI) to check if your weight is
              healthy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                              cm
                            </span>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Enter your height in centimeters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                              kg
                            </span>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Enter your weight in kilograms
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Calculate BMI
                </Button>
              </form>
            </Form>

            {bmiResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <div className="p-6 bg-secondary rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    Your BMI Result
                  </h3>
                  <div className="flex flex-col items-center space-y-2">
                    <p className="text-4xl font-bold">{bmiResult.bmi}</p>
                    <p className={`text-lg font-medium ${bmiResult.color}`}>
                      {bmiResult.category}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">What does this mean?</h4>
                    <p className="text-sm text-muted-foreground">
                      {bmiResult.category === "Normal weight"
                        ? "Your BMI is within a healthy range. Maintain a balanced diet and regular exercise routine."
                        : bmiResult.category === "Underweight"
                        ? "You may need to gain some weight. Consult with a healthcare provider about a healthy diet plan."
                        : bmiResult.category === "Overweight"
                        ? "Consider making lifestyle changes to reach a healthier weight through diet and exercise."
                        : "It's important to talk to your healthcare provider about strategies to achieve a healthier weight."}
                    </p>
                  </div>
                </div>

                <BMIScale currentBMI={parseFloat(bmiResult.bmi)} />

                <div className="mt-8 p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Health Tips</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      • Maintain a balanced diet rich in fruits, vegetables, and
                      whole grains
                    </li>
                    <li>
                      • Stay hydrated by drinking plenty of water throughout the
                      day
                    </li>
                    <li>
                      • Engage in regular physical activity for at least 30
                      minutes daily
                    </li>
                    <li>• Get adequate sleep (7-9 hours per night)</li>
                    <li>
                      • Manage stress through relaxation techniques or
                      meditation
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
