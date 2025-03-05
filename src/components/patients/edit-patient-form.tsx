"use client";

import { useState } from "react";
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
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the form schema with Zod
const patientFormSchema = z.object({
  // Basic Information (Required)
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  age: z.coerce.number().min(0, { message: "Age is required" }),
  gender: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional().default(""),
  emergencyPhone: z.string().optional().default(""),

  // Medical Information (Optional)
  bloodType: z.string().optional(),
  height: z.coerce.number().min(0).optional(),
  weight: z.coerce.number().min(0).optional(),
  allergies: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),

  // Medical History (Optional)
  medicalConditions: z
    .array(
      z.object({
        condition: z.string(),
        diagnosedDate: z.date().optional(),
        status: z.string().optional(),
        notes: z.string().optional(),
        medications: z.array(z.string()).optional(),
      })
    )
    .optional(),

  surgicalHistory: z
    .array(
      z.object({
        procedure: z.string(),
        date: z.date().optional(),
        hospital: z.string().optional(),
        surgeon: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .optional(),

  familyHistory: z
    .array(
      z.object({
        relation: z.string(),
        condition: z.string(),
        age: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .optional(),

  // Insurance Information (Optional)
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
  insuranceGroup: z.string().optional(),

  // Additional Notes (Optional)
  notes: z.string().optional(),

  // Required fields from the original patient
  condition: z.string().min(1, { message: "Condition is required" }),
  status: z.string().min(1, { message: "Status is required" }),
});

// Export the type for use in other components
export type PatientFormValues = z.infer<typeof patientFormSchema>;

// Define simplified types for the form
type SimplifiedMedicalCondition = {
  condition: string;
  status: string;
  notes: string;
};

type SimplifiedSurgery = {
  procedure: string;
  hospital: string;
  surgeon: string;
  notes: string;
};

type SimplifiedFamilyHistory = {
  relation: string;
  condition: string;
  age: string;
  notes: string;
};

/**
 * EditPatientForm component provides a form to edit an existing patient's information
 * @param patient - The patient data to pre-fill the form
 * @param onSubmit - Function to handle form submission
 * @param isSubmitting - Boolean indicating if the form is currently submitting
 */
export function EditPatientForm({
  patient,
  onSubmit,
  isSubmitting = false,
}: {
  patient: Patient;
  onSubmit: (data: PatientFormValues) => void;
  isSubmitting?: boolean;
}) {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("basic");

  // Initialize form with default values from patient data
  const form = useForm<z.infer<typeof patientFormSchema>>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address || "",
      emergencyContact: patient.emergencyContact || "",
      emergencyPhone: patient.emergencyPhone || "",
      bloodType: patient.bloodType || "",
      height: patient.height || undefined,
      weight: patient.weight || undefined,
      condition: patient.condition,
      status: patient.status,
      notes: patient.notes || "",
      insuranceProvider: patient.insuranceProvider || "",
      insuranceNumber: patient.insuranceNumber || "",
      insuranceGroup: patient.insuranceGroup || "",
    },
  });

  // State for dynamic arrays
  const [allergies, setAllergies] = useState<string[]>(patient.allergies || []);
  const [newAllergy, setNewAllergy] = useState("");

  const [medications, setMedications] = useState<string[]>(
    patient.currentMedications || []
  );
  const [newMedication, setNewMedication] = useState("");

  // For medical conditions
  const [medicalConditions, setMedicalConditions] = useState<
    SimplifiedMedicalCondition[]
  >([]);
  const [newCondition, setNewCondition] = useState<SimplifiedMedicalCondition>({
    condition: "",
    status: "",
    notes: "",
  });

  // For surgical history
  const [surgicalHistory, setSurgicalHistory] = useState<SimplifiedSurgery[]>(
    []
  );
  const [newSurgery, setNewSurgery] = useState<SimplifiedSurgery>({
    procedure: "",
    hospital: "",
    surgeon: "",
    notes: "",
  });

  // For family history
  const [familyHistory, setFamilyHistory] = useState<SimplifiedFamilyHistory[]>(
    []
  );
  const [newFamilyHistory, setNewFamilyHistory] =
    useState<SimplifiedFamilyHistory>({
      relation: "",
      condition: "",
      age: "",
      notes: "",
    });

  // Handle form submission
  const handleSubmit = (data: PatientFormValues) => {
    // Include the dynamic arrays in the form data
    const updatedPatient = {
      ...data,
      allergies,
      currentMedications: medications,
      // We don't include these in the patient object directly as they're stored separately
      // but we can pass them to the onSubmit handler
      _medicalConditions: medicalConditions,
      _surgicalHistory: surgicalHistory,
      _familyHistory: familyHistory,
    };

    // Call the onSubmit handler with the updated patient data
    onSubmit(updatedPatient);
  };

  // Add a new allergy
  const addAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy]);
      setNewAllergy("");
    }
  };

  // Remove an allergy
  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  // Add a new medication
  const addMedication = () => {
    if (newMedication.trim()) {
      setMedications([...medications, newMedication]);
      setNewMedication("");
    }
  };

  // Remove a medication
  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  // Add a new medical condition
  const addMedicalCondition = () => {
    if (newCondition.condition.trim()) {
      setMedicalConditions([...medicalConditions, { ...newCondition }]);
      setNewCondition({
        condition: "",
        status: "Active",
        notes: "",
      });
    }
  };

  // Remove a medical condition
  const removeMedicalCondition = (index: number) => {
    setMedicalConditions(medicalConditions.filter((_, i) => i !== index));
  };

  // Add a new surgery
  const addSurgery = () => {
    if (newSurgery.procedure.trim()) {
      setSurgicalHistory([...surgicalHistory, { ...newSurgery }]);
      setNewSurgery({
        procedure: "",
        hospital: "",
        surgeon: "",
        notes: "",
      });
    }
  };

  // Remove a surgery
  const removeSurgery = (index: number) => {
    setSurgicalHistory(surgicalHistory.filter((_, i) => i !== index));
  };

  // Add a new family history
  const addFamilyHistory = () => {
    if (newFamilyHistory.relation.trim() && newFamilyHistory.condition.trim()) {
      setFamilyHistory([...familyHistory, { ...newFamilyHistory }]);
      setNewFamilyHistory({
        relation: "",
        condition: "",
        age: "",
        notes: "",
      });
    }
  };

  // Remove a family history
  const removeFamilyHistory = (index: number) => {
    setFamilyHistory(familyHistory.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="medical">Medical Info</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
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
                    <FormLabel>Age *</FormLabel>
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
                        <SelectItem value="Prefer not to say">
                          Prefer not to say
                        </SelectItem>
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
                      <Input placeholder="+1 (555) 123-4567" {...field} />
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
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="123 Main St, City, State, ZIP"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe (Spouse)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 987-6543" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          {/* Medical Information Tab */}
          <TabsContent value="medical" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Allergies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Allergies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add an allergy"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addAllergy}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {allergies.length > 0 && (
                  <div className="space-y-2">
                    {allergies.map((allergy, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <span>{allergy}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAllergy(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current Medications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a medication"
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addMedication}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {medications.length > 0 && (
                  <div className="space-y-2">
                    {medications.map((medication, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <span>{medication}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical History Tab */}
          <TabsContent value="history" className="space-y-6">
            {/* Medical Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Medical Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Condition name"
                      value={newCondition.condition}
                      onChange={(e) =>
                        setNewCondition({
                          ...newCondition,
                          condition: e.target.value,
                        })
                      }
                    />
                    <Select
                      value={newCondition.status}
                      onValueChange={(value) =>
                        setNewCondition({ ...newCondition, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="In Remission">
                          In Remission
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    placeholder="Notes about the condition"
                    value={newCondition.notes}
                    onChange={(e) =>
                      setNewCondition({
                        ...newCondition,
                        notes: e.target.value,
                      })
                    }
                  />
                  <Button type="button" onClick={addMedicalCondition}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Condition
                  </Button>
                </div>

                {medicalConditions.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {medicalConditions.map((condition, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{condition.condition}</p>
                            <p className="text-sm text-muted-foreground">
                              Status: {condition.status}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMedicalCondition(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {condition.notes && (
                          <p className="text-sm mt-2">{condition.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Surgical History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Surgical History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Procedure"
                      value={newSurgery.procedure}
                      onChange={(e) =>
                        setNewSurgery({
                          ...newSurgery,
                          procedure: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Hospital"
                      value={newSurgery.hospital}
                      onChange={(e) =>
                        setNewSurgery({
                          ...newSurgery,
                          hospital: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Surgeon"
                      value={newSurgery.surgeon}
                      onChange={(e) =>
                        setNewSurgery({
                          ...newSurgery,
                          surgeon: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Textarea
                    placeholder="Notes about the surgery"
                    value={newSurgery.notes}
                    onChange={(e) =>
                      setNewSurgery({ ...newSurgery, notes: e.target.value })
                    }
                  />
                  <Button type="button" onClick={addSurgery}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Surgery
                  </Button>
                </div>

                {surgicalHistory.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {surgicalHistory.map((surgery, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{surgery.procedure}</p>
                            <p className="text-sm text-muted-foreground">
                              {surgery.hospital} • {surgery.surgeon}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSurgery(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {surgery.notes && (
                          <p className="text-sm mt-2">{surgery.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Family History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Family History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Relation (e.g., Father, Mother)"
                      value={newFamilyHistory.relation}
                      onChange={(e) =>
                        setNewFamilyHistory({
                          ...newFamilyHistory,
                          relation: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Medical condition"
                      value={newFamilyHistory.condition}
                      onChange={(e) =>
                        setNewFamilyHistory({
                          ...newFamilyHistory,
                          condition: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Age at diagnosis or current age"
                      value={newFamilyHistory.age}
                      onChange={(e) =>
                        setNewFamilyHistory({
                          ...newFamilyHistory,
                          age: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Textarea
                    placeholder="Additional notes"
                    value={newFamilyHistory.notes}
                    onChange={(e) =>
                      setNewFamilyHistory({
                        ...newFamilyHistory,
                        notes: e.target.value,
                      })
                    }
                  />
                  <Button type="button" onClick={addFamilyHistory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Family History
                  </Button>
                </div>

                {familyHistory.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {familyHistory.map((history, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              {history.relation}: {history.condition}
                            </p>
                            {history.age && (
                              <p className="text-sm text-muted-foreground">
                                Age: {history.age}
                              </p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFamilyHistory(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {history.notes && (
                          <p className="text-sm mt-2">{history.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insurance Tab */}
          <TabsContent value="insurance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="insuranceProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Provider</FormLabel>
                    <FormControl>
                      <Input placeholder="Insurance Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="insuranceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance ID/Policy Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Policy Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="insuranceGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Group Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
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
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Link href={`/${params.role}/patients/${patient.id || patient.uid}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
