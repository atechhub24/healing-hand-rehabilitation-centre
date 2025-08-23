"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Patient {
  name: string;
  age: string;
  phone: string;
  address: string;
}

interface PrescriptionForm {
  patient: Patient;
  diagnosis: string;
  medications: Medication[];
  notes: string;
  doctorName: string;
}

export default function NewPrescriptionPage() {
  const router = useRouter();

  const [form, setForm] = useState<PrescriptionForm>({
    patient: {
      name: "",
      age: "",
      phone: "",
      address: "",
    },
    diagnosis: "",
    medications: [
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
    notes: "",
    doctorName: "Dr. Smith", // This should come from user context
  });

  const [medicationKeys, setMedicationKeys] = useState([Date.now()]);

  const addMedication = () => {
    const newKey = Date.now();
    setForm({
      ...form,
      medications: [
        ...form.medications,
        {
          name: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
    });
    setMedicationKeys([...medicationKeys, newKey]);
  };

  const removeMedication = (index: number) => {
    if (form.medications.length > 1) {
      setForm({
        ...form,
        medications: form.medications.filter((_, i) => i !== index),
      });
      setMedicationKeys(medicationKeys.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    const updatedMedications = form.medications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    setForm({ ...form, medications: updatedMedications });
  };

  const updatePatient = (field: keyof Patient, value: string) => {
    setForm({
      ...form,
      patient: { ...form.patient, [field]: value },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would typically save to your database
    console.log("Prescription data:", form);

    // For now, just show success and redirect
    alert("Prescription created successfully!");
    router.push("/doctor/prescriptions");
  };

  const handlePreview = () => {
    // Create a preview window
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Prescription Preview - ${form.patient.name || "Patient"}</title>
            <style>
              @page {
                size: A4;
                margin: 1cm;
              }
              * {
                box-sizing: border-box;
              }
              body {
                font-family: 'Times New Roman', serif;
                font-size: 12pt;
                line-height: 1.4;
                color: #333;
                margin: 0;
                padding: 0;
                background: white;
              }
              .prescription-container {
                max-width: 210mm;
                margin: 0 auto;
                padding: 15mm;
                border: 2px solid #2c5530;
                border-radius: 8px;
                background: white;
                position: relative;
              }
              .prescription-container::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><text x="50" y="50" font-family="Arial" font-size="8" fill="%23e5e7eb" text-anchor="middle" transform="rotate(-45 50 50)">PREVIEW</text></svg>') repeat;
                opacity: 0.1;
                z-index: -1;
              }
              .header {
                text-align: center;
                border-bottom: 3px solid #2c5530;
                padding-bottom: 15px;
                margin-bottom: 20px;
                position: relative;
              }
              .clinic-info {
                font-size: 14pt;
                font-weight: bold;
                color: #2c5530;
                margin-bottom: 5px;
              }
              .clinic-address {
                font-size: 10pt;
                color: #666;
                margin-bottom: 5px;
              }
              .clinic-contact {
                font-size: 9pt;
                color: #888;
              }
              .prescription-title {
                font-size: 18pt;
                font-weight: bold;
                color: #2c5530;
                margin: 15px 0 10px 0;
                text-transform: uppercase;
                letter-spacing: 2px;
              }
              .preview-banner {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #ff6b35;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 9pt;
                font-weight: bold;
                transform: rotate(15deg);
                box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
              }
              .doctor-info {
                background: #f8f9fa;
                padding: 12px;
                border-radius: 6px;
                margin-bottom: 15px;
                border-left: 4px solid #2c5530;
              }
              .doctor-name {
                font-size: 12pt;
                font-weight: bold;
                color: #2c5530;
                margin-bottom: 5px;
              }
              .prescription-date {
                font-size: 10pt;
                color: #666;
                text-align: right;
                margin-bottom: 15px;
                padding-right: 10px;
              }
              .patient-section {
                background: #f0f8f0;
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 20px;
                border: 1px solid #d4edda;
              }
              .section-title {
                font-size: 11pt;
                font-weight: bold;
                color: #2c5530;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              .patient-info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                font-size: 10pt;
              }
              .info-label {
                font-weight: bold;
                color: #555;
                min-width: 80px;
              }
              .diagnosis-box {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 10px;
                border-radius: 4px;
                margin-top: 10px;
              }
              .medications-section {
                margin-bottom: 20px;
              }
              .medication-item {
                border: 2px solid #e9ecef;
                border-left: 4px solid #2c5530;
                padding: 12px;
                margin-bottom: 10px;
                background: white;
                border-radius: 4px;
                position: relative;
              }
              .medication-number {
                position: absolute;
                top: -8px;
                left: 10px;
                background: #2c5530;
                color: white;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 9pt;
                font-weight: bold;
              }
              .medication-name {
                font-size: 11pt;
                font-weight: bold;
                color: #2c5530;
                margin-bottom: 5px;
                margin-left: 30px;
              }
              .medication-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                font-size: 9pt;
                margin-left: 30px;
              }
              .medication-instructions {
                background: #f8f9fa;
                padding: 8px;
                border-radius: 3px;
                margin-top: 5px;
                font-style: italic;
                border-left: 3px solid #17a2b8;
              }
              .notes-section {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 12px;
                border-radius: 6px;
                margin-bottom: 20px;
              }
              .notes-content {
                font-size: 10pt;
                line-height: 1.5;
                color: #856404;
              }
              .preview-notice {
                background: #fff3cd;
                border: 2px solid #ff6b35;
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 20px;
                text-align: center;
              }
              .preview-notice strong {
                color: #ff6b35;
                font-size: 11pt;
              }
              .signature-section {
                border-top: 2px solid #2c5530;
                padding-top: 20px;
                margin-top: 30px;
              }
              .signature-line {
                width: 200px;
                border-bottom: 1px solid #333;
                margin-top: 30px;
                margin-bottom: 5px;
              }
              .signature-text {
                font-size: 9pt;
                color: #666;
              }
              .disclaimer-section {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                padding: 10px;
                border-radius: 4px;
                margin-top: 20px;
                font-size: 8pt;
                color: #6c757d;
                text-align: center;
              }
              .disclaimer-icon {
                color: #dc3545;
                font-weight: bold;
                margin-right: 5px;
              }
              .footer-watermark {
                position: fixed;
                bottom: 10mm;
                left: 50%;
                transform: translateX(-50%);
                font-size: 6pt;
                color: #ccc;
                text-transform: uppercase;
                letter-spacing: 2px;
              }
            </style>
          </head>
          <body>
            <div class="prescription-container">
              <!-- Header -->
              <div class="header">
                <div class="clinic-info">🏥 CITY MEDICAL CENTER</div>
                <div class="clinic-address">123 Healthcare Avenue, Medical District</div>
                <div class="clinic-contact">Phone: (555) 123-4567 | Email: info@citymedical.com</div>
                <div class="prescription-title">Medical Prescription</div>
                <div class="preview-banner">PREVIEW</div>
              </div>

              <!-- Preview Notice -->
              <div class="preview-notice">
                <strong>⚠️ PREVIEW MODE</strong><br>
                This is a preview of your prescription. The actual prescription will be generated after saving.
                Please review all information carefully before finalizing.
              </div>

              <!-- Doctor Info -->
              <div class="doctor-info">
                <div class="doctor-name">Dr. ${form.doctorName}</div>
                <div style="font-size: 9pt; color: #666;">Licensed Medical Practitioner</div>
              </div>

              <!-- Date -->
              <div class="prescription-date">
                Date: ${new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <!-- Patient Information -->
              <div class="patient-section">
                <div class="section-title">Patient Information</div>
                <div class="patient-info-grid">
                  <div><span class="info-label">Name:</span> ${form.patient.name || "Not specified"}</div>
                  <div><span class="info-label">Age:</span> ${form.patient.age || "Not specified"} years</div>
                  <div><span class="info-label">Phone:</span> ${form.patient.phone || "Not provided"}</div>
                  <div><span class="info-label">Address:</span> ${form.patient.address || "Not provided"}</div>
                </div>
                ${
                  form.diagnosis
                    ? `
                  <div class="diagnosis-box">
                    <span class="info-label">Diagnosis:</span> ${form.diagnosis}
                  </div>
                `
                    : ""
                }
              </div>

              <!-- Medications -->
              <div class="medications-section">
                <div class="section-title">💊 Prescribed Medications</div>
                ${form.medications
                  .map(
                    (med, index) => `
                  <div class="medication-item">
                    <div class="medication-number">${index + 1}</div>
                    <div class="medication-name">${med.name || "Medication name not specified"}</div>
                    <div class="medication-details">
                      <div><span class="info-label">Dosage:</span> ${med.dosage || "Not specified"}</div>
                      <div><span class="info-label">Frequency:</span> ${med.frequency || "Not specified"}</div>
                      <div><span class="info-label">Duration:</span> ${med.duration || "Not specified"}</div>
                    </div>
                    ${
                      med.instructions
                        ? `
                      <div class="medication-instructions">
                        <span class="info-label">Instructions:</span> ${med.instructions}
                      </div>
                    `
                        : ""
                    }
                  </div>
                `
                  )
                  .join("")}
              </div>

              <!-- Doctor's Notes -->
              ${
                form.notes
                  ? `
                <div class="notes-section">
                  <div class="section-title">📋 Doctor's Instructions</div>
                  <div class="notes-content">${form.notes}</div>
                </div>
              `
                  : ""
              }

              <!-- Signature Section -->
              <div class="signature-section">
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                  <div style="flex: 1;">
                    <div class="signature-line"></div>
                    <div class="signature-text">Doctor's Signature</div>
                  </div>
                  <div style="text-align: right; font-size: 9pt; color: #666;">
                    <div>Registration: #PREVIEW</div>
                    <div>License Valid Until: Preview Mode</div>
                  </div>
                </div>
              </div>

              <!-- Disclaimer -->
              <div class="disclaimer-section">
                <div class="disclaimer-icon">⚠️</div>
                <strong>PREVIEW MODE:</strong> This is a preview only. The actual prescription will include proper validation,
                registration numbers, and legal disclaimers when finalized.
              </div>

              <!-- Footer Watermark -->
              <div class="footer-watermark">City Medical Center - Electronic Health Record System - PREVIEW MODE</div>
            </div>
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Create New Prescription</h1>
          <p className="text-muted-foreground">
            Fill in the patient and medication details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Information */}
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
                  value={form.patient.name}
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
                  value={form.patient.age}
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
                value={form.patient.phone}
                onChange={(e) => updatePatient("phone", e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="patientAddress">Address</Label>
              <Textarea
                id="patientAddress"
                value={form.patient.address}
                onChange={(e) => updatePatient("address", e.target.value)}
                placeholder="Enter patient address"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Input
                id="diagnosis"
                value={form.diagnosis}
                onChange={(e) =>
                  setForm({ ...form, diagnosis: e.target.value })
                }
                placeholder="Enter diagnosis"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Medications */}
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
            {form.medications.map((medication, index) => (
              <div
                key={medicationKeys[index]}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Medication {index + 1}</h3>
                  {form.medications.length > 1 && (
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
                    <Label>Dosage *</Label>
                    <Input
                      value={medication.dosage}
                      onChange={(e) =>
                        updateMedication(index, "dosage", e.target.value)
                      }
                      placeholder="e.g., 500mg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Frequency *</Label>
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
                        <SelectItem value="Once daily">Once daily</SelectItem>
                        <SelectItem value="Twice daily">Twice daily</SelectItem>
                        <SelectItem value="Three times daily">
                          Three times daily
                        </SelectItem>
                        <SelectItem value="Four times daily">
                          Four times daily
                        </SelectItem>
                        <SelectItem value="As needed">As needed</SelectItem>
                        <SelectItem value="Every 4 hours">
                          Every 4 hours
                        </SelectItem>
                        <SelectItem value="Every 6 hours">
                          Every 6 hours
                        </SelectItem>
                        <SelectItem value="Every 8 hours">
                          Every 8 hours
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Duration *</Label>
                    <Input
                      value={medication.duration}
                      onChange={(e) =>
                        updateMedication(index, "duration", e.target.value)
                      }
                      placeholder="e.g., 7 days, 2 weeks"
                      required
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

        {/* Doctor's Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Doctor's Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Additional instructions, warnings, or notes for the patient..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={handlePreview}>
            Preview Prescription
          </Button>
          <Button type="submit" className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Create Prescription
          </Button>
        </div>
      </form>
    </div>
  );
}
