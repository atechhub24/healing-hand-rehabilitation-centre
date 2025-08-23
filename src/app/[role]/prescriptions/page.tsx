"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PrescriptionCard,
  printPrescription,
  type Prescription,
} from "@/components/prescriptions";

// Types are now imported from the prescriptions module

const prescriptions: Prescription[] = [
  {
    id: 1,
    patient: {
      name: "John Doe",
      age: "35",
      phone: "+1234567890",
      address: "123 Main St, City, State",
    },
    date: "2024-01-20",
    medications: [
      {
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "3 times daily",
        duration: "7 days",
        instructions: "Take with food",
      },
      {
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "As needed",
        duration: "5 days",
        instructions: "For pain relief",
      },
    ],
    diagnosis: "Upper Respiratory Infection",
    notes: "Complete the full course of antibiotics. Take with food.",
    doctorName: "Dr. Laxmi Kanta Mishra",
    status: "active",
  },
  {
    id: 2,
    patient: {
      name: "Jane Smith",
      age: "42",
      phone: "+0987654321",
      address: "456 Oak Ave, City, State",
    },
    date: "2024-01-19",
    medications: [
      {
        name: "Metformin",
        dosage: "1000mg",
        frequency: "2 times daily",
        duration: "30 days",
        instructions: "Take with meals",
      },
    ],
    diagnosis: "Type 2 Diabetes",
    notes: "Monitor blood sugar levels. Follow diabetic diet.",
    doctorName: "Dr. Laxmi Kanta Mishra",
    status: "active",
  },
];

// PrescriptionCard is now imported from the prescriptions module

export default function PrescriptionsPage() {
  const router = useRouter();

  const handlePrint = (prescription: Prescription) => {
    printPrescription(prescription);
  };
  const { role } = useParams();
  const handleNewPrescription = () => {
    router.push(`/${role}/prescriptions/new`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Prescriptions
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage patient prescriptions
          </p>
        </div>
        <Button onClick={handleNewPrescription}>
          <Plus className="h-4 w-4 mr-2" />
          New Prescription
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {prescriptions.map((prescription) => (
          <PrescriptionCard
            key={prescription.id}
            prescription={prescription}
            onPrint={handlePrint}
          />
        ))}
      </div>
    </div>
  );
}
