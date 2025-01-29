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
import { BMIScale } from "@/components/bmi/bmi-scale";
import { UnitSelector } from "@/components/bmi/unit-selector";
import {
  HeightUnit,
  WeightUnit,
  convertToCm,
  convertToKg,
  heightUnitLabels,
  weightUnitLabels,
} from "@/components/bmi/unit-conversion";

// Define validation schema based on unit
const getHeightValidation = (unit: HeightUnit) => {
  switch (unit) {
    case "ft":
      return z.string().refine(
        (val) => {
          const num = parseFloat(val);
          return !isNaN(num) && num > 0 && num < 10;
        },
        { message: "Height must be between 0 and 10 feet" }
      );
    case "m":
      return z.string().refine(
        (val) => {
          const num = parseFloat(val);
          return !isNaN(num) && num > 0 && num < 3;
        },
        { message: "Height must be between 0 and 3 meters" }
      );
    default:
      return z.string().refine(
        (val) => {
          const num = parseFloat(val);
          return !isNaN(num) && num > 0 && num < 300;
        },
        { message: "Height must be between 0 and 300 centimeters" }
      );
  }
};

const getWeightValidation = (unit: WeightUnit) => {
  switch (unit) {
    case "lbs":
      return z.string().refine(
        (val) => {
          const num = parseFloat(val);
          return !isNaN(num) && num > 0 && num < 1000;
        },
        { message: "Weight must be between 0 and 1000 pounds" }
      );
    case "st":
      return z.string().refine(
        (val) => {
          const num = parseFloat(val);
          return !isNaN(num) && num > 0 && num < 70;
        },
        { message: "Weight must be between 0 and 70 stones" }
      );
    default:
      return z.string().refine(
        (val) => {
          const num = parseFloat(val);
          return !isNaN(num) && num > 0 && num < 500;
        },
        { message: "Weight must be between 0 and 500 kilograms" }
      );
  }
};

// Dynamic form schema
const createBmiFormSchema = (heightUnit: HeightUnit, weightUnit: WeightUnit) =>
  z.object({
    height: getHeightValidation(heightUnit),
    heightUnit: z.enum(["cm", "ft", "m"] as const),
    weight: getWeightValidation(weightUnit),
    weightUnit: z.enum(["kg", "lbs", "st"] as const),
  });

// BMI calculation helper function
const calculateBMI = (
  weight: number,
  weightUnit: WeightUnit,
  height: number,
  heightUnit: HeightUnit
) => {
  const heightInCm = convertToCm(height, heightUnit);
  const weightInKg = convertToKg(weight, weightUnit);
  const heightInMeters = heightInCm / 100;
  return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
};

// Get BMI category and color
const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return { category: "Underweight", color: "text-blue-500" };
  if (bmi < 25) return { category: "Normal weight", color: "text-green-500" };
  if (bmi < 30) return { category: "Overweight", color: "text-yellow-500" };
  return { category: "Obese", color: "text-red-500" };
};

export default function BMICalculator() {
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [bmiResult, setBMIResult] = useState<{
    bmi: string;
    category: string;
    color: string;
  } | null>(null);

  const form = useForm<z.infer<ReturnType<typeof createBmiFormSchema>>>({
    resolver: zodResolver(createBmiFormSchema(heightUnit, weightUnit)),
    defaultValues: {
      height: "",
      heightUnit: "cm",
      weight: "",
      weightUnit: "kg",
    },
  });

  const onSubmit = (
    values: z.infer<ReturnType<typeof createBmiFormSchema>>
  ) => {
    const bmi = calculateBMI(
      parseFloat(values.weight),
      values.weightUnit,
      parseFloat(values.height),
      values.heightUnit
    );
    const { category, color } = getBMICategory(parseFloat(bmi));
    setBMIResult({ bmi, category, color });
  };

  const getPlaceholder = (type: "height" | "weight") => {
    if (type === "height") {
      switch (heightUnit) {
        case "ft":
          return "Enter height in feet (e.g., 5.75 for 5'9\")";
        case "m":
          return "Enter height in meters (e.g., 1.75)";
        default:
          return "Enter height in centimeters";
      }
    } else {
      switch (weightUnit) {
        case "lbs":
          return "Enter weight in pounds";
        case "st":
          return "Enter weight in stones (e.g., 11.5)";
        default:
          return "Enter weight in kilograms";
      }
    }
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
              healthy. Choose your preferred units and enter your measurements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <UnitSelector<HeightUnit>
                      label="Height Unit"
                      value={heightUnit}
                      onValueChange={(value) => {
                        setHeightUnit(value);
                        form.setValue("heightUnit", value);
                        form.setValue("height", ""); // Reset height when unit changes
                      }}
                      units={heightUnitLabels}
                    />
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={getPlaceholder("height")}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {heightUnit === "ft"
                              ? "Use decimal for inches (e.g., 5.75 for 5'9\")"
                              : `Enter your height in ${heightUnitLabels[
                                  heightUnit
                                ].toLowerCase()}`}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <UnitSelector<WeightUnit>
                      label="Weight Unit"
                      value={weightUnit}
                      onValueChange={(value) => {
                        setWeightUnit(value);
                        form.setValue("weightUnit", value);
                        form.setValue("weight", ""); // Reset weight when unit changes
                      }}
                      units={weightUnitLabels}
                    />
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={getPlaceholder("weight")}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {weightUnit === "st"
                              ? "Use decimal for pounds (e.g., 11.5 for 11st 7lb)"
                              : `Enter your weight in ${weightUnitLabels[
                                  weightUnit
                                ].toLowerCase()}`}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
