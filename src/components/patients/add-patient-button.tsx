import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

/**
 * AddPatientButton component provides a button to navigate to the add patient form
 */
export function AddPatientButton() {
  const { role } = useParams();

  return (
    <Link href={`/${role}/patients/new`}>
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Add Patient
      </Button>
    </Link>
  );
}
