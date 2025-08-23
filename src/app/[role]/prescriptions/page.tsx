"use client";

import { useParams, useRouter } from "next/navigation";
import { User, Calendar, Clock, Plus, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface Patient {
  name: string;
  age: string;
  phone: string;
  address: string;
}

interface Prescription {
  id: number;
  patient: Patient;
  date: string;
  medications: Medication[];
  diagnosis: string;
  notes: string;
  doctorName: string;
  status: "active" | "completed" | "expired";
}

const prescriptions: Prescription[] = [
  {
    id: 1,
    patient: {
      name: "John Doe",
      age: "35",
      phone: "+1234567890",
      address: "123 Main St, City, State",
    },
    date: "2024-01-20",
    medications: [
      {
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "3 times daily",
        duration: "7 days",
        instructions: "Take with food",
      },
      {
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "As needed",
        duration: "5 days",
        instructions: "For pain relief",
      },
    ],
    diagnosis: "Upper Respiratory Infection",
    notes: "Complete the full course of antibiotics. Take with food.",
    doctorName: "Dr. Smith",
    status: "active",
  },
  {
    id: 2,
    patient: {
      name: "Jane Smith",
      age: "42",
      phone: "+0987654321",
      address: "456 Oak Ave, City, State",
    },
    date: "2024-01-19",
    medications: [
      {
        name: "Metformin",
        dosage: "1000mg",
        frequency: "2 times daily",
        duration: "30 days",
        instructions: "Take with meals",
      },
    ],
    diagnosis: "Type 2 Diabetes",
    notes: "Monitor blood sugar levels. Follow diabetic diet.",
    doctorName: "Dr. Smith",
    status: "active",
  },
];

interface PrescriptionCardProps {
  prescription: Prescription;
  onPrint: (prescription: Prescription) => void;
}

function PrescriptionCard({ prescription, onPrint }: PrescriptionCardProps) {
  const handlePrint = () => {
    onPrint(prescription);
  };

  const handleDownload = () => {
    // For now, just trigger print - you can implement PDF download later
    onPrint(prescription);
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
          <Badge
            variant={prescription.status === "active" ? "default" : "secondary"}
          >
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

        <div className="flex gap-2 pt-2">
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
        </div>
      </CardContent>
    </Card>
  );
}

export default function PrescriptionsPage() {
  const router = useRouter();

  const handlePrint = (prescription: Prescription) => {
    // Create a printable version of the prescription
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Medical Prescription - ${prescription.patient.name}</title>
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
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><text x="50" y="50" font-family="Arial" font-size="8" fill="%23e5e7eb" text-anchor="middle" transform="rotate(-45 50 50)">PRESCRIPTION</text></svg>') repeat;
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
              .prescription-number {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #2c5530;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 9pt;
                font-weight: bold;
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
              @media print {
                body { background: white; }
                .prescription-container {
                  border: none;
                  box-shadow: none;
                }
                .prescription-container::before {
                  opacity: 0.05;
                }
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
                <div class="prescription-number">RX-${prescription.id}</div>
              </div>

              <!-- Doctor Info -->
              <div class="doctor-info">
                <div class="doctor-name">Dr. ${prescription.doctorName}</div>
                <div style="font-size: 9pt; color: #666;">Licensed Medical Practitioner</div>
              </div>

              <!-- Date -->
              <div class="prescription-date">
                Date: ${new Date(prescription.date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </div>

              <!-- Patient Information -->
              <div class="patient-section">
                <div class="section-title">Patient Information</div>
                <div class="patient-info-grid">
                  <div><span class="info-label">Name:</span> ${prescription.patient.name}</div>
                  <div><span class="info-label">Age:</span> ${prescription.patient.age} years</div>
                  <div><span class="info-label">Phone:</span> ${prescription.patient.phone || "Not provided"}</div>
                  <div><span class="info-label">Address:</span> ${prescription.patient.address || "Not provided"}</div>
                </div>
                ${
                  prescription.diagnosis
                    ? `
                  <div class="diagnosis-box">
                    <span class="info-label">Diagnosis:</span> ${prescription.diagnosis}
                  </div>
                `
                    : ""
                }
              </div>

              <!-- Medications -->
              <div class="medications-section">
                <div class="section-title">💊 Prescribed Medications</div>
                ${prescription.medications
                  .map(
                    (med, index) => `
                  <div class="medication-item">
                    <div class="medication-number">${index + 1}</div>
                    <div class="medication-name">${med.name}</div>
                    <div class="medication-details">
                      <div><span class="info-label">Dosage:</span> ${med.dosage}</div>
                      <div><span class="info-label">Frequency:</span> ${med.frequency}</div>
                      <div><span class="info-label">Duration:</span> ${med.duration}</div>
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
                prescription.notes
                  ? `
                <div class="notes-section">
                  <div class="section-title">📋 Doctor's Instructions</div>
                  <div class="notes-content">${prescription.notes}</div>
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
                    <div>Registration: #${Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
                    <div>License Valid Until: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <!-- Disclaimer -->
              <div class="disclaimer-section">
                <div class="disclaimer-icon">⚠️</div>
                <strong>IMPORTANT:</strong> This prescription is valid only when signed by a registered medical practitioner.
                Please take medications exactly as prescribed. Consult your doctor if you experience any adverse effects.
                Keep this prescription for your records.
              </div>

              <!-- Footer Watermark -->
              <div class="footer-watermark">City Medical Center - Electronic Health Record System</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };
  const { role } = useParams();
  const handleNewPrescription = () => {
    router.push(`/${role}/prescriptions/new`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Prescriptions
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage patient prescriptions
          </p>
        </div>
        <Button onClick={handleNewPrescription}>
          <Plus className="h-4 w-4 mr-2" />
          New Prescription
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {prescriptions.map((prescription) => (
          <PrescriptionCard
            key={prescription.id}
            prescription={prescription}
            onPrint={handlePrint}
          />
        ))}
      </div>
    </div>
  );
}
