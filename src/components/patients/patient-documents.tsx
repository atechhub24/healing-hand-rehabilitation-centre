"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { PatientDocument } from "@/types";
import useFetch from "@/lib/hooks/use-fetch";
import mutate from "@/lib/firebase/mutate-data";
import {
  Loader2,
  FileText,
  Trash2,
  Download,
  Calendar,
  FileIcon,
  Plus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { auth } from "@/lib/firebase";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface PatientDocumentsProps {
  patientId: string;
}

export function PatientDocuments({ patientId }: PatientDocumentsProps) {
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>(["document"]);
  const [tagInput, setTagInput] = useState("");
  const [selectedDocument, setSelectedDocument] =
    useState<PatientDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Convex mutations
  const deleteFile = useMutation(api.files.deleteFile);

  // Fetch patient documents from Firebase
  const [documents, isLoading, refetch] = useFetch<
    Record<string, PatientDocument>
  >(`/patient-documents/${patientId}`, { needRaw: true });

  // Handle document upload completion
  const handleUploadComplete = async (
    url: string,
    file: File,
    storageId: string
  ) => {
    try {
      // Create document metadata in Firebase
      const documentData: Omit<PatientDocument, "id"> = {
        patientId,
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        storagePath: storageId,
        uploadedAt: new Date().toISOString(),
        uploadedBy: auth.currentUser?.uid,
        description: description || undefined,
        tags: tags.length > 0 ? tags : undefined,
        createdAt: new Date().toISOString(),
      };

      // Save document metadata to Firebase
      const result = await mutate({
        path: `/patient-documents/${patientId}`,
        data: documentData,
        action: "createWithId",
      });

      if (result.success) {
        // Reset form
        setDescription("");
        setTags(["document"]);
        setTagInput("");

        // Refresh documents list
        refetch();
      } else {
        console.error("Failed to save document metadata:", result.error);
        alert("Failed to save document metadata. Please try again.");
      }
    } catch (error) {
      console.error("Error saving document metadata:", error);
      alert("An error occurred while saving document metadata.");
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (document: PatientDocument) => {
    try {
      setIsDeleting(true);

      // Delete file from Convex storage
      await deleteFile({ storageId: document.storagePath });

      // Delete document metadata from Firebase
      const result = await mutate({
        path: `/patient-documents/${patientId}/${document.id}`,
        data: {},
        action: "delete",
      });

      if (result.success) {
        // Refresh documents list
        refetch();
        setSelectedDocument(null);
      } else {
        console.error("Failed to delete document metadata:", result.error);
        alert("Failed to delete document metadata. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("An error occurred while deleting the document.");
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
    <Tabs defaultValue="documents" className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="documents">Documents List</TabsTrigger>
        <TabsTrigger value="upload">Upload New Document</TabsTrigger>
      </TabsList>

      <TabsContent value="documents">
        <Card>
          <CardHeader>
            <CardTitle>Patient Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !documents || Object.keys(documents).length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  No documents found for this patient.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    const uploadTab = document.querySelector(
                      '[data-value="upload"]'
                    ) as HTMLElement;
                    if (uploadTab) uploadTab.click();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(documents).map(([id, doc]) => (
                  <Card
                    key={id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedDocument({ ...doc, id })}
                  >
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded">
                        <FileIcon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {doc.name}
                        </h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {formatDistanceToNow(new Date(doc.uploadedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        {doc.tags && doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {doc.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {doc.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{doc.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Document Details Dialog */}
            {selectedDocument && (
              <AlertDialog
                open={!!selectedDocument}
                onOpenChange={(open) => !open && setSelectedDocument(null)}
              >
                <AlertDialogContent className="max-w-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="truncate">
                      {selectedDocument.name}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <span className="text-muted-foreground">Type:</span>{" "}
                          {selectedDocument.type}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Size:</span>{" "}
                          {(selectedDocument.size / (1024 * 1024)).toFixed(2)}{" "}
                          MB
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Uploaded:
                          </span>{" "}
                          {new Date(
                            selectedDocument.uploadedAt
                          ).toLocaleString()}
                        </div>
                      </div>

                      {selectedDocument.description && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-1">
                            Description
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedDocument.description}
                          </p>
                        </div>
                      )}

                      {selectedDocument.tags &&
                        selectedDocument.tags.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-1">Tags</h4>
                            <div className="flex flex-wrap gap-1">
                              {selectedDocument.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <Button variant="outline" asChild>
                      <a
                        href={selectedDocument.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a
                        href={selectedDocument.url}
                        download={selectedDocument.name}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={isDeleting}>
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                  </AlertDialogFooter>
                </AlertDialogContent>

                {/* Confirmation Dialog for Delete */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <span className="hidden">Delete</span>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the document from the patient&apos;s records and
                        remove the file from storage.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => handleDeleteDocument(selectedDocument)}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </AlertDialog>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Document</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a description for this document"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add tags (press Enter)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddTag())
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          className="text-xs hover:text-destructive"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <FileUpload
                  patientId={patientId}
                  allowedFileTypes={[
                    "pdf",
                    "image",
                    "doc",
                    "docx",
                    "xls",
                    "xlsx",
                    "ppt",
                    "pptx",
                  ]}
                  maxSizeMB={10}
                  onUploadComplete={handleUploadComplete}
                  className="border-none p-0"
                  tags={tags}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
