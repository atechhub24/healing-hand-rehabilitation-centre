"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Patient } from "@/types/patient";
import Link from "next/link";
import { useParams } from "next/navigation";

// Reuse the same schema from add-patient-form
const patientFormSchema = z.object({
  // Basic Information (Required)
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  age: z.coerce.number().min(0, { message: "Age must be a positive number" }),
  gender: z.string().min(1, { message: "Please select a gender" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  address: z.string().optional(),

  // Medical Information
  condition: z.string().min(1, { message: "Condition is required" }),
  status: z.string().min(1, { message: "Status is required" }),

  // Additional Notes (Optional)
  notes: z.string().optional(),
});

// Export the type for use in other components
export type PatientFormValues = z.infer<typeof patientFormSchema>;

/**
 * EditPatientForm component provides a form to edit an existing patient's information
 * @param patient - The patient data to pre-fill the form
 * @param onSubmit - Function to handle form submission
 */
export function EditPatientForm({
  patient,
  onSubmit,
}: {
  patient: Patient;
  onSubmit: (data: PatientFormValues) => void;
}) {
  const params = useParams();
  const patientId = Number(params.id);

  // Initialize form with default values from the patient data
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      condition: patient.condition,
      status: patient.status,
      // Other fields would be populated here if available in the patient object
    },
  });

  // Handle form submission
  const handleSubmit = (data: PatientFormValues) => {
    onSubmit(data);
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic Information</TabsTrigger>
        <TabsTrigger value="medical">Medical Details</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 mt-6"
        >
          <TabsContent value="basic" className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Patient Details</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
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
                        <Input type="number" {...field} />
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
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="patient@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="medical" className="space-y-4">
            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Medical Information</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Condition</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Hypertension" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Stable">Stable</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="Recovering">Recovering</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <h4 className="text-md font-medium mb-4">Medical History</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  To edit detailed medical history, prescriptions, lab results,
                  appointments, or notes, please use the dedicated sections in
                  the patient details page after saving basic information.
                </p>
                <Link
                  href={`/${params.role}/patients/${patientId}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Go to detailed medical history editor →
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Notes</h3>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information about the patient"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <div className="flex justify-between pt-4">
            <Link href={`/${params.role}/patients/${patientId}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Update Patient</Button>
          </div>
        </form>
      </Form>
    </Tabs>
  );
}
