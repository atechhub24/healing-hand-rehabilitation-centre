import { Card } from "@/components/ui/card";

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
}

export const recentActivities: Record<string, Activity[]> = {
  admin: [
    {
      id: "1",
      title: "New Doctor Registration",
      description: "Dr. Sarah Johnson completed registration",
      time: "2 hours ago",
    },
    {
      id: "2",
      title: "System Update",
      description: "Successfully deployed version 2.1.0",
      time: "5 hours ago",
    },
    {
      id: "3",
      title: "Revenue Report",
      description: "Monthly revenue report generated",
      time: "8 hours ago",
    },
  ],
  doctor: [
    {
      id: "1",
      title: "New Appointment",
      description: "Patient John Doe scheduled for 3:00 PM",
      time: "1 hour ago",
    },
    {
      id: "2",
      title: "Prescription Updated",
      description: "Updated medication for Patient ID #12345",
      time: "3 hours ago",
    },
    {
      id: "3",
      title: "Lab Results Received",
      description: "Blood test results for Sarah Smith",
      time: "5 hours ago",
    },
  ],
  paramedic: [
    {
      id: "1",
      title: "Emergency Response",
      description: "Responded to cardiac emergency at 123 Main St",
      time: "30 mins ago",
    },
    {
      id: "2",
      title: "Patient Transfer",
      description: "Completed transfer to Central Hospital",
      time: "2 hours ago",
    },
  ],
  lab: [
    {
      id: "1",
      title: "New Test Request",
      description: "Blood work analysis for Patient #789",
      time: "1 hour ago",
    },
    {
      id: "2",
      title: "Results Uploaded",
      description: "CT scan results uploaded to system",
      time: "3 hours ago",
    },
  ],
  patient: [
    {
      id: "1",
      title: "Appointment Confirmed",
      description: "Your appointment with Dr. Smith is confirmed",
      time: "1 hour ago",
    },
    {
      id: "2",
      title: "Test Results Available",
      description: "Your blood test results are ready",
      time: "4 hours ago",
    },
  ],
};

export default function RecentActivity({ role }: { role: string }) {
  const activities = recentActivities[role] || [];

  if (activities.length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <div className="relative">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <div className="absolute top-3 bottom-0 left-1.5 w-px bg-border" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium">{activity.title}</p>
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground/60">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
