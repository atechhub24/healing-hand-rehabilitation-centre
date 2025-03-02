"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, FileText, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample lab results data
const labResults = [
  {
    id: 1,
    testName: "Complete Blood Count (CBC)",
    date: "2023-05-15",
    orderedBy: "Dr. Sarah Johnson",
    status: "Completed",
    results: [
      {
        name: "WBC",
        value: "7.5",
        unit: "10^3/µL",
        range: "4.5-11.0",
        flag: "Normal",
      },
      {
        name: "RBC",
        value: "4.8",
        unit: "10^6/µL",
        range: "4.5-5.9",
        flag: "Normal",
      },
      {
        name: "Hemoglobin",
        value: "14.2",
        unit: "g/dL",
        range: "13.5-17.5",
        flag: "Normal",
      },
      {
        name: "Hematocrit",
        value: "42",
        unit: "%",
        range: "41-50",
        flag: "Normal",
      },
      {
        name: "Platelets",
        value: "250",
        unit: "10^3/µL",
        range: "150-450",
        flag: "Normal",
      },
    ],
    notes: "Routine annual checkup",
  },
  {
    id: 2,
    testName: "Comprehensive Metabolic Panel (CMP)",
    date: "2023-05-15",
    orderedBy: "Dr. Sarah Johnson",
    status: "Completed",
    results: [
      {
        name: "Glucose",
        value: "105",
        unit: "mg/dL",
        range: "70-99",
        flag: "High",
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
      {
        name: "Protein",
        value: "7.0",
        unit: "g/dL",
        range: "6.0-8.3",
        flag: "Normal",
      },
      {
        name: "Albumin",
        value: "4.5",
        unit: "g/dL",
        range: "3.5-5.0",
        flag: "Normal",
      },
      {
        name: "Bilirubin",
        value: "0.8",
        unit: "mg/dL",
        range: "0.1-1.2",
        flag: "Normal",
      },
      {
        name: "ALP",
        value: "70",
        unit: "U/L",
        range: "44-147",
        flag: "Normal",
      },
      { name: "ALT", value: "25", unit: "U/L", range: "7-55", flag: "Normal" },
      { name: "AST", value: "22", unit: "U/L", range: "8-48", flag: "Normal" },
    ],
    notes: "Slightly elevated glucose levels. Recommend follow-up testing.",
  },
  {
    id: 3,
    testName: "Lipid Panel",
    date: "2023-05-15",
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
      { name: "HDL", value: "45", unit: "mg/dL", range: ">40", flag: "Normal" },
      { name: "LDL", value: "135", unit: "mg/dL", range: "<100", flag: "High" },
    ],
    notes:
      "Elevated cholesterol and LDL levels. Recommend dietary changes and follow-up in 3 months.",
  },
  {
    id: 4,
    testName: "Hemoglobin A1c",
    date: "2023-05-15",
    orderedBy: "Dr. Sarah Johnson",
    status: "Completed",
    results: [
      { name: "HbA1c", value: "6.2", unit: "%", range: "<5.7", flag: "High" },
    ],
    notes:
      "Prediabetic range. Recommend lifestyle modifications and monitoring.",
  },
  {
    id: 5,
    testName: "Thyroid Panel",
    date: "2023-02-10",
    orderedBy: "Dr. Michael Chen",
    status: "Completed",
    results: [
      {
        name: "TSH",
        value: "2.5",
        unit: "mIU/L",
        range: "0.4-4.0",
        flag: "Normal",
      },
      {
        name: "Free T4",
        value: "1.2",
        unit: "ng/dL",
        range: "0.8-1.8",
        flag: "Normal",
      },
      {
        name: "Free T3",
        value: "3.1",
        unit: "pg/mL",
        range: "2.3-4.2",
        flag: "Normal",
      },
    ],
    notes: "Normal thyroid function.",
  },
  {
    id: 6,
    testName: "Urinalysis",
    date: "2022-11-05",
    orderedBy: "Dr. Robert Williams",
    status: "Completed",
    results: [
      {
        name: "Color",
        value: "Yellow",
        unit: "",
        range: "Yellow",
        flag: "Normal",
      },
      {
        name: "Clarity",
        value: "Clear",
        unit: "",
        range: "Clear",
        flag: "Normal",
      },
      { name: "pH", value: "6.0", unit: "", range: "5.0-8.0", flag: "Normal" },
      {
        name: "Specific Gravity",
        value: "1.020",
        unit: "",
        range: "1.005-1.030",
        flag: "Normal",
      },
      {
        name: "Glucose",
        value: "Negative",
        unit: "",
        range: "Negative",
        flag: "Normal",
      },
      {
        name: "Protein",
        value: "Negative",
        unit: "",
        range: "Negative",
        flag: "Normal",
      },
      {
        name: "Ketones",
        value: "Negative",
        unit: "",
        range: "Negative",
        flag: "Normal",
      },
      {
        name: "Blood",
        value: "Negative",
        unit: "",
        range: "Negative",
        flag: "Normal",
      },
      {
        name: "Nitrite",
        value: "Negative",
        unit: "",
        range: "Negative",
        flag: "Normal",
      },
      {
        name: "Leukocyte Esterase",
        value: "Negative",
        unit: "",
        range: "Negative",
        flag: "Normal",
      },
    ],
    notes: "Normal urinalysis results.",
  },
];

/**
 * PatientLabResults component displays a patient's laboratory test results
 * Includes search functionality and detailed test information
 */
export function PatientLabResults() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTest, setSelectedTest] = useState<number | null>(null);

  // Filter lab results based on search query
  const filteredLabResults = labResults.filter((test) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      test.testName.toLowerCase().includes(query) ||
      test.orderedBy.toLowerCase().includes(query) ||
      test.date.includes(query)
    );
  });

  // Get the selected test details
  const selectedTestDetails = selectedTest
    ? labResults.find((test) => test.id === selectedTest)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Laboratory Results</h3>
        <div className="relative w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search lab tests..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lab Tests List */}
        <div className="md:col-span-1 space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-base">Test Results</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                {filteredLabResults.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No lab tests found matching your search.
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredLabResults.map((test) => (
                      <div
                        key={test.id}
                        className={`p-4 cursor-pointer hover:bg-muted/50 ${
                          selectedTest === test.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedTest(test.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">
                              {test.testName}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {test.date} • {test.orderedBy}
                            </p>
                          </div>
                          <Badge variant="outline">{test.status}</Badge>
                        </div>
                        {test.results.some((r) => r.flag !== "Normal") && (
                          <div className="mt-2 flex items-center text-xs text-amber-500">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            <span>Abnormal results</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Details */}
        <div className="md:col-span-2">
          {selectedTestDetails ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedTestDetails.testName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedTestDetails.date} • Ordered by{" "}
                      {selectedTestDetails.orderedBy}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Reference Range</TableHead>
                        <TableHead>Flag</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTestDetails.results.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {result.name}
                          </TableCell>
                          <TableCell>{result.value}</TableCell>
                          <TableCell>{result.unit}</TableCell>
                          <TableCell>{result.range}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                result.flag === "Normal"
                                  ? "outline"
                                  : result.flag === "High" ||
                                    result.flag === "Low"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {result.flag}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {selectedTestDetails.notes && (
                    <div className="p-4 bg-muted/50 rounded-md">
                      <h4 className="font-medium mb-1">Notes</h4>
                      <p className="text-sm">{selectedTestDetails.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No test selected</p>
                <p className="text-sm text-muted-foreground">
                  Select a test from the list to view detailed results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
