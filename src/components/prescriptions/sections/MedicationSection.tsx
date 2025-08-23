import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Medication, MedicationSectionProps } from "../types";

const FREQUENCY_OPTIONS = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Four times daily",
  "As needed",
  "Every 4 hours",
  "Every 6 hours",
  "Every 8 hours",
];

export const MedicationSection: React.FC<MedicationSectionProps> = ({
  medications,
  onChange,
}) => {
  const addMedication = () => {
    onChange([
      ...medications,
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      onChange(medications.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    const updatedMedications = medications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    onChange(updatedMedications);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medications</CardTitle>
        <Button
          type="button"
          onClick={addMedication}
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {medications.map((medication, index) => (
          <div
            key={`medication-${index}`}
            className="border rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Medication {index + 1}</h3>
              {medications.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeMedication(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Medication Name *</Label>
                <Input
                  value={medication.name}
                  onChange={(e) =>
                    updateMedication(index, "name", e.target.value)
                  }
                  placeholder="e.g., Amoxicillin"
                  required
                />
              </div>
              <div>
                <Label>Dosage</Label>
                <Input
                  value={medication.dosage}
                  onChange={(e) =>
                    updateMedication(index, "dosage", e.target.value)
                  }
                  placeholder="e.g., 500mg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Frequency</Label>
                <Select
                  value={medication.frequency}
                  onValueChange={(value) =>
                    updateMedication(index, "frequency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duration</Label>
                <Input
                  value={medication.duration}
                  onChange={(e) =>
                    updateMedication(index, "duration", e.target.value)
                  }
                  placeholder="e.g., 7 days, 2 weeks"
                />
              </div>
            </div>

            <div>
              <Label>Instructions</Label>
              <Textarea
                value={medication.instructions}
                onChange={(e) =>
                  updateMedication(index, "instructions", e.target.value)
                }
                placeholder="e.g., Take with food, After meals"
                rows={2}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
