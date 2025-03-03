"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { AddVitalForm } from "./add-vital-form";
import useFetch from "@/lib/hooks/use-fetch";

/**
 * Interface for blood pressure data points
 */
interface BPDataPoint {
  date: string;
  systolic: number;
  diastolic: number;
  id?: string;
  notes?: string;
}

/**
 * Interface for other vital sign data points
 */
interface VitalDataPoint {
  date: string;
  value: number;
  id?: string;
  notes?: string;
}

/**
 * PatientVitals component displays charts of patient vital signs over time
 * @param patientId - The ID of the patient
 */
export function PatientVitals({ patientId }: { patientId: string }) {
  const [timeRange, setTimeRange] = useState<"1m" | "3m" | "6m" | "1y">("3m");
  const [addVitalOpen, setAddVitalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("blood-pressure");

  // Fetch vitals data from Firebase
  const [bpData, bpLoading, bpRefetch] = useFetch<Record<string, BPDataPoint>>(
    `/patients/${patientId}/vitals/blood-pressure`,
    { needRaw: true }
  );

  const [glucoseData, glucoseLoading, glucoseRefetch] = useFetch<
    Record<string, VitalDataPoint>
  >(`/patients/${patientId}/vitals/blood-glucose`, { needRaw: true });

  const [weightData, weightLoading, weightRefetch] = useFetch<
    Record<string, VitalDataPoint>
  >(`/patients/${patientId}/vitals/weight`, { needRaw: true });

  const [heartRateData, heartRateLoading, heartRateRefetch] = useFetch<
    Record<string, VitalDataPoint>
  >(`/patients/${patientId}/vitals/heart-rate`, { needRaw: true });

  // Process the data for charts
  const processedBPData = bpData
    ? Object.entries(bpData)
        .map(([id, data]) => ({
          ...data,
          id,
          originalDate: data.date, // Keep original date for sorting
          date: new Date(data.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        }))
        .sort((a, b) => {
          // Sort by date, newest first
          const dateA = new Date(a.originalDate).getTime();
          const dateB = new Date(b.originalDate).getTime();
          return dateB - dateA;
        })
        .slice(0, 10) // Show only the 10 most recent readings
    : [];

  const processedGlucoseData = glucoseData
    ? Object.entries(glucoseData)
        .map(([id, data]) => ({
          ...data,
          id,
          originalDate: data.date, // Keep original date for sorting
          date: new Date(data.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        }))
        .sort((a, b) => {
          // Sort by date, newest first
          const dateA = new Date(a.originalDate).getTime();
          const dateB = new Date(b.originalDate).getTime();
          return dateB - dateA;
        })
        .slice(0, 10) // Show only the 10 most recent readings
    : [];

  const processedWeightData = weightData
    ? Object.entries(weightData)
        .map(([id, data]) => ({
          ...data,
          id,
          originalDate: data.date, // Keep original date for sorting
          date: new Date(data.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        }))
        .sort((a, b) => {
          // Sort by date, newest first
          const dateA = new Date(a.originalDate).getTime();
          const dateB = new Date(b.originalDate).getTime();
          return dateB - dateA;
        })
        .slice(0, 10) // Show only the 10 most recent readings
    : [];

  const processedHeartRateData = heartRateData
    ? Object.entries(heartRateData)
        .map(([id, data]) => ({
          ...data,
          id,
          originalDate: data.date, // Keep original date for sorting
          date: new Date(data.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        }))
        .sort((a, b) => {
          // Sort by date, newest first
          const dateA = new Date(a.originalDate).getTime();
          const dateB = new Date(b.originalDate).getTime();
          return dateB - dateA;
        })
        .slice(0, 10) // Show only the 10 most recent readings
    : [];

  // Fallback to sample data if no data is available
  const fallbackBPData: BPDataPoint[] = [
    { date: "Jan 1", systolic: 120, diastolic: 80 },
    { date: "Feb 1", systolic: 122, diastolic: 82 },
    { date: "Mar 1", systolic: 121, diastolic: 79 },
    { date: "Apr 1", systolic: 120, diastolic: 80 },
    { date: "May 1", systolic: 118, diastolic: 78 },
    { date: "Jun 1", systolic: 120, diastolic: 80 },
  ];

  const fallbackGlucoseData: VitalDataPoint[] = [
    { date: "Jan 1", value: 110 },
    { date: "Feb 1", value: 112 },
    { date: "Mar 1", value: 115 },
    { date: "Apr 1", value: 107 },
    { date: "May 1", value: 110 },
    { date: "Jun 1", value: 112 },
  ];

  const fallbackWeightData: VitalDataPoint[] = [
    { date: "Jan 1", value: 180 },
    { date: "Feb 1", value: 178 },
    { date: "Mar 1", value: 176 },
    { date: "Apr 1", value: 175 },
    { date: "May 1", value: 173 },
    { date: "Jun 1", value: 172 },
  ];

  const fallbackHeartRateData: VitalDataPoint[] = [
    { date: "Jan 1", value: 72 },
    { date: "Feb 1", value: 70 },
    { date: "Mar 1", value: 71 },
    { date: "Apr 1", value: 72 },
    { date: "May 1", value: 71 },
    { date: "Jun 1", value: 72 },
  ];

  // Handle successful form submission
  const handleVitalAdded = () => {
    setAddVitalOpen(false);
    // Refetch the data for the active tab
    if (activeTab === "blood-pressure") bpRefetch();
    if (activeTab === "blood-glucose") glucoseRefetch();
    if (activeTab === "weight") weightRefetch();
    if (activeTab === "heart-rate") heartRateRefetch();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Vital Signs</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex space-x-2">
              <Button
                variant={timeRange === "1m" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("1m")}
              >
                1M
              </Button>
              <Button
                variant={timeRange === "3m" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("3m")}
              >
                3M
              </Button>
              <Button
                variant={timeRange === "6m" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("6m")}
              >
                6M
              </Button>
              <Button
                variant={timeRange === "1y" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("1y")}
              >
                1Y
              </Button>
            </div>

            <Dialog open={addVitalOpen} onOpenChange={setAddVitalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Vital
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Vital Sign</DialogTitle>
                </DialogHeader>
                <AddVitalForm
                  patientId={patientId}
                  onSuccess={handleVitalAdded}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="blood-pressure"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
            <TabsTrigger value="blood-glucose">Blood Glucose</TabsTrigger>
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
          </TabsList>

          <TabsContent value="blood-pressure" className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    processedBPData.length > 0
                      ? processedBPData
                      : fallbackBPData
                  }
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="diastolic" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {bpLoading && (
              <div className="text-center py-4 text-muted-foreground">
                Loading blood pressure data...
              </div>
            )}
            {!bpLoading && processedBPData.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No blood pressure data available. Add new measurements using the
                "Add Vital" button.
              </div>
            )}
          </TabsContent>

          <TabsContent value="blood-glucose" className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    processedGlucoseData.length > 0
                      ? processedGlucoseData
                      : fallbackGlucoseData
                  }
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Glucose (mg/dL)"
                    stroke="#ff7300"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {glucoseLoading && (
              <div className="text-center py-4 text-muted-foreground">
                Loading blood glucose data...
              </div>
            )}
            {!glucoseLoading && processedGlucoseData.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No blood glucose data available. Add new measurements using the
                "Add Vital" button.
              </div>
            )}
          </TabsContent>

          <TabsContent value="weight" className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    processedWeightData.length > 0
                      ? processedWeightData
                      : fallbackWeightData
                  }
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Weight (lbs)"
                    stroke="#2196f3"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {weightLoading && (
              <div className="text-center py-4 text-muted-foreground">
                Loading weight data...
              </div>
            )}
            {!weightLoading && processedWeightData.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No weight data available. Add new measurements using the "Add
                Vital" button.
              </div>
            )}
          </TabsContent>

          <TabsContent value="heart-rate" className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    processedHeartRateData.length > 0
                      ? processedHeartRateData
                      : fallbackHeartRateData
                  }
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Heart Rate (bpm)"
                    stroke="#e91e63"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {heartRateLoading && (
              <div className="text-center py-4 text-muted-foreground">
                Loading heart rate data...
              </div>
            )}
            {!heartRateLoading && processedHeartRateData.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No heart rate data available. Add new measurements using the
                "Add Vital" button.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
