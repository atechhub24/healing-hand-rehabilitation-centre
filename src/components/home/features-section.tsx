"use client";

import {
  CalendarCheck,
  ClipboardList,
  Clock,
  Users,
  TestTube,
  HeartPulse,
} from "lucide-react";

const features = [
  {
    title: "Easy Appointment Booking",
    description:
      "Schedule appointments with healthcare providers quickly and easily.",
    icon: CalendarCheck,
  },
  {
    title: "Digital Health Records",
    description:
      "Access and manage your medical records securely from anywhere.",
    icon: ClipboardList,
  },
  {
    title: "24/7 Support",
    description:
      "Round-the-clock access to healthcare professionals for emergencies.",
    icon: Clock,
  },
  {
    title: "Family Health Management",
    description:
      "Manage healthcare for your entire family from a single dashboard.",
    icon: Users,
  },
  {
    title: "Lab Tests & Reports",
    description:
      "Book lab tests and receive digital reports directly on the platform.",
    icon: TestTube,
  },
  {
    title: "Health Monitoring",
    description:
      "Track your vital signs and health metrics with our integrated tools.",
    icon: HeartPulse,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to manage your health in one place
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
