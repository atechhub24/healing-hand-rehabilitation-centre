"use client";

import { useState, ChangeEvent, useRef, DragEvent } from "react";
import { Button } from "./button";
import { Upload, File as FileIcon } from "lucide-react";
import { useFileUpload } from "@/lib/hooks/use-file-upload";
import { toast } from "./use-toast";

// Define MIME type mappings
const FILE_TYPE_MAPPINGS = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
};

interface FileUploadProps {
  onUploadComplete?: (fileUrl: string, file: File, storageId: string) => void;
  allowedFileTypes?: string[];
  maxSizeMB?: number;
  className?: string;
  tags?: string[];
  patientId: string;
}

export function FileUpload({
  onUploadComplete,
  allowedFileTypes,
  maxSizeMB = 10,
  className = "",
  tags = [],
  patientId,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile: upload } = useFileUpload();

  // Convert file types to MIME types
  const getAllowedMimeTypes = (types: string[] = []): string[] => {
    return types
      .flatMap((type) => {
        const mimeType =
          FILE_TYPE_MAPPINGS[type as keyof typeof FILE_TYPE_MAPPINGS];
        return Array.isArray(mimeType) ? mimeType : [mimeType];
      })
      .filter(Boolean);
  };

  // Validate file
  const validateFile = (selectedFile: File): boolean => {
    setError(null);

    // Validate file type if allowedFileTypes is provided
    if (allowedFileTypes && allowedFileTypes.length > 0) {
      const allowedMimeTypes = getAllowedMimeTypes(allowedFileTypes);
      if (!allowedMimeTypes.includes(selectedFile.type)) {
        setError(
          `File type not allowed. Please upload: ${allowedFileTypes.join(", ")}`
        );
        return false;
      }
    }

    // Validate file size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    return true;
  };

  // Handle file selection from input
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];

      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  // Handle drag events
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];

      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Upload file using Convex
  const uploadFileToStorage = async () => {
    if (!file) {
      setError("Please select a file!");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const { fileUrl, storageId } = await upload(file, {
        patientId,
        tags,
        maxSizeMB,
        allowedTypes: allowedFileTypes
          ? getAllowedMimeTypes(allowedFileTypes)
          : undefined,
      });

      setUploadedUrl(fileUrl);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      // Call the onUploadComplete callback if provided
      if (onUploadComplete) {
        onUploadComplete(fileUrl, file, storageId);
      }
    } catch (err: unknown) {
      console.error("Error uploading file:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`p-4 border rounded-md ${className}`}>
      <div
        className={`flex flex-col gap-4 items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          {file ? (
            <div className="flex items-center gap-2 text-blue-600">
              <FileIcon className="h-8 w-8" />
              <span className="font-medium">{file.name}</span>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-700">
                Drag & Drop your file here
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                or click to browse files
              </p>
              {allowedFileTypes && (
                <p className="text-xs text-gray-500 mt-2">
                  Allowed types: {allowedFileTypes.join(", ")}
                </p>
              )}
              <p className="text-xs text-gray-500">Max size: {maxSizeMB}MB</p>
            </>
          )}
        </div>

        <div className="flex gap-2 mt-2">
          {!file ? (
            <Button type="button" onClick={handleButtonClick} variant="outline">
              Select File
            </Button>
          ) : (
            <>
              <Button
                type="button"
                onClick={handleButtonClick}
                variant="outline"
                size="sm"
              >
                Change
              </Button>
              <Button
                onClick={uploadFileToStorage}
                disabled={uploading}
                size="sm"
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </>
          )}
        </div>
      </div>

      {file && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Selected: {file.name}</p>
          <p>Size: {(file.size / (1024 * 1024)).toFixed(2)}MB</p>
          <p>Type: {file.type || "Unknown"}</p>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {uploadedUrl && (
        <div className="mt-4 p-3 bg-green-50 rounded-md">
          <p className="text-sm text-green-700 font-medium">
            File uploaded successfully!
          </p>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline break-all"
          >
            {uploadedUrl}
          </a>
        </div>
      )}
    </div>
  );
}
