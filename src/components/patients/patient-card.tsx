import { Calendar, FileText, Mail, Phone, User } from "lucide-react";
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

/**
 * PatientCard component displays individual patient information in a card format
 * @param patient - Patient object containing patient details
 */
export function PatientCard({ patient }: { patient: Patient }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{patient.name}</h3>
              <p className="text-sm text-gray-500">
                {patient.age} years • {patient.gender}
              </p>
            </div>
          </div>
          <Badge
            variant={patient.status === "Stable" ? "default" : "secondary"}
            className={cn(
              patient.status === "Stable"
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            )}
          >
            {patient.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Phone className="h-4 w-4" />
          <span>{patient.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Mail className="h-4 w-4" />
          <span>{patient.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Last Visit: {patient.lastVisit}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText className="h-4 w-4" />
          <span>Condition: {patient.condition}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        <Button className="flex-1">View Details</Button>
        <Button variant="outline">Update Record</Button>
      </CardFooter>
    </Card>
  );
}
