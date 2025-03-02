import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface PatientVitalsProps {
  patientId: number;
}

// Sample data - in a real app, this would come from an API
const vitalData = [
  {
    date: "2023-01-01",
    bloodPressure: "120/80",
    heartRate: 72,
    temperature: 98.6,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    weight: 165,
    height: 70,
    bmi: 23.7,
  },
  {
    date: "2023-02-15",
    bloodPressure: "118/78",
    heartRate: 70,
    temperature: 98.4,
    respiratoryRate: 15,
    oxygenSaturation: 99,
    weight: 163,
    height: 70,
    bmi: 23.4,
  },
  {
    date: "2023-04-10",
    bloodPressure: "122/82",
    heartRate: 74,
    temperature: 98.8,
    respiratoryRate: 16,
    oxygenSaturation: 97,
    weight: 164,
    height: 70,
    bmi: 23.5,
  },
  {
    date: "2023-06-05",
    bloodPressure: "124/84",
    heartRate: 76,
    temperature: 99.0,
    respiratoryRate: 17,
    oxygenSaturation: 96,
    weight: 166,
    height: 70,
    bmi: 23.8,
  },
  {
    date: "2023-08-01",
    bloodPressure: "120/80",
    heartRate: 72,
    temperature: 98.6,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    weight: 165,
    height: 70,
    bmi: 23.7,
  },
];

// Sample chart data for heart rate
const heartRateData = [
  { date: "Jan", value: 72 },
  { date: "Feb", value: 70 },
  { date: "Apr", value: 74 },
  { date: "Jun", value: 76 },
  { date: "Aug", value: 72 },
];

// Sample chart data for blood pressure
const bloodPressureData = [
  { date: "Jan", systolic: 120, diastolic: 80 },
  { date: "Feb", systolic: 118, diastolic: 78 },
  { date: "Apr", systolic: 122, diastolic: 82 },
  { date: "Jun", systolic: 124, diastolic: 84 },
  { date: "Aug", systolic: 120, diastolic: 80 },
];

/**
 * PatientVitals component displays vital signs and measurements for a patient
 * @param patientId - The ID of the patient to display vitals for
 */
export function PatientVitals({ patientId }: PatientVitalsProps) {
  // In a real app, we would fetch the patient's vitals based on the ID
  const latestVitals = vitalData[vitalData.length - 1];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Blood Pressure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestVitals.bloodPressure}
            </div>
            <p className="text-xs text-muted-foreground">mmHg</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestVitals.heartRate}</div>
            <p className="text-xs text-muted-foreground">bpm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestVitals.temperature}°F
            </div>
            <p className="text-xs text-muted-foreground">
              {(((latestVitals.temperature - 32) * 5) / 9).toFixed(1)}°C
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Oxygen Saturation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestVitals.oxygenSaturation}%
            </div>
            <p className="text-xs text-muted-foreground">SpO2</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Heart Rate Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={heartRateData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[60, 90]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  name="Heart Rate (bpm)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Blood Pressure Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={bloodPressureData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[40, 160]} />
                <Tooltip />
                <Legend />
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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vital Signs History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Date</th>
                  <th className="py-3 text-left font-medium">Blood Pressure</th>
                  <th className="py-3 text-left font-medium">Heart Rate</th>
                  <th className="py-3 text-left font-medium">Temperature</th>
                  <th className="py-3 text-left font-medium">
                    Respiratory Rate
                  </th>
                  <th className="py-3 text-left font-medium">O2 Saturation</th>
                  <th className="py-3 text-left font-medium">Weight</th>
                  <th className="py-3 text-left font-medium">BMI</th>
                </tr>
              </thead>
              <tbody>
                {vitalData.map((record, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">{record.date}</td>
                    <td className="py-3">{record.bloodPressure}</td>
                    <td className="py-3">{record.heartRate} bpm</td>
                    <td className="py-3">{record.temperature}°F</td>
                    <td className="py-3">{record.respiratoryRate} bpm</td>
                    <td className="py-3">{record.oxygenSaturation}%</td>
                    <td className="py-3">{record.weight} lbs</td>
                    <td className="py-3">{record.bmi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
