import { Patient } from "@/types/patient";
import { PatientCard } from "./patient-card";

interface PatientListProps {
  patients: Patient[] | null;
  isLoading: boolean;
  onPatientDeleted?: () => void;
}

/**
 * PatientList component displays a grid of patient cards
 * @param patients - Array of patient objects to display
 * @param isLoading - Boolean indicating if data is still loading
 * @param onPatientDeleted - Optional callback function when a patient is deleted
 */
export function PatientList({
  patients,
  isLoading,
  onPatientDeleted,
}: PatientListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="p-6 space-y-4">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No patients found</h3>
        <p className="text-muted-foreground">
          Add a new patient to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {patients.map((patient) => (
        <PatientCard
          key={patient.uid}
          patient={patient}
          onDeleted={onPatientDeleted}
        />
      ))}
    </div>
  );
}
