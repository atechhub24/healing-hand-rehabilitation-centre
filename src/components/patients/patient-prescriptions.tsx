import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Plus, Printer } from "lucide-react";

interface PatientPrescriptionsProps {
  patientId: number;
}

// Sample data - in a real app, this would come from an API
const activePrescriptions = [
  {
    id: 1,
    medication: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    startDate: "2022-03-15",
    endDate: "2023-03-15",
    refills: 2,
    prescribedBy: "Dr. Sarah Johnson",
    status: "Active",
    instructions: "Take in the morning with food",
  },
  {
    id: 2,
    medication: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    startDate: "2022-01-10",
    endDate: "2023-01-10",
    refills: 3,
    prescribedBy: "Dr. Sarah Johnson",
    status: "Active",
    instructions: "Take with meals",
  },
  {
    id: 3,
    medication: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    startDate: "2022-03-15",
    endDate: "2023-03-15",
    refills: 2,
    prescribedBy: "Dr. Sarah Johnson",
    status: "Active",
    instructions: "Take at bedtime",
  },
];

const pastPrescriptions = [
  {
    id: 4,
    medication: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    startDate: "2021-11-05",
    endDate: "2021-11-15",
    refills: 0,
    prescribedBy: "Dr. James Wilson",
    status: "Completed",
    instructions: "Take until completed",
  },
  {
    id: 5,
    medication: "Prednisone",
    dosage: "10mg",
    frequency: "Once daily",
    startDate: "2021-08-20",
    endDate: "2021-08-30",
    refills: 0,
    prescribedBy: "Dr. Sarah Johnson",
    status: "Completed",
    instructions: "Taper as directed",
  },
];

/**
 * PatientPrescriptions component displays active and past prescriptions for a patient
 * @param patientId - The ID of the patient to display prescriptions for
 */
export function PatientPrescriptions({ patientId }: PatientPrescriptionsProps) {
  // In a real app, we would fetch the patient's prescriptions based on the ID
  const [activeTab, setActiveTab] = useState("active");

  // This would be used in a real app to handle prescription actions
  const handlePrescriptionAction = (id: number, action: string) => {
    console.log(`Prescription ${id} action: ${action}`);
    // In a real app, this would call an API to perform the action
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Prescriptions</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print All
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Prescription
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="active"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="active">Active Prescriptions</TabsTrigger>
          <TabsTrigger value="past">Past Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activePrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {prescription.medication} {prescription.dosage}
                  </CardTitle>
                  <Badge>Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Frequency:</span>
                      <span className="text-sm">{prescription.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Start Date:</span>
                      <span className="text-sm">{prescription.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">End Date:</span>
                      <span className="text-sm">{prescription.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Refills Remaining:
                      </span>
                      <span className="text-sm">{prescription.refills}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Prescribed By:
                      </span>
                      <span className="text-sm">
                        {prescription.prescribedBy}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Instructions:</span>
                      <span className="text-sm">
                        {prescription.instructions}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePrescriptionAction(prescription.id, "refill")
                    }
                  >
                    Refill
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePrescriptionAction(prescription.id, "print")
                    }
                  >
                    <Printer className="h-4 w-4 mr-1" /> Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePrescriptionAction(prescription.id, "view")
                    }
                  >
                    <FileText className="h-4 w-4 mr-1" /> View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastPrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {prescription.medication} {prescription.dosage}
                  </CardTitle>
                  <Badge variant="secondary">Completed</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Frequency:</span>
                      <span className="text-sm">{prescription.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Start Date:</span>
                      <span className="text-sm">{prescription.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">End Date:</span>
                      <span className="text-sm">{prescription.endDate}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Prescribed By:
                      </span>
                      <span className="text-sm">
                        {prescription.prescribedBy}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Instructions:</span>
                      <span className="text-sm">
                        {prescription.instructions}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePrescriptionAction(prescription.id, "renew")
                    }
                  >
                    Renew
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePrescriptionAction(prescription.id, "print")
                    }
                  >
                    <Printer className="h-4 w-4 mr-1" /> Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePrescriptionAction(prescription.id, "view")
                    }
                  >
                    <FileText className="h-4 w-4 mr-1" /> View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
