"use client";

import { cn } from "@/lib/utils";
import {
  Ambulance,
  Building2,
  CalendarCheck,
  ClipboardList,
  Clock,
  Stethoscope,
  TestTube,
  Users,
} from "lucide-react";
import { Testimonials } from "@/components/ui/testimonials";

const services = [
  {
    title: "Online Consultations",
    description:
      "Connect with healthcare providers from the comfort of your home.",
    icon: <Stethoscope className="h-6 w-6" />,
  },
  {
    title: "Lab Tests",
    description: "Book and manage your lab tests with trusted laboratories.",
    icon: <TestTube className="h-6 w-6" />,
  },
  {
    title: "Emergency Services",
    description: "24/7 emergency medical assistance and ambulance services.",
    icon: <Ambulance className="h-6 w-6" />,
  },
  {
    title: "Hospital Network",
    description: "Access to a wide network of hospitals and clinics.",
    icon: <Building2 className="h-6 w-6" />,
  },
  {
    title: "Health Records",
    description:
      "Secure digital storage and management of your health records.",
    icon: <ClipboardList className="h-6 w-6" />,
  },
  {
    title: "Family Care",
    description: "Comprehensive healthcare solutions for your entire family.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Appointment Booking",
    description:
      "Schedule appointments with healthcare providers quickly and easily.",
    icon: <CalendarCheck className="h-6 w-6" />,
  },
  {
    title: "24/7 Support",
    description:
      "Round-the-clock access to healthcare professionals for emergencies.",
    icon: <Clock className="h-6 w-6" />,
  },
];

const testimonials = [
  {
    image: "/testimonials/patient1.jpg",
    name: "Sarah Johnson",
    username: "@sarah_j",
    text: "Healthcare+ has made managing my family's health so much easier. The online consultations are incredibly convenient, and the doctors are very professional.",
    social: "https://twitter.com",
  },
  {
    image: "/testimonials/patient2.jpg",
    name: "Michael Chen",
    username: "@mike_chen",
    text: "The lab test booking feature is fantastic! Got my results quickly and the whole process was seamless. Highly recommend this platform.",
    social: "https://twitter.com",
  },
  {
    image: "/testimonials/patient3.jpg",
    name: "Emily Rodriguez",
    username: "@em_rod",
    text: "I needed urgent care while traveling, and Healthcare+ connected me with a local doctor within minutes. This service is a lifesaver!",
    social: "https://twitter.com",
  },
  {
    image: "/testimonials/patient4.jpg",
    name: "David Wilson",
    username: "@dave_wil",
    text: "The digital health records feature helps me keep track of all my medical history in one place. No more carrying papers around!",
    social: "https://twitter.com",
  },
  {
    image: "/testimonials/patient5.jpg",
    name: "Priya Patel",
    username: "@priya_p",
    text: "As a busy professional, the 24/7 support and quick appointment booking have been invaluable. The platform is user-friendly and efficient.",
    social: "https://twitter.com",
  },
  {
    image: "/testimonials/patient6.jpg",
    name: "James Thompson",
    username: "@james_t",
    text: "The emergency services response time is impressive. When my son had an accident, we got immediate assistance. Thank you Healthcare+!",
    social: "https://twitter.com",
  },
];

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">Our Services</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Comprehensive healthcare solutions designed to provide you with the
            best medical care and support, anytime and anywhere.
          </p>
        </div>
      </div>

      {/* Features Grid with Hover Effects */}
      <div className="bg-white py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Feature key={service.title} {...service} index={index} />
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-20">
        <Testimonials
          testimonials={testimonials}
          title="What Our Users Say"
          description="Real experiences from people who have transformed their healthcare journey with our platform."
          maxDisplayed={6}
          className="container mx-auto px-4"
        />
      </div>
    </div>
  );
}
