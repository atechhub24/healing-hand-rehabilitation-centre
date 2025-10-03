import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AttendanceRecord } from "@/types";

interface EditAttendanceDialogProps {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editForm: {
    punchIn: string;
    punchOut: string;
    status: AttendanceRecord["status"];
    location: string;
    notes: string;
  };
  setEditForm: React.Dispatch<
    React.SetStateAction<{
      punchIn: string;
      punchOut: string;
      status: AttendanceRecord["status"];
      location: string;
      notes: string;
    }>
  >;
  onSave: () => void;
}

export default function EditAttendanceDialog({
  isEditing,
  setIsEditing,
  editForm,
  setEditForm,
  onSave,
}: EditAttendanceDialogProps) {
  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Attendance</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="punchIn">Punch In</Label>
            <Input
              id="punchIn"
              type="datetime-local"
              value={editForm.punchIn}
              onChange={(e) =>
                setEditForm({ ...editForm, punchIn: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="punchOut">Punch Out</Label>
            <Input
              id="punchOut"
              type="datetime-local"
              value={editForm.punchOut}
              onChange={(e) =>
                setEditForm({ ...editForm, punchOut: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={editForm.status}
              onValueChange={(v) =>
                setEditForm({
                  ...editForm,
                  status: v as AttendanceRecord["status"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={editForm.location}
              onChange={(e) =>
                setEditForm({ ...editForm, location: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={editForm.notes}
              onChange={(e) =>
                setEditForm({ ...editForm, notes: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
