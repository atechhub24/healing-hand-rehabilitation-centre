import { AuthProvider } from "@/components/providers/auth-provider";
import ThemeProvider from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
