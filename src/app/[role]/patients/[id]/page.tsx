"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  FileText,
  Printer,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { samplePatients } from "@/components/patients/patient-list";
import { Patient } from "@/types/patient";
import Link from "next/link";
import { PatientVitals } from "@/components/patients/patient-vitals";
import { PatientMedicalHistory } from "@/components/patients/patient-medical-history";
import { PatientPrescriptions } from "@/components/patients/patient-prescriptions";
import { PatientLabResults } from "@/components/patients/patient-lab-results";
import { PatientAppointments } from "@/components/patients/patient-appointments";
import { PatientNotes } from "@/components/patients/patient-notes";
import { cn } from "@/lib/utils";

/**
 * PatientDetailsPage displays comprehensive information about a specific patient
 * It includes multiple tabs for different aspects of patient care
 */
export default function PatientDetailsPage() {
  const params = useParams();
  const patientId = Number(params.id);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  // In a real app, this would fetch from an API
  useEffect(() => {
    const foundPatient = samplePatients.find((p) => p.id === patientId);
    if (foundPatient) {
      setPatient(foundPatient);
    }
  }, [patientId]);

  if (!patient) {
    return (
      <div className="p-8 text-center">Loading patient information...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with patient info and actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <Link href={`/${params.role}/patients`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{patient.name}</h1>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{patient.age} years</span>
              <span>•</span>
              <span>{patient.gender}</span>
              <span>•</span>
              <Badge
                variant={patient.status === "Stable" ? "default" : "secondary"}
                className={cn(
                  patient.status === "Stable"
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                )}
              >
                {patient.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Patient
          </Button>
        </div>
      </div>

      {/* Patient summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Next Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Aug 12, 2023</span>
            </div>
            <div className="mt-1 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>10:30 AM</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Primary Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{patient.condition}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Diagnosed on {patient.lastVisit}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Phone:</span> {patient.phone}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email:</span> {patient.email}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <PatientVitals patientId={patient.id} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <PatientMedicalHistory patientId={patient.id} />
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4">
          <PatientPrescriptions patientId={patient.id} />
        </TabsContent>

        <TabsContent value="lab-results" className="space-y-4">
          <PatientLabResults patientId={patient.id} />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <PatientAppointments patientId={patient.id} />
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <PatientNotes patientId={patient.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
