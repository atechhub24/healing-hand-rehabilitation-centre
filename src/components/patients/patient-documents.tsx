"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, FileText, Trash2, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "@/components/ui/use-toast";
import { Id } from "../../../convex/_generated/dataModel";

interface PatientDocumentsProps {
  patientId: string;
}

interface ConvexDocument {
  _id: Id<"files">;
  _creationTime: number;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  storageId: string;
  uploadedAt: number;
  patientId: string;
  tags: string[];
  userId: string;
}

export function PatientDocuments({ patientId }: PatientDocumentsProps) {
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>(["document"]);
  const [tagInput, setTagInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Convex mutations and queries
  const deleteFile = useMutation(api.files.deleteFile);
  const documents = useQuery(api.files.getFilesByPatient, { patientId });
  const isLoading = documents === undefined;

  // Handle document upload completion
  const handleUploadComplete = async () => {
    try {
      // Reset form
      setDescription("");
      setTags(["document"]);
      setTagInput("");

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (error) {
      console.error("Error handling upload completion:", error);
      toast({
        title: "Error",
        description: "Failed to process the uploaded document",
        variant: "destructive",
      });
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (doc: ConvexDocument) => {
    try {
      setIsDeleting(true);

      // Delete file from Convex storage
      await deleteFile({ storageId: doc.storageId });

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete the document",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle adding a tag
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter document description..."
              />
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button onClick={handleAddTag} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <FileUpload
              onUploadComplete={handleUploadComplete}
              patientId={patientId}
              tags={tags}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !documents || documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No documents found
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="font-medium">{doc.fileName}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(doc.uploadedAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Document</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this document? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteDocument(doc)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Delete"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
