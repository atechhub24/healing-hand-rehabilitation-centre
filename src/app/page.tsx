"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-32 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold">
            Your Healthcare Management Platform
          </h1>
          <p className="mb-8 text-xl">
            Connect with healthcare providers, manage appointments, and access
            your medical records - all in one place.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => router.push("/auth/register/customer")}
              className="bg-white px-8 py-6 text-lg font-semibold text-blue-600 hover:bg-gray-100"
            >
              Register as Patient
            </Button>
            <Button
              onClick={() => router.push("/auth/register")}
              className="border-2 border-white bg-transparent px-8 py-6 text-lg font-semibold text-white hover:bg-white hover:text-blue-600"
            >
              Register as Provider
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Choose Our Platform?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              title="Easy Appointment Booking"
              description="Book appointments with healthcare providers quickly and easily, with real-time availability."
            />
            <FeatureCard
              title="Secure Medical Records"
              description="Access and manage your medical records securely, with complete privacy and control."
            />
            <FeatureCard
              title="Integrated Healthcare"
              description="Connect with doctors, paramedics, and labs - all through a single platform."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 px-4 py-8 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <p>© 2024 Healthcare Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-6 text-center">
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
