"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFetch from "@/lib/hooks/use-fetch";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

interface Paramedic {
  id: string;
  name: string;
  email: string;
  role: string;
  qualification: string;
  specialization: string;
  experience: number;
  availability: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  serviceArea: {
    city: string;
    state: string;
    pincode: string;
  };
}

export default function ParamedicsPage() {
  const { role } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const [paramedics, isLoading] = useFetch<Paramedic[]>("users", {
    filter: (paramedic: Paramedic) => paramedic.role === "paramedic",
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Paramedics Management</h1>
        <Link href={`/${role}/manage/paramedics/new`}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Paramedic
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search paramedics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
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
                <th className="px-6 py-3">Service Area</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    Loading paramedics...
                  </td>
                </tr>
              ) : !paramedics ||
                (Array.isArray(paramedics) && paramedics.length === 0) ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    No paramedics found
                  </td>
                </tr>
              ) : (
                paramedics?.map((paramedic) => (
                  <tr key={paramedic.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{paramedic.name}</td>
                    <td className="px-6 py-4">{paramedic.email}</td>
                    <td className="px-6 py-4">{paramedic.specialization}</td>
                    <td className="px-6 py-4">{paramedic.experience} years</td>
                    <td className="px-6 py-4">{paramedic.serviceArea.city}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${role}/manage/paramedics/${paramedic.id}`}
                        >
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link
                          href={`/${role}/manage/paramedics/${paramedic.id}/edit`}
                        >
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
