"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { PrescriptionManager } from "./prescription-manager";
import {
  EditMedicalCondition,
  MedicalCondition,
} from "./edit-medical-condition";
import {
  EditSurgicalHistory,
  SurgicalProcedure,
} from "./edit-surgical-history";
import { EditFamilyHistory, FamilyHistory } from "./edit-family-history";

// Sample data
const sampleMedicalConditions: MedicalCondition[] = [
  {
    condition: "Type 2 Diabetes",
    diagnosedDate: new Date("2020-03-15"),
    status: "Active",
    notes: "Well controlled with medication and diet",
    medications: ["Metformin 1000mg twice daily"],
  },
  {
    condition: "Hypertension",
    diagnosedDate: new Date("2019-07-22"),
    status: "Active",
    notes: "Monitoring regularly",
    medications: ["Lisinopril 10mg once daily"],
  },
];

const sampleSurgicalHistory: SurgicalProcedure[] = [
  {
    procedure: "Appendectomy",
    date: new Date("2015-11-10"),
    hospital: "City General Hospital",
    surgeon: "Dr. James Wilson",
    notes: "Laparoscopic procedure, no complications",
  },
  {
    procedure: "Knee Arthroscopy",
    date: new Date("2018-05-20"),
    hospital: "Sports Medicine Center",
    surgeon: "Dr. Sarah Miller",
    notes: "Meniscus repair",
  },
];

const sampleFamilyHistory: FamilyHistory[] = [
  {
    relation: "Father",
    condition: "Type 2 Diabetes",
    age: "45",
    notes: "Diagnosed at age 45, managed with medication",
  },
  {
    relation: "Mother",
    condition: "Breast Cancer",
    age: "52",
    notes: "Successfully treated, in remission",
  },
  {
    relation: "Grandfather (Paternal)",
    condition: "Heart Disease",
    age: "60",
    notes: "Died from heart attack at age 68",
  },
];

/**
 * MedicalRecordsTab component for displaying and managing patient medical records
 * @param patientId - The ID of the patient
 */
export function MedicalRecordsTab({ patientId }: { patientId: number }) {
  const [medicalConditions, setMedicalConditions] = useState<
    MedicalCondition[]
  >(sampleMedicalConditions);
  const [surgicalHistory, setSurgicalHistory] = useState<SurgicalProcedure[]>(
    sampleSurgicalHistory
  );
  const [familyHistory, setFamilyHistory] =
    useState<FamilyHistory[]>(sampleFamilyHistory);

  // Handle adding a new medical condition
  const handleAddMedicalCondition = (data: MedicalCondition) => {
    setMedicalConditions([...medicalConditions, data]);
  };

  // Handle adding a new surgical procedure
  const handleAddSurgicalProcedure = (data: SurgicalProcedure) => {
    setSurgicalHistory([...surgicalHistory, data]);
  };

  // Handle adding a new family history record
  const handleAddFamilyHistory = (data: FamilyHistory) => {
    setFamilyHistory([...familyHistory, data]);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="conditions" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="conditions">Medical Conditions</TabsTrigger>
          <TabsTrigger value="surgeries">Surgical History</TabsTrigger>
          <TabsTrigger value="family">Family History</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        {/* Medical Conditions Tab */}
        <TabsContent value="conditions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Medical Conditions</h2>
            <EditMedicalCondition
              onSave={handleAddMedicalCondition}
              onCancel={() => {}}
            />
          </div>

          {medicalConditions.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No medical conditions recorded.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {medicalConditions.map((condition, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {condition.condition}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Diagnosed:{" "}
                          {condition.diagnosedDate?.toLocaleDateString()} •
                          Status: {condition.status}
                        </p>
                        {condition.notes && (
                          <p className="mt-2 text-sm">{condition.notes}</p>
                        )}

                        {condition.medications &&
                          condition.medications.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">
                                Medications
                              </h4>
                              <ul className="space-y-1">
                                {condition.medications.map((med, medIndex) => (
                                  <li key={medIndex} className="text-sm">
                                    {med}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                      <EditMedicalCondition
                        condition={condition}
                        onSave={(data) => {
                          const updatedConditions = [...medicalConditions];
                          updatedConditions[index] = data;
                          setMedicalConditions(updatedConditions);
                        }}
                        onCancel={() => {}}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Surgical History Tab */}
        <TabsContent value="surgeries" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Surgical History</h2>
            <EditSurgicalHistory
              onSave={handleAddSurgicalProcedure}
              onCancel={() => {}}
            />
          </div>

          {surgicalHistory.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No surgical procedures recorded.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {surgicalHistory.map((procedure, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {procedure.procedure}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Date: {procedure.date?.toLocaleDateString()}
                          {procedure.hospital &&
                            ` • Hospital: ${procedure.hospital}`}
                          {procedure.surgeon &&
                            ` • Surgeon: ${procedure.surgeon}`}
                        </p>
                        {procedure.notes && (
                          <p className="mt-2 text-sm">{procedure.notes}</p>
                        )}
                      </div>
                      <EditSurgicalHistory
                        procedure={procedure}
                        onSave={(data) => {
                          const updatedProcedures = [...surgicalHistory];
                          updatedProcedures[index] = data;
                          setSurgicalHistory(updatedProcedures);
                        }}
                        onCancel={() => {}}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Family History Tab */}
        <TabsContent value="family" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Family History</h2>
            <EditFamilyHistory
              onSave={handleAddFamilyHistory}
              onCancel={() => {}}
            />
          </div>

          {familyHistory.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No family history recorded.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {familyHistory.map((record, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {record.relation}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Condition: {record.condition}
                          {record.age && ` • Age of onset: ${record.age}`}
                        </p>
                        {record.notes && (
                          <p className="mt-2 text-sm">{record.notes}</p>
                        )}
                      </div>
                      <EditFamilyHistory
                        history={record}
                        onSave={(data) => {
                          const updatedHistory = [...familyHistory];
                          updatedHistory[index] = data;
                          setFamilyHistory(updatedHistory);
                        }}
                        onCancel={() => {}}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions">
          <PrescriptionManager patientId={patientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
