"use client";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { deleteUser } from "@/lib/firebase/delete-user";
import mutateData from "@/lib/firebase/mutate-data";
import useFetch from "@/lib/hooks/use-fetch";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

interface Paramedic {
  uid: string;
  name: string;
  email: string;
  password?: string;
  qualification: string;
  specialization: string;
  experience: number;
  role: string;
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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [paramedicToDelete, setParamedicToDelete] = useState<Paramedic | null>(
    null
  );
  const [paramedics, isLoading] = useFetch<Paramedic[]>("users", {
    filter: (item: unknown) => {
      const paramedic = item as Paramedic;
      return paramedic.role === "paramedic";
    },
  });

  const handleDelete = async (paramedic: Paramedic) => {
    if (!paramedic.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Cannot delete user without password. Please try again later.",
      });
      return;
    }

    setParamedicToDelete(paramedic);
  };

  const confirmDelete = async () => {
    if (!paramedicToDelete) return;

    setIsDeleting(paramedicToDelete.uid);
    try {
      // First delete the user authentication
      await deleteUser(paramedicToDelete.email, paramedicToDelete.password!);

      // Then remove the user data from the database
      await mutateData({
        path: `/users/${paramedicToDelete.uid}`,
        action: "delete",
      });

      toast({
        title: "Success",
        description: "Paramedic deleted successfully",
      });

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting paramedic:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete paramedic. Please try again.",
      });
    }
    setIsDeleting(null);
    setParamedicToDelete(null);
  };

  return (
    <>
      <AlertDialog
        open={!!paramedicToDelete}
        onOpenChange={() => setParamedicToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {paramedicToDelete?.name}
              </span>
              &apos;s account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Paramedics Management
          </h1>
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

        <div className="bg-card rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Specialization</th>
                  <th className="px-6 py-3">Experience</th>
                  <th className="px-6 py-3">Service Area</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-muted-foreground"
                    >
                      Loading paramedics...
                    </td>
                  </tr>
                ) : !paramedics ||
                  (Array.isArray(paramedics) && paramedics.length === 0) ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-muted-foreground"
                    >
                      No paramedics found
                    </td>
                  </tr>
                ) : (
                  paramedics?.map((paramedic) => (
                    <tr key={paramedic.uid} className="hover:bg-muted/50">
                      <td className="px-6 py-4 text-foreground">
                        {paramedic.name}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {paramedic.email}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {paramedic.specialization}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {paramedic.experience} years
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {paramedic.serviceArea.city}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/${role}/manage/paramedics/${paramedic.uid}`}
                          >
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link
                            href={`/${role}/manage/paramedics/${paramedic.uid}/edit`}
                          >
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            onClick={() => handleDelete(paramedic)}
                            disabled={isDeleting === paramedic.uid}
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
