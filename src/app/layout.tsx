import { Inter } from "next/font/google";
import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import ThemeProvider from "@/components/providers/theme-provider";
import { Loader2, Weight } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import path from "path";

const myFont = localFont({
  src: [
    {
      path: "../../public/fonts/trebuc.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/trebucit.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/trebucbd.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/trebucbi.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-trebuc",
});

export const metadata: Metadata = {
  title: "Healing Hand Rehabilitation Centre",
  description:
    "Modern Healthcare Management System for Healing Hand Rehabilitation Centre",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${myFont.className} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <AuthProvider
            fallback={
              <div className="h-screen w-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <main className="flex-1">{children}</main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
