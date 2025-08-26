import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, Copy, Download, Pencil, Trash } from "lucide-react";
import { PrescriptionCardProps } from "./types";
import { printPrescription } from "./utils/printUtils";

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onPrint,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const handleDownload = () => {
    // For now, just trigger print - you can implement PDF download later
    printPrescription(prescription);
    onPrint(prescription);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg">
                  {prescription.patient.name}{" "}
                  {prescription.isDuplicate && (
                    <Badge variant="secondary" className="text-xs">
                      Duplicated
                    </Badge>
                  )}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{prescription.date}</span>
                <span>•</span>
                <span>Age: {prescription.patient.age}</span>
              </div>
            </div>
          </div>
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
          <h4 className="font-semibold text-sm mb-2">
            Medications ({prescription.medications.length})
          </h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="medications" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Click to view {prescription.medications.length} medications
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {prescription.notes && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="notes" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Click to view doctor&apos;s notes</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  {prescription.notes}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        {onEdit && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(prescription)}
          >
            <Pencil />
          </Button>
        )}

        <Button variant="outline" size="icon" onClick={handleDownload}>
          <Download />
        </Button>
        {onDelete && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(prescription)}
          >
            <Trash />
          </Button>
        )}
        {onDuplicate && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDuplicate(prescription)}
          >
            <Copy />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
