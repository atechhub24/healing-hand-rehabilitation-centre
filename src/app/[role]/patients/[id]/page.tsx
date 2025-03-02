"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Mail, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MedicalRecordsTab } from "@/components/patients/medical-records-tab";
import { PatientOverview } from "@/components/patients/patient-overview";
import { PatientPrescriptions } from "@/components/patients/patient-prescriptions";
import { PatientLabResults } from "@/components/patients/patient-lab-results";
import { PatientAppointments } from "@/components/patients/patient-appointments";
import { PatientNotes } from "@/components/patients/patient-notes";

// Sample patient data
const patientData = {
  id: 1,
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  dob: "1985-06-15",
  gender: "Male",
  address: "123 Main St, Anytown, CA 94123",
  bloodType: "O+",
  allergies: ["Penicillin", "Peanuts"],
  emergencyContact: {
    name: "Jane Smith",
    relation: "Spouse",
    phone: "+1 (555) 987-6543",
  },
  insuranceProvider: "HealthPlus Insurance",
  insuranceNumber: "HP12345678",
  registrationDate: "2022-03-10",
};

/**
 * PatientDetailsPage component displays detailed information about a patient
 */
export default function PatientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = Number(params.id);

  // In a real application, we would fetch the patient data based on the ID
  // const { data: patient, isLoading, error } = useFetch(`/api/patients/${patientId}`);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Patient Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patientData.name}`}
                  alt={patientData.name}
                />
                <AvatarFallback>
                  {patientData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{patientData.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Patient ID: {patientData.id}
                </p>
                <div className="flex justify-center mt-2">
                  <Badge variant="outline">{patientData.bloodType}</Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Gender & DOB</p>
                  <p className="text-sm text-muted-foreground">
                    {patientData.gender} •{" "}
                    {new Date(patientData.dob).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {patientData.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {patientData.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {patientData.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Registration Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(
                      patientData.registrationDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {patientData.allergies.map((allergy, index) => (
                  <Badge key={index} variant="secondary">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Emergency Contact</h3>
              <div className="text-sm">
                <p>
                  {patientData.emergencyContact.name} (
                  {patientData.emergencyContact.relation})
                </p>
                <p className="text-muted-foreground">
                  {patientData.emergencyContact.phone}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Insurance</h3>
              <div className="text-sm">
                <p>{patientData.insuranceProvider}</p>
                <p className="text-muted-foreground">
                  Policy: {patientData.insuranceNumber}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button
                className="w-full"
                onClick={() =>
                  router.push(`/doctor/patients/${patientId}/edit`)
                }
              >
                Edit Patient
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
              <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-6">
              <PatientOverview patientId={patientId} />
            </TabsContent>

            <TabsContent value="medical-records" className="mt-6">
              <MedicalRecordsTab patientId={patientId} />
            </TabsContent>

            <TabsContent value="prescriptions" className="mt-6">
              <PatientPrescriptions />
            </TabsContent>

            <TabsContent value="lab-results" className="mt-6">
              <PatientLabResults />
            </TabsContent>

            <TabsContent value="appointments" className="mt-6">
              <PatientAppointments />
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <PatientNotes />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
