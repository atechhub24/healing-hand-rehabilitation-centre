"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { TestTube, Calendar, User, Download, AlertCircle } from "lucide-react";

interface TestResult {
  name: string;
  value: string;
  unit: string;
  range: string;
}

interface TestData {
  id: number;
  testName: string;
  date: string;
  doctor: string;
  lab: string;
  status: "completed" | "pending";
  results: TestResult[];
}

const testResults: TestData[] = [
  {
    id: 1,
    testName: "Complete Blood Count",
    date: "2024-01-18",
    doctor: "Dr. Sarah Johnson",
    lab: "Central Laboratory",
    status: "completed",
    results: [
      { name: "Hemoglobin", value: "14.2", unit: "g/dL", range: "13.5-17.5" },
      { name: "WBC", value: "7.5", unit: "K/µL", range: "4.5-11.0" },
      { name: "Platelets", value: "250", unit: "K/µL", range: "150-450" },
    ],
  },
  {
    id: 2,
    testName: "Lipid Panel",
    date: "2024-01-15",
    doctor: "Dr. Sarah Johnson",
    lab: "Central Laboratory",
    status: "pending",
    results: [],
  },
  // Add more test results as needed
];

interface TestResultCardProps {
  result: TestData;
}

function TestResultCard({ result }: TestResultCardProps) {
  const isPending = result.status === "pending";

  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <TestTube className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{result.testName}</h3>
            <p className="text-sm text-gray-500">{result.lab}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            isPending
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {result.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{result.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User className="h-4 w-4" />
          <span>Ordered by: {result.doctor}</span>
        </div>
      </div>

      {!isPending && result.results.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Results</h4>
          <div className="space-y-2">
            {result.results.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">Range: {item.range}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {item.value} {item.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {!isPending ? (
          <>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              View Full Report
            </button>
            <button className="px-4 py-2 text-blue-600 hover:text-blue-700 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </button>
          </>
        ) : (
          <button className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Awaiting Results
          </button>
        )}
      </div>
    </div>
  );
}

export default function TestResultsPage() {
  const params = useParams();
  const { role } = useAuth();

  if (role !== "customer") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Test Results</h2>
          <p className="text-sm text-gray-500">
            View your laboratory test results
          </p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Tests</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download All
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {testResults.map((result) => (
          <TestResultCard key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
}
