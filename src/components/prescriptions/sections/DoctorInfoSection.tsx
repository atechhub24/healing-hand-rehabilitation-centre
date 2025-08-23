import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoctorInfoSectionProps } from "../types";

export const DoctorInfoSection: React.FC<DoctorInfoSectionProps> = ({
  doctorName,
  onChange,
  notes,
  onNotesChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor&apos;s Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="doctorName">Doctor Name *</Label>
          <Input
            id="doctorName"
            value={doctorName}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter doctor's name"
            required
          />
        </div>
        <div>
          <Label htmlFor="notes">Doctor&apos;s Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Additional instructions, warnings, or notes for the patient..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};
