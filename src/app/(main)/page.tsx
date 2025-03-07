"use client";

import { CTASection } from "@/components/home/cta-section";
import { FAQSection } from "@/components/home/faq-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (event) => setFile(event.target.files[0]);

  const uploadFile = async () => {
    if (!file) return alert("Please select a file!");

    try {
      setUploading(true);
      const filePath = `uploads/${Date.now()}_${file.name}`;

      const { data, error } = await supabase.storage
        .from("a-clinic-software")
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("a-clinic-software")
        .getPublicUrl(filePath);

      setUploadedUrl(publicUrlData.publicUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={uploadFile}
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {uploadedUrl && (
        <p className="mt-2">
          File uploaded:{" "}
          <a href={uploadedUrl} target="_blank">
            {uploadedUrl}
          </a>
        </p>
      )}
    </div>
  );
}

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

  return (
    <>
      <FileUpload />
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
