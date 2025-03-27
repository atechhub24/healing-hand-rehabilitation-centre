import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface UploadResult {
  storageId: string;
  fileUrl: string;
}

interface UploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  patientId: string;
  tags: string[];
}

const DEFAULT_OPTIONS: Partial<UploadOptions> = {
  maxSizeMB: 50,
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
};

/**
 * Hook for handling file uploads using Convex
 * @returns Object containing the uploadFile function and loading state
 */
export function useFileUpload() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveStorageId = useMutation(api.files.saveStorageId);
  const getFileUrl = useMutation(api.files.getFileUrl);

  const uploadFile = async (
    file: File,
    options: UploadOptions
  ): Promise<UploadResult> => {
    try {
      const { maxSizeMB, allowedTypes, patientId, tags } = {
        ...DEFAULT_OPTIONS,
        ...options,
      };

      // Validate file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (maxSizeMB && fileSizeInMB > maxSizeMB) {
        throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
      }

      // Validate file type
      if (allowedTypes && !allowedTypes.includes(file.type)) {
        throw new Error(
          `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(
            ", "
          )}`
        );
      }

      // Validate required fields
      if (!patientId) {
        throw new Error("Patient ID is required");
      }

      if (!tags || !Array.isArray(tags) || tags.length === 0) {
        throw new Error("At least one tag is required");
      }

      // Step 1: Get upload URL from Convex
      const postUrl = await generateUploadUrl();
      if (!postUrl) {
        throw new Error("Failed to generate upload URL");
      }

      // Step 2: Upload the file to Convex storage
      const result = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`);
      }

      const { storageId } = await result.json();
      if (!storageId) {
        throw new Error("No storage ID returned from upload");
      }

      // Step 3: Save the storage ID and metadata in Convex database
      await saveStorageId({
        storageId,
        patientId,
        tags,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      // Step 4: Get the file URL
      const fileUrl = await getFileUrl({ storageId });
      if (!fileUrl) {
        throw new Error("Failed to get file URL");
      }

      return { storageId, fileUrl };
    } catch (error) {
      console.error("File upload failed:", error);
      throw error instanceof Error
        ? error
        : new Error("Unknown error during file upload");
    }
  };

  return {
    uploadFile,
  };
}
