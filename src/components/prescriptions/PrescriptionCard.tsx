import {
  User,
  Calendar,
  Clock,
  Printer,
  Download,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  printPrescription,
  printCosmeticPrescription,
  previewPrescription,
  previewCosmeticPrescription,
} from "./utils/printUtils";
import { Prescription, PrescriptionCardProps } from "./types";

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onPrint,
  onEdit,
  onDelete,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<
    "medical" | "cosmetic"
  >("medical");

  const handlePrint = () => {
    if (selectedTemplate === "cosmetic") {
      printCosmeticPrescription(prescription);
    } else {
      printPrescription(prescription);
    }
    onPrint(prescription);
  };

  const handlePreview = () => {
    if (selectedTemplate === "cosmetic") {
      previewCosmeticPrescription(prescription);
    } else {
      previewPrescription(prescription);
    }
  };

  const handleDownload = () => {
    // For now, just trigger print - you can implement PDF download later
    handlePrint();
  };

  const getStatusColor = (status: Prescription["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "expired":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {prescription.patient.name}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{prescription.date}</span>
                <span>•</span>
                <span>Age: {prescription.patient.age}</span>
              </div>
            </div>
          </div>
          <Badge variant={getStatusColor(prescription.status)}>
            {prescription.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Diagnosis</h4>
          <p className="text-sm text-muted-foreground">
            {prescription.diagnosis}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Medications</h4>
          <div className="space-y-2">
            {prescription.medications.map((med, index) => (
              <div
                key={`${prescription.id}-med-${index}`}
                className="bg-muted p-3 rounded-lg"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium">{med.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {med.dosage}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {med.frequency}
                  </div>
                  <div>Duration: {med.duration}</div>
                  {med.instructions && (
                    <div>Instructions: {med.instructions}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {prescription.notes && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Doctor&apos;s Notes</h4>
            <p className="text-sm text-muted-foreground">
              {prescription.notes}
            </p>
          </div>
        )}

        {/* Template Selector */}
        <div className="flex items-center gap-2 pt-2 pb-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <Select
            value={selectedTemplate}
            onValueChange={(value: "medical" | "cosmetic") =>
              setSelectedTemplate(value)
            }
          >
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="cosmetic">Cosmetic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(prescription)}
              className="flex-1"
            >
              Edit
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="flex-1"
          >
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex-1"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(prescription)}
              className="flex-1"
            >
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
