"use client";

import { Building2, Heart, Shield, Users } from "lucide-react";
import Image from "next/image";

const values = [
  {
    title: "Patient-Centric Care",
    description:
      "We put our patients first, ensuring personalized and compassionate healthcare services.",
    icon: <Heart className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Innovation & Technology",
    description:
      "Leveraging cutting-edge technology to improve healthcare delivery and patient experience.",
    icon: <Building2 className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Security & Privacy",
    description:
      "Your health data is protected with the highest standards of security and confidentiality.",
    icon: <Shield className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Inclusive Healthcare",
    description:
      "Making quality healthcare accessible to everyone, everywhere.",
    icon: <Users className="h-6 w-6 text-blue-600" />,
  },
];

const team = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Chief Medical Officer",
    image: "/team/doctor1.jpg",
    description:
      "20+ years of experience in healthcare management and patient care.",
  },
  {
    name: "Dr. James Wilson",
    role: "Head of Telemedicine",
    image: "/team/doctor2.jpg",
    description: "Pioneer in implementing innovative telehealth solutions.",
  },
  {
    name: "Dr. Maria Garcia",
    role: "Director of Patient Services",
    image: "/team/doctor3.jpg",
    description: "Dedicated to improving patient experience and care quality.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              About Healthcare+
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transforming healthcare delivery through technology and innovation
            </p>
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-3xl font-bold text-blue-600 mb-2">10k+</h3>
                <p className="text-gray-600">Patients Served</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-3xl font-bold text-blue-600 mb-2">500+</h3>
                <p className="text-gray-600">Healthcare Providers</p>
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
              Healthcare+ is committed to revolutionizing healthcare
              accessibility through innovative technology solutions. We believe
              that quality healthcare should be available to everyone, anywhere,
              at any time.
            </p>
            <p className="text-lg text-gray-600">
              Our platform connects patients with healthcare providers
              seamlessly, making healthcare management simpler and more
              efficient for everyone involved.
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
                <p className="text-blue-600 text-center mb-3">{member.role}</p>
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
