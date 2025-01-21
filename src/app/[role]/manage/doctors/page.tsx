"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Eye, Trash } from "lucide-react";
import Link from "next/link";

interface Doctor {
  id: string;
  name: string;
  email: string;
  qualification: string;
  specialization: string;
  experience: number;
  clinicAddresses: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    timings: {
      startTime: string;
      endTime: string;
      days: string[];
    };
  }[];
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Doctors Management</h1>
        <Link href="/manage/doctors/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Doctor
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Specialization</th>
                <th className="px-6 py-3">Experience</th>
                <th className="px-6 py-3">Clinics</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    Loading doctors...
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    No doctors found
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{doctor.name}</td>
                    <td className="px-6 py-4">{doctor.email}</td>
                    <td className="px-6 py-4">{doctor.specialization}</td>
                    <td className="px-6 py-4">{doctor.experience} years</td>
                    <td className="px-6 py-4">
                      {doctor.clinicAddresses.length} locations
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/[role]/manage/doctors/${doctor.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/[role]/manage/doctors/${doctor.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
