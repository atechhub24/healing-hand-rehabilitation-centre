"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFetch from "@/lib/hooks/use-fetch";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteUser } from "@/lib/firebase/delete-user";
import mutateData from "@/lib/firebase/mutate-data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Doctor {
  uid: string;
  name: string;
  email: string;
  password?: string;
  qualification: string;
  specialization: string;
  experience: number;
  role: string;
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
  const { role } = useParams();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  const [doctors, isLoading] = useFetch<Doctor[]>("users", {
    filter: (doctor: Doctor) => doctor.role === "doctor",
  });

  const handleDelete = async (doctor: Doctor) => {
    if (!doctor.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Cannot delete user without password. Please try again later.",
      });
      return;
    }

    setDoctorToDelete(doctor);
  };

  const confirmDelete = async () => {
    if (!doctorToDelete) return;

    setIsDeleting(doctorToDelete.uid);
    try {
      // First delete the user authentication
      await deleteUser(doctorToDelete.email, doctorToDelete.password!);

      // Then remove the user data from the database
      await mutateData({
        path: `/users/${doctorToDelete.uid}`,
        action: "delete",
      });

      toast({
        title: "Success",
        description: "Doctor deleted successfully",
      });

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete doctor. Please try again.",
      });
    }
    setIsDeleting(null);
    setDoctorToDelete(null);
  };

  return (
    <>
      <AlertDialog
        open={!!doctorToDelete}
        onOpenChange={() => setDoctorToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium">{doctorToDelete?.name}</span>'s
              account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Doctors Management</h1>
          <Link href={`/${role}/manage/doctors/new`}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add New Doctor
            </Button>
          </Link>
        </div>

        <div className="mb-4">
          <Input
            type="search"
            placeholder="Search doctors..."
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
                ) : !doctors ||
                  (Array.isArray(doctors) && doctors.length === 0) ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      No doctors found
                    </td>
                  </tr>
                ) : (
                  doctors?.map((doctor) => (
                    <tr key={doctor.uid} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{doctor.name}</td>
                      <td className="px-6 py-4">{doctor.email}</td>
                      <td className="px-6 py-4">{doctor.specialization}</td>
                      <td className="px-6 py-4">{doctor.experience} years</td>
                      <td className="px-6 py-4">
                        {doctor.clinicAddresses?.length || 0} locations
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/${role}/manage/doctors/${doctor.uid}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link
                            href={`/${role}/manage/doctors/${doctor.uid}/edit`}
                          >
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(doctor)}
                            disabled={isDeleting === doctor.uid}
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
    </>
  );
}
