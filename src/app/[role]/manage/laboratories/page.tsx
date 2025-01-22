"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFetch from "@/lib/hooks/use-fetch";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

interface Laboratory {
  id: string;
  name: string;
  email: string;
  license: string;
  role: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  operatingHours: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  tests: {
    name: string;
    price: string;
    turnaroundTime: string;
  }[];
}

export default function LaboratoriesPage() {
  const { role } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const [laboratories, isLoading] = useFetch<Laboratory[]>("users", {
    filter: (laboratory: Laboratory) => laboratory.role === "laboratory",
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Laboratories Management</h1>
        <Link href={`/${role}/manage/laboratories/new`}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Laboratory
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search laboratories..."
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
                <th className="px-6 py-3">License</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Tests</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    Loading laboratories...
                  </td>
                </tr>
              ) : !laboratories ||
                (Array.isArray(laboratories) && laboratories.length === 0) ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    No laboratories found
                  </td>
                </tr>
              ) : (
                laboratories?.map((laboratory) => (
                  <tr key={laboratory.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{laboratory.name}</td>
                    <td className="px-6 py-4">{laboratory.email}</td>
                    <td className="px-6 py-4">{laboratory.license}</td>
                    <td className="px-6 py-4">{laboratory.address.city}</td>
                    <td className="px-6 py-4">
                      {laboratory.tests?.length || 0} tests
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${role}/manage/laboratories/${laboratory.id}`}
                        >
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link
                          href={`/${role}/manage/laboratories/${laboratory.id}/edit`}
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
