"use client";

import {
  CalendarCheck,
  Activity,
  Users,
  Brain,
  Heart,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "Physical Therapy",
    description:
      "Restore movement and function with personalized physical therapy programs designed for your specific needs.",
    icon: Activity,
  },
  {
    title: "Occupational Therapy",
    description:
      "Regain independence in daily activities with specialized occupational therapy tailored to your lifestyle.",
    icon: Users,
  },
  {
    title: "Speech & Language Therapy",
    description:
      "Improve communication skills and swallowing function with expert speech-language pathology services.",
    icon: Brain,
  },
  {
    title: "Cardiac Rehabilitation",
    description:
      "Strengthen your heart and improve cardiovascular health through medically supervised exercise programs.",
    icon: Heart,
  },
  {
    title: "Neurological Rehabilitation",
    description:
      "Specialized programs for stroke, brain injury, and neurological conditions to maximize recovery potential.",
    icon: Zap,
  },
  {
    title: "Appointment Scheduling",
    description:
      "Easy online booking system to schedule your therapy sessions and track your rehabilitation progress.",
    icon: CalendarCheck,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Comprehensive Rehabilitation Services
          </h2>
          <p className="text-xl text-gray-600">
            Expert therapy programs designed to help you achieve your recovery goals
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <feature.icon className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
