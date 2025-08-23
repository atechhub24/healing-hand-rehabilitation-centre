import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient, PatientInfoSectionProps } from "../types";

export const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({
  patient,
  onChange,
  diagnosis,
  onDiagnosisChange,
}) => {
  const updatePatient = (field: keyof Patient, value: string) => {
    onChange({
      ...patient,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patientName">Patient Name *</Label>
            <Input
              id="patientName"
              value={patient.name}
              onChange={(e) => updatePatient("name", e.target.value)}
              placeholder="Enter patient name"
              required
            />
          </div>
          <div>
            <Label htmlFor="patientAge">Age *</Label>
            <Input
              id="patientAge"
              type="number"
              value={patient.age}
              onChange={(e) => updatePatient("age", e.target.value)}
              placeholder="Enter age"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="patientPhone">Phone Number</Label>
          <Input
            id="patientPhone"
            value={patient.phone}
            onChange={(e) => updatePatient("phone", e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <Label htmlFor="patientAddress">Address</Label>
          <Textarea
            id="patientAddress"
            value={patient.address}
            onChange={(e) => updatePatient("address", e.target.value)}
            placeholder="Enter patient address"
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="diagnosis">Diagnosis *</Label>
          <Input
            id="diagnosis"
            value={diagnosis}
            onChange={(e) => onDiagnosisChange(e.target.value)}
            placeholder="Enter diagnosis"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};
