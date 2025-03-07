"use client";

import { CTASection } from "@/components/home/cta-section";
import { FAQSection } from "@/components/home/faq-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { FileUpload } from "@/components/ui/file-upload";

import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function HomePage() {
  // check if supabase is connected
  useEffect(() => {
    const checkSupabase = async () => {
      const { data, error } = await supabase.storage
        .from("a-clinic-software")
        .list();
      if (error) {
        console.error(error);
      }
      console.log(data);
    };
    checkSupabase();
  }, []);

  const handleUploadComplete = (url: string) => {
    console.log("File uploaded successfully:", url);
    // You can do additional actions here like updating a database record
  };

  return (
    <>
      <div className="container mx-auto my-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Upload Medical Documents</CardTitle>
            <CardDescription>
              Drag and drop your medical files or click to browse. We support
              PDF, images, and document files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              bucketName="a-clinic-software"
              folderPath="medical-documents"
              allowedFileTypes={["pdf", "image", "doc"]}
              maxSizeMB={5}
              onUploadComplete={handleUploadComplete}
            />
          </CardContent>
        </Card>
      </div>
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
