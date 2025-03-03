"use client";

import { useState, useEffect } from "react";
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
// import useFetch from "@/lib/hooks/use-fetch";

/**
 * Interface for blood pressure data points
 */
interface BPDataPoint {
  date: string;
  systolic: number;
  diastolic: number;
}

/**
 * Interface for other vital sign data points
 */
interface VitalDataPoint {
  date: string;
  value: number;
}

/**
 * PatientVitals component displays charts of patient vital signs over time
 * @param patientId - The ID of the patient
 */
export function PatientVitals({ patientId }: { patientId: string }) {
  const [timeRange, setTimeRange] = useState<"1m" | "3m" | "6m" | "1y">("3m");

  // In a real implementation, we would fetch vitals data from Firebase
  // Example: const [vitalsData, isLoading] = useFetch<any>(`/patients/${patientId}/vitals`);

  // Sample data for blood pressure
  const bpData: BPDataPoint[] = [
    { date: "Jan 1", systolic: 120, diastolic: 80 },
    { date: "Jan 15", systolic: 118, diastolic: 78 },
    { date: "Feb 1", systolic: 122, diastolic: 82 },
    { date: "Feb 15", systolic: 125, diastolic: 85 },
    { date: "Mar 1", systolic: 121, diastolic: 79 },
    { date: "Mar 15", systolic: 119, diastolic: 77 },
    { date: "Apr 1", systolic: 120, diastolic: 80 },
    { date: "Apr 15", systolic: 117, diastolic: 76 },
    { date: "May 1", systolic: 118, diastolic: 78 },
    { date: "May 15", systolic: 116, diastolic: 75 },
    { date: "Jun 1", systolic: 120, diastolic: 80 },
    { date: "Jun 15", systolic: 122, diastolic: 82 },
  ];

  // Sample data for blood glucose
  const glucoseData: VitalDataPoint[] = [
    { date: "Jan 1", value: 110 },
    { date: "Jan 15", value: 105 },
    { date: "Feb 1", value: 112 },
    { date: "Feb 15", value: 108 },
    { date: "Mar 1", value: 115 },
    { date: "Mar 15", value: 110 },
    { date: "Apr 1", value: 107 },
    { date: "Apr 15", value: 105 },
    { date: "May 1", value: 110 },
    { date: "May 15", value: 108 },
    { date: "Jun 1", value: 112 },
    { date: "Jun 15", value: 110 },
  ];

  // Sample data for weight
  const weightData: VitalDataPoint[] = [
    { date: "Jan 1", value: 180 },
    { date: "Feb 1", value: 178 },
    { date: "Mar 1", value: 176 },
    { date: "Apr 1", value: 175 },
    { date: "May 1", value: 173 },
    { date: "Jun 1", value: 172 },
  ];

  // Sample data for heart rate
  const heartRateData: VitalDataPoint[] = [
    { date: "Jan 1", value: 72 },
    { date: "Jan 15", value: 75 },
    { date: "Feb 1", value: 70 },
    { date: "Feb 15", value: 73 },
    { date: "Mar 1", value: 71 },
    { date: "Mar 15", value: 74 },
    { date: "Apr 1", value: 72 },
    { date: "Apr 15", value: 70 },
    { date: "May 1", value: 71 },
    { date: "May 15", value: 73 },
    { date: "Jun 1", value: 72 },
    { date: "Jun 15", value: 71 },
  ];

  // In a real application, we would fetch this data based on the patientId and timeRange
  useEffect(() => {
    // This function would be implemented to fetch real data
    // const fetchVitalsData = async () => {
    //   // Fetch data from Firebase based on patientId and timeRange
    //   // Example: const response = await fetch(`/patients/${patientId}/vitals?timeRange=${timeRange}`);
    // };
    // Uncomment to implement real data fetching
    // fetchVitalsData();
  }, [patientId, timeRange]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Vital Signs</CardTitle>
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
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="blood-pressure">
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
                  data={bpData}
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
          </TabsContent>

          <TabsContent value="blood-glucose" className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={glucoseData}
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
          </TabsContent>

          <TabsContent value="weight" className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weightData}
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
          </TabsContent>

          <TabsContent value="heart-rate" className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={heartRateData}
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
