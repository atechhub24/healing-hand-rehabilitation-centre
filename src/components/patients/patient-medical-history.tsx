"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Sample data for medical history
const medicalConditions = [
  {
    id: 1,
    condition: "Hypertension",
    diagnosedDate: "2018-05-12",
    status: "Active",
    notes: "Well controlled with medication. Regular monitoring required.",
    medications: ["Lisinopril 10mg daily", "Hydrochlorothiazide 12.5mg daily"],
  },
  {
    id: 2,
    condition: "Type 2 Diabetes",
    diagnosedDate: "2019-03-22",
    status: "Active",
    notes: "HbA1c levels stable at 6.8%. Diet and exercise regimen in place.",
    medications: ["Metformin 1000mg twice daily"],
  },
  {
    id: 3,
    condition: "Asthma",
    diagnosedDate: "2010-11-05",
    status: "Controlled",
    notes: "Occasional exacerbations during spring allergy season.",
    medications: ["Albuterol inhaler as needed", "Fluticasone inhaler daily"],
  },
  {
    id: 4,
    condition: "Hypercholesterolemia",
    diagnosedDate: "2020-01-15",
    status: "Active",
    notes: "Last lipid panel showed improvement. Continue current management.",
    medications: ["Atorvastatin 20mg daily"],
  },
];

const surgicalHistory = [
  {
    id: 1,
    procedure: "Appendectomy",
    date: "2005-08-17",
    hospital: "Memorial Hospital",
    surgeon: "Dr. Sarah Johnson",
    notes: "Laparoscopic procedure. No complications.",
  },
  {
    id: 2,
    procedure: "Knee Arthroscopy",
    date: "2015-11-23",
    hospital: "Orthopedic Surgical Center",
    surgeon: "Dr. Michael Chen",
    notes:
      "Right knee meniscus repair. Full recovery achieved after 3 months of physical therapy.",
  },
  {
    id: 3,
    procedure: "Cholecystectomy",
    date: "2019-04-05",
    hospital: "University Medical Center",
    surgeon: "Dr. Robert Williams",
    notes: "Gallbladder removal due to gallstones. Uncomplicated recovery.",
  },
];

const familyHistory = [
  {
    id: 1,
    relation: "Father",
    condition: "Coronary Artery Disease",
    age: "55",
    notes: "Underwent bypass surgery at age 55. Currently stable.",
  },
  {
    id: 2,
    relation: "Mother",
    condition: "Breast Cancer",
    age: "62",
    notes: "Diagnosed at age 62. In remission after treatment.",
  },
  {
    id: 3,
    relation: "Maternal Grandmother",
    condition: "Type 2 Diabetes",
    age: "50",
    notes:
      "Diagnosed in her 50s. Managed with medication until her passing at age 78.",
  },
  {
    id: 4,
    relation: "Paternal Grandfather",
    condition: "Stroke",
    age: "68",
    notes: "Fatal stroke at age 68. Had history of untreated hypertension.",
  },
];

/**
 * PatientMedicalHistory component displays a patient's medical conditions,
 * surgical history, and family medical history
 */
export function PatientMedicalHistory() {
  const [activeTab, setActiveTab] = useState("conditions");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conditions">Medical Conditions</TabsTrigger>
          <TabsTrigger value="surgical">Surgical History</TabsTrigger>
          <TabsTrigger value="family">Family History</TabsTrigger>
        </TabsList>

        {/* Medical Conditions Tab */}
        <TabsContent value="conditions" className="space-y-4">
          {medicalConditions.map((condition) => (
            <Card key={condition.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      {condition.condition}
                    </CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      <span>Diagnosed: {condition.diagnosedDate}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      condition.status === "Active"
                        ? "default"
                        : condition.status === "Controlled"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {condition.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">{condition.notes}</div>
                  {condition.medications &&
                    condition.medications.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mt-2">
                          Medications:
                        </h4>
                        <ul className="list-disc list-inside text-sm pl-2">
                          {condition.medications.map((med, idx) => (
                            <li key={idx}>{med}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Surgical History Tab */}
        <TabsContent value="surgical" className="space-y-4">
          {surgicalHistory.map((surgery) => (
            <Card key={surgery.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      {surgery.procedure}
                    </CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      <span>{surgery.date}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Hospital:</span>{" "}
                      {surgery.hospital}
                    </div>
                    <div>
                      <span className="font-medium">Surgeon:</span>{" "}
                      {surgery.surgeon}
                    </div>
                  </div>
                  <div className="text-sm mt-2">{surgery.notes}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Family History Tab */}
        <TabsContent value="family">
          <Card>
            <CardHeader>
              <CardTitle>Family Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {familyHistory.map((history) => (
                  <AccordionItem key={history.id} value={`item-${history.id}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center text-left">
                        <div className="mr-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <span className="font-medium">
                            {history.relation}:
                          </span>{" "}
                          {history.condition}
                          {history.age && (
                            <span className="text-muted-foreground ml-2">
                              (Age: {history.age})
                            </span>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-6 text-sm">{history.notes}</div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
