"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { FileText, Calendar, User, Activity, Download } from "lucide-react";

interface MedicalRecord {
  id: number;
  title: string;
  date: string;
  doctor: string;
  type: string;
  findings: string;
  recommendations: string;
}

const medicalRecords: MedicalRecord[] = [
  {
    id: 1,
    title: "Annual Health Checkup",
    date: "2024-01-15",
    doctor: "Dr. Sarah Johnson",
    type: "General Checkup",
    findings: "Normal health status. Blood pressure: 120/80",
    recommendations: "Continue regular exercise and balanced diet",
  },
  {
    id: 2,
    title: "Dental Examination",
    date: "2024-01-10",
    doctor: "Dr. Michael Brown",
    type: "Dental",
    findings: "Minor cavity in lower right molar",
    recommendations: "Schedule follow-up for filling",
  },
  // Add more records as needed
];

interface MedicalRecordCardProps {
  record: MedicalRecord;
}

function MedicalRecordCard({ record }: MedicalRecordCardProps) {
  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <FileText className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{record.title}</h3>
            <p className="text-sm text-gray-500">{record.type}</p>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-500">
          <Download className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{record.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User className="h-4 w-4" />
          <span>{record.doctor}</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Findings</h4>
          <p className="text-sm text-gray-500 mt-1">{record.findings}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">Recommendations</h4>
          <p className="text-sm text-gray-500 mt-1">{record.recommendations}</p>
        </div>
      </div>

      <div className="mt-4">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          View Full Record
        </button>
      </div>
    </div>
  );
}

interface HealthMetric {
  title: string;
  value: string;
  lastChecked: string;
  icon: typeof Activity;
}

const healthMetrics: HealthMetric[] = [
  {
    title: "Blood Pressure",
    value: "120/80",
    lastChecked: "Jan 15, 2024",
    icon: Activity,
  },
  // Add more health metrics as needed
];

export default function MedicalRecordsPage() {
  const params = useParams();
  const { role } = useAuth();

  if (role !== "customer") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Medical Records
          </h2>
          <p className="text-sm text-gray-500">
            View your complete medical history
          </p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Records</option>
            <option value="general">General Checkup</option>
            <option value="dental">Dental</option>
            <option value="specialist">Specialist Visit</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download All
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {medicalRecords.map((record) => (
          <MedicalRecordCard key={record.id} record={record} />
        ))}
      </div>

      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Health Overview
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {healthMetrics.map((metric, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                <metric.icon className="h-4 w-4" />
                {metric.title}
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {metric.value}
              </p>
              <p className="text-sm text-gray-500">
                Last checked: {metric.lastChecked}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
