"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditPrescription, Prescription } from "./edit-prescription";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Sample prescriptions data
const samplePrescriptions: Prescription[] = [
  {
    medication: "Lisinopril 10mg",
    dosage: "10mg",
    frequency: "Once daily",
    prescribedDate: new Date("2023-01-15"),
    expiryDate: new Date("2023-07-15"),
    prescribedBy: "Dr. Sarah Johnson",
    pharmacy: "MedPlus Pharmacy",
    refills: 2,
    instructions: "Take in the morning with food",
    notes: "For blood pressure control",
    status: "Active",
  },
  {
    medication: "Metformin 1000mg",
    dosage: "1000mg",
    frequency: "Twice daily",
    prescribedDate: new Date("2023-02-10"),
    expiryDate: new Date("2023-08-10"),
    prescribedBy: "Dr. Sarah Johnson",
    pharmacy: "MedPlus Pharmacy",
    refills: 3,
    instructions: "Take with meals",
    notes: "For diabetes management",
    status: "Active",
  },
  {
    medication: "Atorvastatin 20mg",
    dosage: "20mg",
    frequency: "Once daily",
    prescribedDate: new Date("2023-03-05"),
    expiryDate: new Date("2023-09-05"),
    prescribedBy: "Dr. Sarah Johnson",
    pharmacy: "MedPlus Pharmacy",
    refills: 5,
    instructions: "Take at bedtime",
    notes: "For cholesterol management",
    status: "Active",
  },
  {
    medication: "Albuterol Inhaler 90mcg",
    dosage: "90mcg",
    frequency: "As needed",
    prescribedDate: new Date("2023-01-20"),
    expiryDate: new Date("2023-07-20"),
    prescribedBy: "Dr. Sarah Johnson",
    pharmacy: "MedPlus Pharmacy",
    refills: 1,
    instructions: "Use as needed for shortness of breath",
    notes: "For asthma",
    status: "Active",
  },
];

/**
 * PrescriptionManager component for managing patient prescriptions
 * @param patientId - The ID of the patient (currently using sample data, but would use this to fetch real data)
 */
export function PrescriptionManager({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  patientId,
}: {
  patientId?: number;
}) {
  // In a real application, we would use patientId to fetch prescriptions from the database
  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>(samplePrescriptions);
  const [activeTab, setActiveTab] = useState("current");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter prescriptions based on active tab and search query
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesTab =
      (activeTab === "current" && prescription.status === "Active") ||
      (activeTab === "past" && prescription.status !== "Active");

    const matchesSearch =
      prescription.medication
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      prescription.prescribedBy
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      prescription.notes?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && (searchQuery === "" || matchesSearch);
  });

  // Handle adding a new prescription
  const handleAddPrescription = (data: Prescription) => {
    setPrescriptions([...prescriptions, data]);
  };

  // Handle editing an existing prescription
  const handleEditPrescription = (data: Prescription, index: number) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index] = data;
    setPrescriptions(updatedPrescriptions);
  };

  // Handle requesting a refill
  const handleRequestRefill = (index: number) => {
    // In a real app, this would send a request to the server
    console.log(`Requesting refill for ${prescriptions[index].medication}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Prescriptions</h2>
        <div className="flex items-center gap-2">
          <EditPrescription
            onSave={handleAddPrescription}
            onCancel={() => {}}
          />
        </div>
      </div>

      <Tabs
        defaultValue="current"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <Input
            placeholder="Search prescriptions..."
            className="max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <TabsContent value="current" className="space-y-4">
          {filteredPrescriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active prescriptions found.
            </div>
          ) : (
            filteredPrescriptions.map((prescription, index) => (
              <PrescriptionCard
                key={index}
                prescription={prescription}
                onEdit={(data) => handleEditPrescription(data, index)}
                onRequestRefill={() => handleRequestRefill(index)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {filteredPrescriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No past prescriptions found.
            </div>
          ) : (
            filteredPrescriptions.map((prescription, index) => (
              <PrescriptionCard
                key={index}
                prescription={prescription}
                onEdit={(data) => handleEditPrescription(data, index)}
                onRequestRefill={() => handleRequestRefill(index)}
                isPast
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * PrescriptionCard component displays a single prescription
 */
function PrescriptionCard({
  prescription,
  onEdit,
  onRequestRefill,
  isPast = false,
}: {
  prescription: Prescription;
  onEdit: (data: Prescription) => void;
  onRequestRefill: () => void;
  isPast?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {prescription.medication}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {prescription.dosage} • {prescription.frequency}
                </p>
              </div>
              <Badge
                className={
                  prescription.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : prescription.status === "Completed"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {prescription.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Prescribed:</span>{" "}
                  {format(prescription.prescribedDate, "yyyy-MM-dd")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Expires:</span>{" "}
                  {prescription.expiryDate
                    ? format(prescription.expiryDate, "yyyy-MM-dd")
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Prescribed by:</span>{" "}
                  {prescription.prescribedBy}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Pharmacy:</span>{" "}
                  {prescription.pharmacy || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Refills:</span>{" "}
                  {prescription.refills} remaining
                </span>
              </div>
            </div>

            {prescription.instructions && (
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-medium">Instructions:</span>{" "}
                  {prescription.instructions}
                </p>
              </div>
            )}

            {prescription.notes && (
              <div className="mt-1">
                <p className="text-sm">
                  <span className="font-medium">Notes:</span>{" "}
                  {prescription.notes}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-row md:flex-col gap-2 self-end md:self-start">
            <EditPrescription
              prescription={prescription}
              onSave={onEdit}
              onCancel={() => {}}
            />

            {!isPast &&
              prescription.status === "Active" &&
              prescription.refills > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Request Refill
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Request Medication Refill
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to request a refill for{" "}
                        {prescription.medication}? This will send a notification
                        to the pharmacy.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onRequestRefill}>
                        Request Refill
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
