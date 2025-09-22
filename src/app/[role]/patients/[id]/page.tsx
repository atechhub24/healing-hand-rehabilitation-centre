"use client";

import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { PatientOverview } from "@/components/patients/patient-overview";
import { PatientVitals } from "@/components/patients/patient-vitals";
import { PatientDocuments } from "@/components/patients/patient-documents";
import useFetch from "@/lib/hooks/use-fetch";
import { Patient } from "@/types/patient";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import mutate from "@/lib/firebase/mutate-data";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * PatientDetailPage displays comprehensive information about a specific patient
 * It includes tabs for different aspects of the patient's medical record
 */
export default function PatientDetailPage() {
  const { id } = useParams();
  const patientId = Array.isArray(id) ? id[0] : id;

  // Fetch patient data from Firebase patients path
  const [patient, isLoading, refetch] = useFetch<Patient>(
    `/patients/${patientId}`,
    {
      needRaw: true,
    }
  );

  // Local UI state for admission controls
  const [admitDate, setAdmitDate] = useState<string>("");
  const [chargePerDay, setChargePerDay] = useState<string>("");
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [summary, setSummary] = useState<{
    admitDate?: string;
    dischargeDate?: string;
    totalDays?: number;
    totalBill?: number;
    chargePerDay?: number;
  } | null>(null);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Prefill local state from patient when available
  useEffect(() => {
    if (patient?.isAdmitted) {
      setAdmitDate(patient.admitDate ?? "");
      setChargePerDay(
        patient.admissionChargePerDay
          ? String(patient.admissionChargePerDay)
          : ""
      );
    }
  }, [patient?.isAdmitted, patient?.admitDate, patient?.admissionChargePerDay]);

  // Compute whether admit should be disabled based on requirement after discharge
  const isAdmitDisabled = useMemo(() => {
    // Disable if explicitly discharged once and not currently admitted
    if (patient?.dischargeDate && !patient?.isAdmitted) return true;
    return false;
  }, [patient?.dischargeDate, patient?.isAdmitted]);

  // Helper to compute day difference (inclusive)
  const calculateStayDays = (startIso: string, endIso: string) => {
    const start = new Date(startIso);
    const end = new Date(endIso);
    // Normalize times to midnight to avoid DST/timezone issues
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    // Inclusive of admit day
    return diffDays >= 0 ? diffDays + 1 : 0;
  };

  // Handle Admit action
  const handleAdmit = async () => {
    try {
      if (!patientId) return;
      if (!admitDate) {
        toast({
          title: "Admit date required",
          description: "Please select an admit date.",
        });
        return;
      }
      const parsedCharge = Number(chargePerDay);
      if (!parsedCharge || parsedCharge <= 0) {
        toast({
          title: "Invalid charge",
          description: "Enter a valid per-day charge (> 0).",
        });
        return;
      }

      const res = await mutate({
        path: `/patients/${patientId}`,
        action: "update",
        data: {
          isAdmitted: true,
          admitDate,
          dischargeDate: null,
          admissionChargePerDay: parsedCharge,
          status: "admitted",
          updatedAt: new Date().toISOString(),
        },
      });

      if (res.success) {
        toast({
          title: "Patient admitted",
          description: "Admission details saved successfully.",
        });
        setAdmitDate("");
        setChargePerDay("");
        await refetch();
      } else {
        toast({
          title: "Failed to admit",
          description: res.error ?? "Unknown error",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  // Handle Discharge action
  const handleDischarge = async () => {
    try {
      if (!patientId || !patient?.admitDate || !patient?.admissionChargePerDay)
        return;
      const dischargeDate = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
      const totalDays = calculateStayDays(patient.admitDate, dischargeDate);
      const totalBill = totalDays * Number(patient.admissionChargePerDay);

      const res = await mutate({
        path: `/patients/${patientId}`,
        action: "update",
        data: {
          isAdmitted: false,
          dischargeDate,
          status: "discharged",
          updatedAt: new Date().toISOString(),
        },
      });

      if (res.success) {
        setSummary({
          admitDate: patient.admitDate,
          dischargeDate,
          totalDays,
          totalBill,
          chargePerDay: Number(patient.admissionChargePerDay),
        });
        setIsSummaryOpen(true);
        toast({
          title: "Patient discharged",
          description: "Discharge details saved.",
        });
        await refetch();
      } else {
        toast({
          title: "Failed to discharge",
          description: res.error ?? "Unknown error",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  // Handle updating admission (while admitted)
  const handleUpdateAdmission = async () => {
    try {
      if (!patientId) return;
      if (!patient?.isAdmitted) return;
      if (!admitDate) {
        toast({
          title: "Admit date required",
          description: "Please select an admit date.",
        });
        return;
      }
      const parsedCharge = Number(chargePerDay);
      if (!parsedCharge || parsedCharge <= 0) {
        toast({
          title: "Invalid charge",
          description: "Enter a valid per-day charge (> 0).",
        });
        return;
      }

      const res = await mutate({
        path: `/patients/${patientId}`,
        action: "update",
        data: {
          admitDate,
          admissionChargePerDay: parsedCharge,
          updatedAt: new Date().toISOString(),
        },
      });

      if (res.success) {
        toast({ title: "Admission updated", description: "Changes saved." });
        setIsEditing(false);
        await refetch();
      } else {
        toast({
          title: "Failed to update",
          description: res.error ?? "Unknown error",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Patient Not Found</h2>
          <p className="text-muted-foreground">
            The patient you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Admission Controls */}
      <Card>
        <CardContent className="p-6">
          {/* Header with edit toggle while admitted */}
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold">Admission</div>
            {patient?.isAdmitted ? (
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleUpdateAdmission}>
                      Save
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="admitDate">Admit Date</Label>
              <Input
                id="admitDate"
                type="date"
                value={admitDate}
                onChange={(e) => setAdmitDate(e.target.value)}
                disabled={patient?.isAdmitted ? !isEditing : false}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chargePerDay">Admission Charge (per day)</Label>
              <Input
                id="chargePerDay"
                type="number"
                min={0}
                step={1}
                placeholder={
                  patient?.admissionChargePerDay
                    ? String(patient.admissionChargePerDay)
                    : "e.g. 500"
                }
                value={chargePerDay}
                onChange={(e) => setChargePerDay(e.target.value)}
                disabled={patient?.isAdmitted ? !isEditing : false}
              />
            </div>
            <div className="flex items-end gap-3">
              {!patient?.isAdmitted ? (
                <Button onClick={handleAdmit} disabled={isAdmitDisabled}>
                  Admit
                </Button>
              ) : (
                <Button variant="secondary" onClick={handleDischarge}>
                  Discharge
                </Button>
              )}
            </div>
          </div>

          {/* Current state hint */}
          <div className="mt-3 text-sm text-muted-foreground">
            {patient?.isAdmitted ? (
              <span>
                Currently admitted since {patient.admitDate}. Per-day charge:{" "}
                {patient.admissionChargePerDay}
              </span>
            ) : patient?.dischargeDate ? (
              <span>
                Discharged on {patient.dischargeDate}. Admit is disabled per
                requirement.
              </span>
            ) : (
              <span>Patient not currently admitted.</span>
            )}
          </div>

          {/* After discharge: persistent summary line with View Bill button */}
          {!patient?.isAdmitted && patient?.dischargeDate ? (
            <div className="mt-4 flex items-center justify-between rounded-md border p-3">
              <div className="text-sm">
                Last admission: {patient.admitDate} → {patient.dischargeDate}.
                Per-day: {patient.admissionChargePerDay}
              </div>
              <Button
                size="sm"
                onClick={() => {
                  if (
                    !patient?.admitDate ||
                    !patient?.dischargeDate ||
                    !patient?.admissionChargePerDay
                  )
                    return;
                  const totalDays = calculateStayDays(
                    patient.admitDate,
                    patient.dischargeDate
                  );
                  const totalBill =
                    totalDays * Number(patient.admissionChargePerDay);
                  setSummary({
                    admitDate: patient.admitDate,
                    dischargeDate: patient.dischargeDate,
                    totalDays,
                    totalBill,
                    chargePerDay: Number(patient.admissionChargePerDay),
                  });
                  setIsSummaryOpen(true);
                }}
              >
                View Bill
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {!isLoading && (
        <PatientOverview patient={{ ...patient, id: patientId }} />
      )}
      <Tabs defaultValue="medical-history" className="w-full">
        <TabsList className="grid grid-cols-7 h-auto">
          <TabsTrigger value="medical-history">Medical History</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="medical-history" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground py-8">
                Medical history will be implemented soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground py-8">
                Prescriptions will be implemented soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground py-8">
                Appointments will be implemented soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab-results" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground py-8">
                Lab results will be implemented soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals" className="mt-6">
          <PatientVitals patientId={patientId!} />
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground py-8">
                Notes will be implemented soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <PatientDocuments patientId={patientId!} />
        </TabsContent>
      </Tabs>

      {/* Discharge Summary Dialog */}
      <Dialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discharge Summary</DialogTitle>
            <DialogDescription>
              Review the admission and discharge details along with total bill.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Admit Date</span>
              <span>{summary?.admitDate ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Discharge Date</span>
              <span>{summary?.dischargeDate ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Per-day Charge</span>
              <span>{summary?.chargePerDay?.toFixed(2) ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Days</span>
              <span>{summary?.totalDays ?? "-"}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Bill</span>
              <span>
                {summary?.totalBill !== undefined
                  ? summary.totalBill.toFixed(2)
                  : "-"}
              </span>
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <Button onClick={() => setIsSummaryOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
