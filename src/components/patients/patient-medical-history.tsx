import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface PatientMedicalHistoryProps {
  patientId: number;
}

// Sample data - in a real app, this would come from an API
const medicalConditions = [
  {
    id: 1,
    condition: "Hypertension",
    diagnosedDate: "2020-03-15",
    status: "Active",
    notes: "Well-controlled with medication",
    medications: ["Lisinopril 10mg daily"],
  },
  {
    id: 2,
    condition: "Type 2 Diabetes",
    diagnosedDate: "2019-07-22",
    status: "Active",
    notes: "Managed with diet and medication",
    medications: ["Metformin 500mg twice daily"],
  },
  {
    id: 3,
    condition: "Hyperlipidemia",
    diagnosedDate: "2020-03-15",
    status: "Active",
    notes: "Monitoring cholesterol levels",
    medications: ["Atorvastatin 20mg daily"],
  },
];

const surgicalHistory = [
  {
    id: 1,
    procedure: "Appendectomy",
    date: "2010-05-12",
    hospital: "Memorial Hospital",
    surgeon: "Dr. James Wilson",
    notes: "No complications",
  },
  {
    id: 2,
    procedure: "Knee Arthroscopy",
    date: "2018-11-03",
    hospital: "University Medical Center",
    surgeon: "Dr. Sarah Johnson",
    notes: "Meniscus repair",
  },
];

const allergies = [
  {
    id: 1,
    allergen: "Penicillin",
    reaction: "Hives, difficulty breathing",
    severity: "Severe",
    noted: "2015-02-10",
  },
  {
    id: 2,
    allergen: "Shellfish",
    reaction: "Nausea, vomiting",
    severity: "Moderate",
    noted: "2018-06-22",
  },
  {
    id: 3,
    allergen: "Pollen",
    reaction: "Sneezing, watery eyes",
    severity: "Mild",
    noted: "2012-04-15",
  },
];

const familyHistory = [
  {
    id: 1,
    relation: "Father",
    condition: "Hypertension",
    age: 65,
    notes: "Diagnosed at age 50",
  },
  {
    id: 2,
    relation: "Mother",
    condition: "Type 2 Diabetes",
    age: 62,
    notes: "Diagnosed at age 55",
  },
  {
    id: 3,
    relation: "Paternal Grandfather",
    condition: "Coronary Artery Disease",
    age: "Deceased at 72",
    notes: "Heart attack",
  },
];

const immunizations = [
  {
    id: 1,
    vaccine: "Influenza",
    date: "2022-10-15",
    location: "Primary Care Office",
    notes: "Annual vaccination",
  },
  {
    id: 2,
    vaccine: "COVID-19",
    date: "2021-04-10",
    location: "Community Vaccination Center",
    notes: "Pfizer - 2nd dose",
  },
  {
    id: 3,
    vaccine: "Tetanus/Diphtheria/Pertussis (Tdap)",
    date: "2019-08-22",
    location: "Primary Care Office",
    notes: "10-year booster",
  },
];

/**
 * PatientMedicalHistory component displays comprehensive medical history for a patient
 * @param patientId - The ID of the patient to display medical history for
 */
export function PatientMedicalHistory({
  patientId,
}: PatientMedicalHistoryProps) {
  // In a real app, we would fetch the patient's medical history based on the ID

  return (
    <div className="space-y-6">
      <Tabs defaultValue="conditions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="conditions">Medical Conditions</TabsTrigger>
          <TabsTrigger value="surgical">Surgical History</TabsTrigger>
          <TabsTrigger value="allergies">Allergies</TabsTrigger>
          <TabsTrigger value="family">Family History</TabsTrigger>
          <TabsTrigger value="immunizations">Immunizations</TabsTrigger>
        </TabsList>

        <TabsContent value="conditions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Medical Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left font-medium">Condition</th>
                      <th className="py-3 text-left font-medium">Diagnosed</th>
                      <th className="py-3 text-left font-medium">Status</th>
                      <th className="py-3 text-left font-medium">Notes</th>
                      <th className="py-3 text-left font-medium">
                        Medications
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicalConditions.map((condition) => (
                      <tr key={condition.id} className="border-b">
                        <td className="py-3 font-medium">
                          {condition.condition}
                        </td>
                        <td className="py-3">{condition.diagnosedDate}</td>
                        <td className="py-3">
                          <Badge
                            variant={
                              condition.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {condition.status}
                          </Badge>
                        </td>
                        <td className="py-3">{condition.notes}</td>
                        <td className="py-3">
                          <ul className="list-disc pl-4">
                            {condition.medications.map((med, idx) => (
                              <li key={idx}>{med}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surgical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Surgical History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left font-medium">Procedure</th>
                      <th className="py-3 text-left font-medium">Date</th>
                      <th className="py-3 text-left font-medium">Hospital</th>
                      <th className="py-3 text-left font-medium">Surgeon</th>
                      <th className="py-3 text-left font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surgicalHistory.map((surgery) => (
                      <tr key={surgery.id} className="border-b">
                        <td className="py-3 font-medium">
                          {surgery.procedure}
                        </td>
                        <td className="py-3">{surgery.date}</td>
                        <td className="py-3">{surgery.hospital}</td>
                        <td className="py-3">{surgery.surgeon}</td>
                        <td className="py-3">{surgery.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allergies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Allergies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left font-medium">Allergen</th>
                      <th className="py-3 text-left font-medium">Reaction</th>
                      <th className="py-3 text-left font-medium">Severity</th>
                      <th className="py-3 text-left font-medium">
                        First Noted
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allergies.map((allergy) => (
                      <tr key={allergy.id} className="border-b">
                        <td className="py-3 font-medium">{allergy.allergen}</td>
                        <td className="py-3">{allergy.reaction}</td>
                        <td className="py-3">
                          <Badge
                            variant={
                              allergy.severity === "Severe"
                                ? "destructive"
                                : allergy.severity === "Moderate"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {allergy.severity}
                          </Badge>
                        </td>
                        <td className="py-3">{allergy.noted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Family Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left font-medium">Relation</th>
                      <th className="py-3 text-left font-medium">Condition</th>
                      <th className="py-3 text-left font-medium">Age</th>
                      <th className="py-3 text-left font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {familyHistory.map((history) => (
                      <tr key={history.id} className="border-b">
                        <td className="py-3 font-medium">{history.relation}</td>
                        <td className="py-3">{history.condition}</td>
                        <td className="py-3">{history.age}</td>
                        <td className="py-3">{history.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="immunizations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Immunization Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left font-medium">Vaccine</th>
                      <th className="py-3 text-left font-medium">Date</th>
                      <th className="py-3 text-left font-medium">Location</th>
                      <th className="py-3 text-left font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {immunizations.map((immunization) => (
                      <tr key={immunization.id} className="border-b">
                        <td className="py-3 font-medium">
                          {immunization.vaccine}
                        </td>
                        <td className="py-3">{immunization.date}</td>
                        <td className="py-3">{immunization.location}</td>
                        <td className="py-3">{immunization.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
