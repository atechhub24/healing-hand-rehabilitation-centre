import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddPatientButtonProps {
  onClick: () => void;
}

/**
 * AddPatientButton component provides a button to add new patients
 * @param onClick - Callback function triggered when the button is clicked
 */
export function AddPatientButton({ onClick }: AddPatientButtonProps) {
  return (
    <Button onClick={onClick}>
      <PlusCircle className="h-4 w-4 mr-2" />
      Add Patient
    </Button>
  );
}
