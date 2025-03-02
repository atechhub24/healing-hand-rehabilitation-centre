"use client";

import { useState } from "react";
import {
  PatientList,
  samplePatients,
} from "@/components/patients/patient-list";
import { PatientSearch } from "@/components/patients/patient-search";
import { AddPatientButton } from "@/components/patients/add-patient-button";
import { Patient } from "@/types/patient";
import { Card, CardContent } from "@/components/ui/card";

/**
 * PatientsPage is the main page for viewing and managing patient records
 * It includes search functionality and displays a list of patient cards
 */
export default function PatientsPage() {
  const [filteredPatients, setFilteredPatients] =
    useState<Patient[]>(samplePatients);

  /**
   * Handles search queries and filters the patient list
   * @param query - The search query string
   */
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredPatients(samplePatients);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = samplePatients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(lowercaseQuery) ||
        patient.email.toLowerCase().includes(lowercaseQuery) ||
        patient.condition.toLowerCase().includes(lowercaseQuery)
    );

    setFilteredPatients(filtered);
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Patients</h2>
              <p className="text-sm text-gray-500">
                Manage and view patient records
              </p>
            </div>
            <div className="flex gap-2">
              <PatientSearch onSearch={handleSearch} />
              <AddPatientButton />
            </div>
          </div>
        </CardContent>
      </Card>

      <PatientList patients={filteredPatients} />
    </div>
  );
}
