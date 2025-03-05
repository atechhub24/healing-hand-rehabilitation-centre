import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Patient } from "@/types/patient";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import mutate from "@/lib/firebase/mutate-data";
import { useRouter } from "next/navigation";

interface DeletePatientButtonProps {
  patient: Patient;
  onDeleted?: () => void;
}

/**
 * DeletePatientButton component provides a button to delete a patient with confirmation
 * @param patient - The patient object to be deleted
 * @param onDeleted - Optional callback function when the patient is deleted
 */
export function DeletePatientButton({
  patient,
  onDeleted,
}: DeletePatientButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  /**
   * Handles the patient deletion process
   */
  const handleDeletePatient = async () => {
    try {
      setIsDeleting(true);

      // Get the patient ID (either id or uid property)
      const patientId = patient.id || patient.uid;

      if (!patientId) {
        throw new Error("Patient ID not found");
      }

      // Delete the patient from the database
      const result = await mutate({
        path: `patients/${patientId}`,
        action: "delete",
        data: {},
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to delete patient");
      }

      // Show success toast
      toast({
        title: "Patient deleted",
        description: `${patient.name} has been successfully removed from the system.`,
      });

      // Call the onDeleted callback if provided
      if (onDeleted) {
        onDeleted();
      }

      // Refresh the page to update the patient list
      router.refresh();
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete patient",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          disabled={isDeleting}
          title="Delete patient"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>{patient.name}</strong> and all associated records from the
            system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeletePatient}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
