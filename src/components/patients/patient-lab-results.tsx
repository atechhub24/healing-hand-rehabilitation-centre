import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PatientLabResultsProps {
  patientId: number;
}

// Sample data - in a real app, this would come from an API
const labResults = [
  {
    id: 1,
    testName: "Complete Blood Count (CBC)",
    date: "2023-06-15",
    orderedBy: "Dr. Sarah Johnson",
    status: "Completed",
    results: [
      {
        name: "White Blood Cell (WBC)",
        value: "7.5",
        unit: "K/uL",
        range: "4.5-11.0",
        flag: "Normal",
      },
      {
        name: "Red Blood Cell (RBC)",
        value: "4.8",
        unit: "M/uL",
        range: "4.5-5.9",
        flag: "Normal",
      },
      {
        name: "Hemoglobin (Hgb)",
        value: "14.2",
        unit: "g/dL",
        range: "13.5-17.5",
        flag: "Normal",
      },
      {
        name: "Hematocrit (Hct)",
        value: "42",
        unit: "%",
        range: "41-50",
        flag: "Normal",
      },
      {
        name: "Platelets",
        value: "250",
        unit: "K/uL",
        range: "150-450",
        flag: "Normal",
      },
    ],
    notes: "All values within normal range",
  },
  {
    id: 2,
    testName: "Comprehensive Metabolic Panel (CMP)",
    date: "2023-06-15",
    orderedBy: "Dr. Sarah Johnson",
    status: "Completed",
    results: [
      {
        name: "Glucose",
        value: "95",
        unit: "mg/dL",
        range: "70-99",
        flag: "Normal",
      },
      {
        name: "BUN",
        value: "15",
        unit: "mg/dL",
        range: "7-20",
        flag: "Normal",
      },
      {
        name: "Creatinine",
        value: "0.9",
        unit: "mg/dL",
        range: "0.6-1.2",
        flag: "Normal",
      },
      {
        name: "Sodium",
        value: "140",
        unit: "mmol/L",
        range: "136-145",
        flag: "Normal",
      },
      {
        name: "Potassium",
        value: "4.0",
        unit: "mmol/L",
        range: "3.5-5.1",
        flag: "Normal",
      },
      {
        name: "Chloride",
        value: "101",
        unit: "mmol/L",
        range: "98-107",
        flag: "Normal",
      },
      {
        name: "CO2",
        value: "24",
        unit: "mmol/L",
        range: "23-29",
        flag: "Normal",
      },
      {
        name: "Calcium",
        value: "9.5",
        unit: "mg/dL",
        range: "8.5-10.2",
        flag: "Normal",
      },
    ],
    notes: "All values within normal range",
  },
  {
    id: 3,
    testName: "Lipid Panel",
    date: "2023-06-15",
    orderedBy: "Dr. Sarah Johnson",
    status: "Completed",
    results: [
      {
        name: "Total Cholesterol",
        value: "210",
        unit: "mg/dL",
        range: "<200",
        flag: "High",
      },
      {
        name: "Triglycerides",
        value: "150",
        unit: "mg/dL",
        range: "<150",
        flag: "Borderline",
      },
      {
        name: "HDL Cholesterol",
        value: "45",
        unit: "mg/dL",
        range: ">40",
        flag: "Normal",
      },
      {
        name: "LDL Cholesterol",
        value: "135",
        unit: "mg/dL",
        range: "<100",
        flag: "High",
      },
    ],
    notes:
      "Elevated cholesterol levels. Recommend lifestyle modifications and follow-up in 3 months.",
  },
];

const pendingTests = [
  {
    id: 4,
    testName: "Hemoglobin A1C",
    orderedDate: "2023-08-01",
    scheduledDate: "2023-08-10",
    orderedBy: "Dr. Sarah Johnson",
    status: "Scheduled",
    location: "Main Lab",
    instructions: "Fasting not required",
  },
  {
    id: 5,
    testName: "Thyroid Panel",
    orderedDate: "2023-08-01",
    scheduledDate: "2023-08-10",
    orderedBy: "Dr. Sarah Johnson",
    status: "Scheduled",
    location: "Main Lab",
    instructions: "Fasting not required",
  },
];

/**
 * PatientLabResults component displays lab test results for a patient
 * @param patientId - The ID of the patient to display lab results for
 */
export function PatientLabResults({ patientId }: PatientLabResultsProps) {
  // In a real app, we would fetch the patient's lab results based on the ID

  // This would be used in a real app to handle lab result actions
  const handleLabAction = (id: number, action: string) => {
    console.log(`Lab result ${id} action: ${action}`);
    // In a real app, this would call an API to perform the action
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="completed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="completed">Completed Tests</TabsTrigger>
          <TabsTrigger value="pending">Pending Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="completed" className="space-y-4">
          {labResults.map((result) => (
            <Card key={result.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{result.testName}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{result.date}</Badge>
                    <Badge>{result.status}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ordered by: {result.orderedBy}
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 text-left font-medium">Test</th>
                        <th className="py-2 text-left font-medium">Result</th>
                        <th className="py-2 text-left font-medium">Unit</th>
                        <th className="py-2 text-left font-medium">
                          Reference Range
                        </th>
                        <th className="py-2 text-left font-medium">Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.results.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{item.name}</td>
                          <td className="py-2 font-medium">{item.value}</td>
                          <td className="py-2">{item.unit}</td>
                          <td className="py-2">{item.range}</td>
                          <td className="py-2">
                            <Badge
                              variant={
                                item.flag === "Normal"
                                  ? "outline"
                                  : item.flag === "High" || item.flag === "Low"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {item.flag}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {result.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Notes:</p>
                    <p className="text-sm">{result.notes}</p>
                  </div>
                )}

                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLabAction(result.id, "download")}
                  >
                    <Download className="h-4 w-4 mr-1" /> Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLabAction(result.id, "print")}
                  >
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLabAction(result.id, "view")}
                  >
                    <FileText className="h-4 w-4 mr-1" /> Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingTests.map((test) => (
            <Card key={test.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{test.testName}</CardTitle>
                  <Badge variant="secondary">{test.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Ordered Date:</span>
                      <span className="text-sm">{test.orderedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Scheduled Date:
                      </span>
                      <span className="text-sm">{test.scheduledDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Ordered By:</span>
                      <span className="text-sm">{test.orderedBy}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Location:</span>
                      <span className="text-sm">{test.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Instructions:</span>
                      <span className="text-sm">{test.instructions}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLabAction(test.id, "reschedule")}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLabAction(test.id, "cancel")}
                  >
                    Cancel
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
