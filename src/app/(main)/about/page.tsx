"use client";

import { Building2, Heart, Shield, Users } from "lucide-react";
import Image from "next/image";

const values = [
  {
    title: "Patient-Centric Rehabilitation",
    description:
      "We put our patients first, ensuring personalized and compassionate rehabilitation services tailored to each individual's needs.",
    icon: <Heart className="h-6 w-6 text-green-600" />,
  },
  {
    title: "Modern Therapy Techniques",
    description:
      "Utilizing advanced rehabilitation equipment and evidence-based therapy methods to accelerate recovery and improve outcomes.",
    icon: <Building2 className="h-6 w-6 text-green-600" />,
  },
  {
    title: "Privacy & Confidentiality",
    description:
      "Your medical information and treatment records are protected with the highest standards of privacy and confidentiality.",
    icon: <Shield className="h-6 w-6 text-green-600" />,
  },
  {
    title: "Accessible Rehabilitation",
    description:
      "Making quality rehabilitation services accessible to all communities across India, regardless of background or location.",
    icon: <Users className="h-6 w-6 text-green-600" />,
  },
];

const team = [
  {
    name: "Dr. Rajashree Kumar",
    role: "Chief Rehabilitation Officer",
    image: "/team/doctor1.jpg",
    description:
      "25+ years of experience in rehabilitation medicine and physiotherapy, specializing in neurological rehabilitation.",
  },
  {
    name: "Dr. Arjun Sharma",
    role: "Head of Occupational Therapy",
    image: "/team/doctor2.jpg",
    description: "Expert in occupational therapy with focus on helping patients regain independence in daily activities.",
  },
  {
    name: "Dr. Priya Patel",
    role: "Director of Physical Therapy",
    image: "/team/doctor3.jpg",
    description: "Dedicated to restoring mobility and strength through innovative physical therapy techniques.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              About Healing Hand Rehabilitation Centre
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Restoring hope and rebuilding lives through comprehensive rehabilitation services
            </p>
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-3xl font-bold text-green-600 mb-2">5000+</h3>
                <p className="text-gray-600">Patients Rehabilitated</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-3xl font-bold text-green-600 mb-2">50+</h3>
                <p className="text-gray-600">Rehabilitation Specialists</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              Healing Hand Rehabilitation Centre is committed to transforming lives through
              comprehensive rehabilitation services. We specialize in helping patients recover
              from injuries, surgeries, and neurological conditions, empowering them to regain
              their independence and return to meaningful, productive lives.
            </p>
            <p className="text-lg text-gray-600">
             {` Our team of experienced therapists and rehabilitation specialists work together
              to create personalized treatment plans that address each patient's unique needs,
              ensuring the best possible outcomes for recovery and long-term wellness.`}
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Team Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  {member.name}
                </h3>
                <p className="text-green-600 text-center mb-3">{member.role}</p>
                <p className="text-gray-600 text-center">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
