"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PrescriptionCard,
  printPrescription,
  type Prescription,
} from "@/components/prescriptions";
import useFetch from "@/lib/hooks/use-fetch";
import { useAuth } from "@/lib/hooks/use-auth";
import { useMemo } from "react";
import mutate from "@/lib/firebase/mutate-data";

// PrescriptionCard is now imported from the prescriptions module

export default function PrescriptionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { role } = useParams();

  // Fetch prescriptions from Firebase database
  const fetchPath = useMemo(
    () => (user ? `prescriptions/${user.uid}` : ""),
    [user]
  );

  // Only fetch when user is available and path is valid
  const [prescriptions, isLoading, refetch] =
    useFetch<Prescription[]>(fetchPath);

  // Ensure prescriptions is always an array
  const safePrescriptions = Array.isArray(prescriptions) ? prescriptions : [];

  const handlePrint = (prescription: Prescription) => {
    printPrescription(prescription);
  };

  const handleDelete = async (prescription: Prescription) => {
    if (!user) return;

    try {
      const result = await mutate({
        path: `prescriptions/${user.uid}/${prescription.id}`,
        action: "delete",
      });

      if (result.success) {
        // Refresh the prescriptions list
        refetch();
      } else {
        throw new Error(result.error || "Failed to delete prescription");
      }
    } catch (error) {
      console.error("Error deleting prescription:", error);
      alert(
        `Failed to delete prescription: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleNewPrescription = () => {
    router.push(`/${role}/prescriptions/new`);
  };

  const handleEdit = (prescription: Prescription) => {
    router.push(`/${role}/prescriptions/${prescription.id}`);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Prescriptions
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage patient prescriptions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            Refresh
          </Button>
          <Button onClick={handleNewPrescription}>
            <Plus className="h-4 w-4 mr-2" />
            New Prescription
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading prescriptions...</p>
          </div>
        </div>
      ) : safePrescriptions.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {safePrescriptions
            .filter(
              (prescription) =>
                prescription &&
                typeof prescription === "object" &&
                prescription.id
            )
            .map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
                onPrint={handlePrint}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No prescriptions found</p>
          <Button onClick={handleRefresh} variant="outline">
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
}
