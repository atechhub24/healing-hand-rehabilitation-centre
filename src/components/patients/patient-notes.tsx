import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";

interface PatientNotesProps {
  patientId: number;
}

// Sample data - in a real app, this would come from an API
const initialNotes = [
  {
    id: 1,
    date: "2023-06-15",
    author: "Dr. Sarah Johnson",
    content:
      "Patient reports feeling better after starting new medication. Blood pressure has improved. Will continue current treatment plan.",
    category: "Progress Note",
  },
  {
    id: 2,
    date: "2023-05-22",
    author: "Dr. Michael Chen",
    content:
      "Initial cardiology consultation. Patient has mild hypertension. Prescribed Lisinopril 10mg daily. Recommended lifestyle modifications including reduced sodium intake and regular exercise.",
    category: "Consultation Note",
  },
  {
    id: 3,
    date: "2023-04-15",
    author: "Dr. Sarah Johnson",
    content:
      "Annual physical examination. Overall health is good. Cholesterol levels are slightly elevated. Recommended dietary changes and follow-up in 3 months.",
    category: "Progress Note",
  },
];

/**
 * PatientNotes component displays and manages clinical notes for a patient
 * @param patientId - The ID of the patient to display notes for
 */
export function PatientNotes({ patientId }: PatientNotesProps) {
  // In a real app, we would fetch the patient's notes based on the ID
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");

  // This would be used in a real app to handle note actions
  const handleAddNote = () => {
    if (newNote.trim()) {
      const currentDate = new Date().toISOString().split("T")[0];
      const newNoteObj = {
        id: notes.length + 1,
        date: currentDate,
        author: "Dr. Sarah Johnson", // In a real app, this would be the logged-in user
        content: newNote,
        category: "Progress Note",
      };

      setNotes([newNoteObj, ...notes]);
      setNewNote("");
      setIsAddingNote(false);
    }
  };

  const handleEditNote = (id: number) => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit) {
      setEditingNoteId(id);
      setEditedContent(noteToEdit.content);
    }
  };

  const handleSaveEdit = (id: number) => {
    if (editedContent.trim()) {
      setNotes(
        notes.map((note) =>
          note.id === id ? { ...note, content: editedContent } : note
        )
      );
      setEditingNoteId(null);
      setEditedContent("");
    }
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Clinical Notes</h3>
        {!isAddingNote && (
          <Button size="sm" onClick={() => setIsAddingNote(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        )}
      </div>

      {isAddingNote && (
        <Card>
          <CardHeader>
            <CardTitle>New Clinical Note</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter your clinical note here..."
              className="min-h-[150px] mb-4"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote}>Save Note</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base">{note.category}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {note.date} by {note.author}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditNote(note.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingNoteId === note.id ? (
                <div className="space-y-4">
                  <Textarea
                    className="min-h-[100px]"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingNoteId(null)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => handleSaveEdit(note.id)}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{note.content}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
