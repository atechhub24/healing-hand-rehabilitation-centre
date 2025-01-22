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

interface Laboratory {
  uid: string;
  name: string;
  email: string;
  password?: string;
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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [laboratoryToDelete, setLaboratoryToDelete] =
    useState<Laboratory | null>(null);

  const [laboratories, isLoading] = useFetch<Laboratory[]>("users", {
    filter: (laboratory: Laboratory) => laboratory.role === "laboratory",
  });

  const handleDelete = async (laboratory: Laboratory) => {
    if (!laboratory.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Cannot delete user without password. Please try again later.",
      });
      return;
    }

    setLaboratoryToDelete(laboratory);
  };

  const confirmDelete = async () => {
    if (!laboratoryToDelete) return;

    setIsDeleting(laboratoryToDelete.uid);
    try {
      // First delete the user authentication
      await deleteUser(laboratoryToDelete.email, laboratoryToDelete.password!);

      // Then remove the user data from the database
      await mutateData({
        path: `/users/${laboratoryToDelete.uid}`,
        action: "delete",
      });

      toast({
        title: "Success",
        description: "Laboratory deleted successfully",
      });

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting laboratory:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete laboratory. Please try again.",
      });
    }
    setIsDeleting(null);
    setLaboratoryToDelete(null);
  };

  return (
    <>
      <AlertDialog
        open={!!laboratoryToDelete}
        onOpenChange={() => setLaboratoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium">{laboratoryToDelete?.name}</span>'s
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
                    <tr key={laboratory.uid} className="hover:bg-gray-50">
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
                            href={`/${role}/manage/laboratories/${laboratory.uid}`}
                          >
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link
                            href={`/${role}/manage/laboratories/${laboratory.uid}/edit`}
                          >
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(laboratory)}
                            disabled={isDeleting === laboratory.uid}
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
