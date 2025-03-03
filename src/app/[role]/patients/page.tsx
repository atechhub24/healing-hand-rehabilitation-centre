"use client";

import { useState, useMemo } from "react";
import { PatientList } from "@/components/patients/patient-list";
import { PatientSearch } from "@/components/patients/patient-search";
import { AddPatientButton } from "@/components/patients/add-patient-button";
import { Patient } from "@/types/patient";
import { Card, CardContent } from "@/components/ui/card";
import useFetch from "@/lib/hooks/use-fetch";

/**
 * PatientsPage is the main page for viewing and managing patient records
 * It includes search functionality and displays a list of patient cards
 */
export default function PatientsPage() {
  // Fetch patients directly from the patients path
  const [patients, isLoading] = useFetch<Patient[]>("patients");

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Derive filtered patients from patients data and search query
  const filteredPatients = useMemo(() => {
    if (!patients) return null;

    if (!searchQuery.trim()) {
      return patients;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    return patients.filter(
      (patient) =>
        patient.name?.toLowerCase().includes(lowercaseQuery) ||
        patient.email?.toLowerCase().includes(lowercaseQuery) ||
        patient.condition?.toLowerCase().includes(lowercaseQuery) ||
        patient.phone?.toLowerCase().includes(lowercaseQuery)
    );
  }, [patients, searchQuery]);

  /**
   * Handles search queries and updates the search query state
   * @param query - The search query string
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
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

      <PatientList patients={filteredPatients} isLoading={isLoading} />
    </div>
  );
}
