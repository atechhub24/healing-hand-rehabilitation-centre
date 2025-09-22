import {
  Calendar,
  FileText,
  Mail,
  Phone,
  User,
  Eye,
  Pencil,
} from "lucide-react";
import { Patient } from "@/types/patient";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DeletePatientButton } from "./delete-patient-button";

interface PatientCardProps {
  patient: Patient;
  onDeleted?: () => void;
}

/**
 * PatientCard component displays individual patient information in a card format
 * @param patient - Patient object containing patient details
 * @param onDeleted - Optional callback function when the patient is deleted
 */
export function PatientCard({ patient, onDeleted }: PatientCardProps) {
  // role
  const { role } = useParams();

  // Format the last visit date or show "No visits yet"
  const lastVisitDisplay = patient.lastVisit
    ? new Date(patient.lastVisit).toLocaleDateString()
    : "No visits yet";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground leading-tight">
                {patient.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {patient.age} years • {patient.gender}
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              patient.status?.toLowerCase() === "discharged"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-emerald-100 text-emerald-800"
            )}
          >
            {patient.status ?? "active"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-4 pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{patient.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="truncate">{patient.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Last visit: {lastVisitDisplay}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>Condition: {patient.condition || "—"}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-2 pt-0">
        <Link
          href={`/${role}/patients/${patient.id || patient.uid}`}
          className="flex-1 min-w-[140px]"
        >
          <Button className="w-full rounded-full h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-sm">
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Button>
        </Link>
        <Link
          href={`/${role}/patients/${patient.id || patient.uid}/edit`}
          className="flex-1 min-w-[140px]"
        >
          <Button
            variant="outline"
            className="w-full rounded-full h-10 border-muted hover:bg-muted/60"
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit Patient
          </Button>
        </Link>
        <DeletePatientButton patient={patient} onDeleted={onDeleted} />
      </CardFooter>
    </Card>
  );
}
