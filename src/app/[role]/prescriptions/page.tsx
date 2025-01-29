"use client";

import { useParams } from "next/navigation";
import { User, Calendar, Clock } from "lucide-react";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  id: number;
  patientName: string;
  date: string;
  medications: Medication[];
  notes: string;
  status: "active" | "completed" | "expired";
}

const prescriptions: Prescription[] = [
  {
    id: 1,
    patientName: "John Doe",
    date: "2024-01-20",
    medications: [
      {
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "3 times daily",
        duration: "7 days",
      },
      {
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "As needed",
        duration: "5 days",
      },
    ],
    notes: "Take with food. Complete the full course.",
    status: "active",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    date: "2024-01-19",
    medications: [
      {
        name: "Metformin",
        dosage: "1000mg",
        frequency: "2 times daily",
        duration: "30 days",
      },
    ],
    notes: "Take with meals. Monitor blood sugar levels.",
    status: "active",
  },
  // Add more prescriptions as needed
];

interface PrescriptionCardProps {
  prescription: Prescription;
}

function PrescriptionCard({ prescription }: PrescriptionCardProps) {
  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {prescription.patientName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{prescription.date}</span>
            </div>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            prescription.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {prescription.status}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Medications
          </h4>
          <div className="space-y-2">
            {prescription.medications.map((med, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{med.name}</span>
                  <span className="text-sm text-gray-500">{med.dosage}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {med.frequency}
                  </div>
                  <div>Duration: {med.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {prescription.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
            <p className="text-sm text-gray-500">{prescription.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Edit Prescription
        </button>
        <button className="px-4 py-2 text-blue-600 hover:text-blue-700">
          Print
        </button>
      </div>
    </div>
  );
}

export default function PrescriptionsPage() {
  const { role } = useParams();

  if (role !== "doctor") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Prescriptions
          </h2>
          <p className="text-sm text-gray-500">Manage patient prescriptions</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          New Prescription
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {prescriptions.map((prescription) => (
          <PrescriptionCard key={prescription.id} prescription={prescription} />
        ))}
      </div>
    </div>
  );
}
