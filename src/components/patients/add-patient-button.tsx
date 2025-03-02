import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

/**
 * AddPatientButton component provides a button to add new patients
 * Links to the add patient page
 */
export function AddPatientButton() {
  const { role } = useParams();

  return (
    <Link href={`/${role}/patients/add`}>
      <Button>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Patient
      </Button>
    </Link>
  );
}
