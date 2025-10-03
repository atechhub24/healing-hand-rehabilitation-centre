import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { format } from "date-fns";
import { Staff, AttendanceRecord } from "@/types";

interface AttendanceTableProps {
  filteredData: {
    staff: Staff;
    attendance?: AttendanceRecord;
  }[];
  onEdit: (staff: Staff, date: string, attendance?: AttendanceRecord) => void;
}

export default function AttendanceTable({
  filteredData,
  onEdit,
}: AttendanceTableProps) {
  const getStatusBadge = (attendance: AttendanceRecord | undefined) => {
    if (!attendance) {
      return <Badge variant="destructive">Absent</Badge>;
    }

    switch (attendance.status) {
      case "present":
        return <Badge variant="default">Present</Badge>;
      case "late":
        return <Badge variant="secondary">Late</Badge>;
      case "partial":
        return <Badge variant="outline">Partial</Badge>;
      default:
        return <Badge variant="destructive">Absent</Badge>;
    }
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-6 py-3 text-left">Staff Member</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Punch In</th>
              <th className="px-6 py-3 text-left">Punch Out</th>
              <th className="px-6 py-3 text-left">Total Hours</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No attendance records found
                </td>
              </tr>
            ) : (
              filteredData.map(({ staff, attendance }) => (
                <tr key={staff.uid} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {staff.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {staff.title || "Staff"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(attendance)}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {attendance?.punchIn
                      ? format(new Date(attendance.punchIn), "HH:mm:ss")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {attendance?.punchOut
                      ? format(new Date(attendance.punchOut), "HH:mm:ss")
                      : attendance?.punchIn
                      ? "Still working"
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {attendance?.totalHours
                      ? `${attendance.totalHours}h`
                      : attendance?.punchIn && !attendance?.punchOut
                      ? "In progress"
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {attendance?.location || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() =>
                        onEdit(
                          staff,
                          (attendance?.date as string) ||
                            format(new Date(), "yyyy-MM-dd"),
                          attendance
                        )
                      }
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
