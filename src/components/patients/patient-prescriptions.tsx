"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, AlertCircle } from "lucide-react";

// Sample prescription data
const prescriptions = [
  {
    id: 1,
    medication: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    prescribedDate: "2023-01-15",
    endDate: "2023-07-15",
    refills: 2,
    prescribedBy: "Dr. Sarah Johnson",
    status: "Active",
    instructions: "Take in the morning with food",
    pharmacy: "MedPlus Pharmacy",
    notes: "For blood pressure control",
  },
  {
    id: 2,
    medication: "Metformin",
    dosage: "1000mg",
    frequency: "Twice daily",
    prescribedDate: "2023-02-10",
    endDate: "2023-08-10",
    refills: 3,
    prescribedBy: "Dr. Sarah Johnson",
    status: "Active",
    instructions: "Take with meals",
    pharmacy: "MedPlus Pharmacy",
    notes: "For diabetes management",
  },
  {
    id: 3,
    medication: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    prescribedDate: "2023-01-15",
    endDate: "2023-07-15",
    refills: 2,
    prescribedBy: "Dr. Sarah Johnson",
    status: "Active",
    instructions: "Take at bedtime",
    pharmacy: "MedPlus Pharmacy",
    notes: "For cholesterol management",
  },
  {
    id: 4,
    medication: "Albuterol Inhaler",
    dosage: "90mcg",
    frequency: "As needed",
    prescribedDate: "2023-03-05",
    endDate: "2024-03-05",
    refills: 5,
    prescribedBy: "Dr. Michael Chen",
    status: "Active",
    instructions: "2 puffs every 4-6 hours as needed for shortness of breath",
    pharmacy: "HealthWay Pharmacy",
    notes: "For asthma symptoms",
  },
  {
    id: 5,
    medication: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    prescribedDate: "2022-11-20",
    endDate: "2022-11-30",
    refills: 0,
    prescribedBy: "Dr. Robert Williams",
    status: "Completed",
    instructions: "Take until completed",
    pharmacy: "MedPlus Pharmacy",
    notes: "For sinus infection",
  },
  {
    id: 6,
    medication: "Prednisone",
    dosage: "10mg",
    frequency: "Once daily for 5 days, then taper",
    prescribedDate: "2022-10-05",
    endDate: "2022-10-15",
    refills: 0,
    prescribedBy: "Dr. Michael Chen",
    status: "Completed",
    instructions: "Take with food. Follow tapering schedule.",
    pharmacy: "HealthWay Pharmacy",
    notes: "For acute asthma exacerbation",
  },
];

/**
 * PatientPrescriptions component displays a patient's current and past prescriptions
 * Includes search functionality and detailed prescription information
 */
export function PatientPrescriptions() {
  const [activeTab, setActiveTab] = useState("current");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter prescriptions based on active tab and search query
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesStatus =
      (activeTab === "current" && prescription.status === "Active") ||
      (activeTab === "past" && prescription.status === "Completed");

    if (!searchQuery) return matchesStatus;

    const query = searchQuery.toLowerCase();
    return (
      matchesStatus &&
      (prescription.medication.toLowerCase().includes(query) ||
        prescription.prescribedBy.toLowerCase().includes(query) ||
        prescription.pharmacy.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search prescriptions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredPrescriptions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No prescriptions found</p>
            <p className="text-sm text-muted-foreground">
              {activeTab === "current"
                ? "There are no active prescriptions matching your search."
                : "There are no past prescriptions matching your search."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      {prescription.medication} {prescription.dosage}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {prescription.frequency}
                    </p>
                  </div>
                  <Badge
                    variant={
                      prescription.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {prescription.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>Prescribed: {prescription.prescribedDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>Expires: {prescription.endDate}</span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Prescribed by:</span>{" "}
                      {prescription.prescribedBy}
                    </p>
                    <p>
                      <span className="font-medium">Pharmacy:</span>{" "}
                      {prescription.pharmacy}
                    </p>
                    <p>
                      <span className="font-medium">Refills:</span>{" "}
                      {prescription.refills} remaining
                    </p>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium">Instructions:</p>
                    <p className="text-muted-foreground">
                      {prescription.instructions}
                    </p>
                  </div>

                  {prescription.notes && (
                    <div className="text-sm">
                      <p className="font-medium">Notes:</p>
                      <p className="text-muted-foreground">
                        {prescription.notes}
                      </p>
                    </div>
                  )}

                  {prescription.status === "Active" && (
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        Request Refill
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
