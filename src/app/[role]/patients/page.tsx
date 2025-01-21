"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { User, Phone, Mail, Calendar, FileText } from "lucide-react";

const patients = [
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

function PatientCard({ patient }) {
  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-500">
              {patient.age} years • {patient.gender}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            patient.status === "Stable"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {patient.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Phone className="h-4 w-4" />
          <span>{patient.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Mail className="h-4 w-4" />
          <span>{patient.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Last Visit: {patient.lastVisit}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText className="h-4 w-4" />
          <span>Condition: {patient.condition}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          View Details
        </button>
        <button className="px-4 py-2 text-blue-600 hover:text-blue-700">
          Update Record
        </button>
      </div>
    </div>
  );
}

export default function PatientsPage() {
  const params = useParams();
  const { role } = useAuth();

  if (!["doctor", "paramedic"].includes(role)) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Patients</h2>
          <p className="text-sm text-gray-500">
            Manage and view patient records
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Patient
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}
