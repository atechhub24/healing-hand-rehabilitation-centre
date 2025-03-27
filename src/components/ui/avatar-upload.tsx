import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, User } from "lucide-react";
import { useFileUpload } from "@/lib/hooks/use-file-upload";
import { toast } from "@/components/ui/use-toast";

interface AvatarUploadProps {
  initialImageUrl?: string;
  onUploadComplete?: (fileUrl: string) => void;
  patientId: string;
  patientName?: string;
}

export function AvatarUpload({
  initialImageUrl,
  onUploadComplete,
  patientId,
  patientName,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const { uploadFile } = useFileUpload();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { fileUrl } = await uploadFile(file, {
        patientId,
        tags: ["profile"],
        maxSizeMB: 5,
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      });
      setImageUrl(fileUrl);
      onUploadComplete?.(fileUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Upload failed",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={imageUrl} alt={patientName} />
        <AvatarFallback className="bg-primary/10">
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <User className="h-12 w-12 text-primary" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="relative"
          disabled={isUploading}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileSelect}
            accept="image/*"
          />
          <Upload className="h-4 w-4 mr-2" />
          Upload Photo
        </Button>
      </div>
    </div>
  );
}
