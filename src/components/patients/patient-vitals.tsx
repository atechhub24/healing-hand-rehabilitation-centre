"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for vital signs over time
const vitalData = [
  {
    date: "2023-01-01",
    bloodPressure: "120/80",
    systolic: 120,
    diastolic: 80,
    heartRate: 72,
    temperature: 98.6,
    respiratoryRate: 16,
    oxygenSaturation: 98,
  },
  {
    date: "2023-02-01",
    bloodPressure: "118/78",
    systolic: 118,
    diastolic: 78,
    heartRate: 70,
    temperature: 98.4,
    respiratoryRate: 15,
    oxygenSaturation: 99,
  },
  {
    date: "2023-03-01",
    bloodPressure: "122/82",
    systolic: 122,
    diastolic: 82,
    heartRate: 74,
    temperature: 98.7,
    respiratoryRate: 16,
    oxygenSaturation: 97,
  },
  {
    date: "2023-04-01",
    bloodPressure: "124/84",
    systolic: 124,
    diastolic: 84,
    heartRate: 76,
    temperature: 98.8,
    respiratoryRate: 17,
    oxygenSaturation: 98,
  },
  {
    date: "2023-05-01",
    bloodPressure: "121/81",
    systolic: 121,
    diastolic: 81,
    heartRate: 73,
    temperature: 98.6,
    respiratoryRate: 16,
    oxygenSaturation: 98,
  },
  {
    date: "2023-06-01",
    bloodPressure: "119/79",
    systolic: 119,
    diastolic: 79,
    heartRate: 71,
    temperature: 98.5,
    respiratoryRate: 15,
    oxygenSaturation: 99,
  },
];

/**
 * PatientVitals component displays vital signs with charts
 * Shows blood pressure, heart rate, temperature, respiratory rate, and oxygen saturation
 */
export function PatientVitals() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="charts">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          {/* Blood Pressure Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Blood Pressure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={vitalData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="systolic"
                      stroke="#8884d8"
                      name="Systolic"
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      stroke="#82ca9d"
                      name="Diastolic"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Heart Rate Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Heart Rate (BPM)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={vitalData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="heartRate"
                      stroke="#ff7300"
                      fill="#ff730080"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Temperature Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Temperature (°F)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={vitalData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[97, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ff0000"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Respiratory Rate & Oxygen Saturation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Respiratory Rate (breaths/min)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={vitalData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[12, 20]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="respiratoryRate"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Oxygen Saturation (%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={vitalData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[94, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="oxygenSaturation"
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Blood Pressure</th>
                      <th className="text-left py-3 px-4">Heart Rate</th>
                      <th className="text-left py-3 px-4">Temperature</th>
                      <th className="text-left py-3 px-4">Respiratory Rate</th>
                      <th className="text-left py-3 px-4">O₂ Saturation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vitalData.map((record, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? "bg-muted/50" : "bg-background"
                        }
                      >
                        <td className="py-2 px-4">{record.date}</td>
                        <td className="py-2 px-4">{record.bloodPressure}</td>
                        <td className="py-2 px-4">{record.heartRate} bpm</td>
                        <td className="py-2 px-4">{record.temperature}°F</td>
                        <td className="py-2 px-4">
                          {record.respiratoryRate} breaths/min
                        </td>
                        <td className="py-2 px-4">
                          {record.oxygenSaturation}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
