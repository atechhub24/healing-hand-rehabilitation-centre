"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Plus, Search, FileText } from "lucide-react";

// Sample clinical notes data
const clinicalNotes = [
  {
    id: 1,
    date: "2023-07-15",
    time: "10:45 AM",
    provider: "Dr. Sarah Johnson",
    department: "Internal Medicine",
    type: "Progress Note",
    content:
      "Patient presents for annual physical examination. Reports feeling well overall with no significant complaints. Blood pressure is well-controlled on current medication regimen. Discussed importance of regular exercise and maintaining a healthy diet. Ordered routine blood work including lipid panel and comprehensive metabolic panel.",
    tags: ["Annual Exam", "Preventive Care"],
  },
  {
    id: 2,
    date: "2023-05-22",
    time: "02:30 PM",
    provider: "Dr. Michael Chen",
    department: "Cardiology",
    type: "Consultation Note",
    content:
      "Initial cardiology consultation for evaluation of hypertension. Patient reports occasional chest discomfort with exertion. ECG shows normal sinus rhythm. Echocardiogram reveals mild left ventricular hypertrophy consistent with long-standing hypertension. Recommended adjustment to current antihypertensive medication and follow-up in 3 months. Discussed lifestyle modifications including sodium restriction and regular aerobic exercise.",
    tags: ["Cardiology", "Hypertension", "Consultation"],
  },
  {
    id: 3,
    date: "2023-04-10",
    time: "09:15 AM",
    provider: "Dr. Sarah Johnson",
    department: "Internal Medicine",
    type: "Phone Encounter",
    content:
      "Patient called with concerns about medication side effects. Reports experiencing mild dizziness after starting new blood pressure medication. Advised to take medication at bedtime instead of morning. Will follow up in one week to assess if symptoms improve. Patient instructed to call back or seek emergency care if symptoms worsen.",
    tags: ["Medication Management", "Phone Call"],
  },
  {
    id: 4,
    date: "2023-02-05",
    time: "11:30 AM",
    provider: "Dr. Emily Rodriguez",
    department: "Endocrinology",
    type: "Progress Note",
    content:
      "Follow-up for diabetes management. HbA1c improved from 7.2% to 6.8%. Patient reports compliance with medication and has been monitoring blood glucose regularly. Diet has improved with reduction in carbohydrate intake. Continuing current medication regimen. Encouraged continued lifestyle modifications and regular blood glucose monitoring. Will repeat HbA1c in 3 months.",
    tags: ["Diabetes", "Follow-up"],
  },
  {
    id: 5,
    date: "2022-11-18",
    time: "03:45 PM",
    provider: "Dr. Robert Williams",
    department: "Pulmonology",
    type: "Consultation Note",
    content:
      "Pulmonology consultation for evaluation of chronic cough. Patient reports productive cough for past 2 months, worse in the morning. Denies fever, night sweats, or weight loss. Chest X-ray shows no acute findings. Pulmonary function tests within normal limits. Impression: likely post-viral bronchitis with possible component of gastroesophageal reflux. Recommended trial of proton pump inhibitor and follow-up in 4 weeks if symptoms persist.",
    tags: ["Pulmonology", "Chronic Cough", "Consultation"],
  },
];

/**
 * PatientNotes component displays clinical notes for a patient
 * Includes search functionality and the ability to add new notes
 */
export function PatientNotes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState({
    type: "",
    content: "",
    tags: "",
  });

  // Filter notes based on search query
  const filteredNotes = clinicalNotes.filter((note) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      note.provider.toLowerCase().includes(query) ||
      note.type.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  // Handle adding a new note
  const handleAddNote = () => {
    // In a real app, this would save the note to a database
    console.log("New note:", newNote);
    setNewNote({ type: "", content: "", tags: "" });
    setShowAddNote(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Clinical Notes</h3>
        <div className="flex items-center space-x-2">
          <div className="relative w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant={showAddNote ? "secondary" : "default"}
            onClick={() => setShowAddNote(!showAddNote)}
          >
            {showAddNote ? "Cancel" : <Plus className="h-4 w-4 mr-2" />}
            {showAddNote ? "Cancel" : "Add Note"}
          </Button>
        </div>
      </div>

      {/* Add Note Form */}
      {showAddNote && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Clinical Note</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Note Type</label>
                  <Input
                    placeholder="Progress Note, Consultation, etc."
                    value={newNote.type}
                    onChange={(e) =>
                      setNewNote({ ...newNote, type: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <Input
                    placeholder="Comma-separated tags"
                    value={newNote.tags}
                    onChange={(e) =>
                      setNewNote({ ...newNote, tags: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Note Content</label>
                <Textarea
                  placeholder="Enter clinical note details here..."
                  className="min-h-[200px]"
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddNote}>Save Note</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <FileText className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No notes found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "No notes match your search criteria."
                  : "There are no clinical notes for this patient yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{note.type}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <User className="h-3.5 w-3.5 mr-1" />
                      <span>{note.provider}</span>
                      <span className="mx-1">•</span>
                      <span>{note.department}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{note.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{note.time}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm whitespace-pre-line">{note.content}</p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {note.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
