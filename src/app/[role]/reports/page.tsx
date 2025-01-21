"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { FileText, Download, Calendar, User, Clock } from "lucide-react";

const reports = [
  {
    id: 1,
    title: "Blood Test Results",
    patientName: "John Doe",
    date: "2024-01-20",
    time: "10:30 AM",
    type: "Laboratory",
    status: "completed",
    doctor: "Dr. Sarah Johnson",
  },
  {
    id: 2,
    title: "Emergency Response Report",
    patientName: "Jane Smith",
    date: "2024-01-21",
    time: "3:45 PM",
    type: "Emergency",
    status: "pending",
    doctor: "Dr. Michael Brown",
  },
  // Add more reports as needed
];

function ReportCard({ report }) {
  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <FileText className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{report.title}</h3>
            <p className="text-sm text-gray-500">{report.type} Report</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            report.status === "completed"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {report.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User className="h-4 w-4" />
          <span>Patient: {report.patientName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User className="h-4 w-4" />
          <span>Doctor: {report.doctor}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{report.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{report.time}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          View Report
        </button>
        <button className="px-4 py-2 text-blue-600 hover:text-blue-700 flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const params = useParams();
  const { role } = useAuth();

  if (!["lab", "paramedic"].includes(role)) {
    return null;
  }

  const isLab = role === "lab";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reports</h2>
          <p className="text-sm text-gray-500">
            {isLab
              ? "View and manage test reports"
              : "View and manage emergency reports"}
          </p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Reports</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            New Report
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
