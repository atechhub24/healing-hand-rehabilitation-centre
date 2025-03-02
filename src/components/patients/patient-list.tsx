import { Patient } from "@/types/patient";
import { PatientCard } from "./patient-card";

/**
 * Sample patient data for demonstration
 */
export const samplePatients: Patient[] = [
  {
    id: 1,
    name: "John Doe",
    age: 45,
    gender: "Male",
    phone: "+1 234-567-8900",
    email: "john.doe@example.com",
    lastVisit: "2024-01-15",
    condition: "Hypertension",
    status: "Stable",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    phone: "+1 234-567-8901",
    email: "jane.smith@example.com",
    lastVisit: "2024-01-18",
    condition: "Diabetes Type 2",
    status: "Under Observation",
  },
  // Add more patients as needed
];

interface PatientListProps {
  patients: Patient[];
}

/**
 * PatientList component displays a grid of patient cards
 * @param patients - Array of patient objects to display
 */
export function PatientList({ patients }: PatientListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
}
