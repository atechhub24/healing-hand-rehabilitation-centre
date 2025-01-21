"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { TestTube, Calendar, User, Clock, FileText } from "lucide-react";

const testOrders = [
  {
    id: 1,
    patientName: "John Doe",
    testType: "Blood Test",
    orderedBy: "Dr. Sarah Johnson",
    date: "2024-01-22",
    time: "10:00 AM",
    priority: "urgent",
    status: "pending",
    notes: "Fasting required for 12 hours",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    testType: "X-Ray",
    orderedBy: "Dr. Michael Brown",
    date: "2024-01-22",
    time: "11:30 AM",
    priority: "normal",
    status: "in-progress",
    notes: "Chest X-Ray",
  },
  // Add more test orders as needed
];

function TestOrderCard({ order }) {
  const isPending = order.status === "pending";
  const isUrgent = order.priority === "urgent";

  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <TestTube className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{order.testType}</h3>
            <p className="text-sm text-gray-500">{order.patientName}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              order.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {order.status}
          </span>
          {isUrgent && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
              Urgent
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User className="h-4 w-4" />
          <span>Ordered by: {order.orderedBy}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{order.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{order.time}</span>
        </div>
        {order.notes && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="h-4 w-4" />
            <span>{order.notes}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {isPending ? (
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Start Test
          </button>
        ) : (
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            View Results
          </button>
        )}
        <button className="px-4 py-2 text-blue-600 hover:text-blue-700">
          Update Status
        </button>
      </div>
    </div>
  );
}

export default function TestOrdersPage() {
  const params = useParams();
  const { role } = useAuth();

  if (role !== "lab") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Test Orders</h2>
          <p className="text-sm text-gray-500">
            Manage and process test orders
          </p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Test Order
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testOrders.map((order) => (
          <TestOrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
