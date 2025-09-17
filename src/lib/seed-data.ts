import { Service, Branch } from "@/types";

/**
 * Seed Data for Services and Branches
 * 
 * This file contains sample data that can be used to populate the database
 * for demonstration purposes.
 */

export const seedServices: Omit<Service, "id" | "createdAt" | "creatorInfo">[] = [
  {
    title: "Online Consultations",
    description: "Connect with healthcare providers from the comfort of your home. Get expert medical advice through secure video calls with qualified doctors.",
    shortDescription: "Expert medical consultations from home",
    icon: "Stethoscope",
    category: "consultation",
    price: 500,
    duration: 30,
    isActive: true,
    isFeatured: true,
    features: [
      "Video consultations",
      "Prescription delivery",
      "Follow-up appointments",
      "Medical records access"
    ],
    requirements: [
      "Stable internet connection",
      "Valid ID proof",
      "Previous medical records (if any)"
    ],
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500"
  },
  {
    title: "Lab Tests",
    description: "Book and manage your lab tests with trusted laboratories. Get accurate results quickly with home sample collection available.",
    shortDescription: "Comprehensive lab testing services",
    icon: "TestTube",
    category: "diagnostic",
    price: 200,
    duration: 15,
    isActive: true,
    isFeatured: true,
    features: [
      "Home sample collection",
      "Online report access",
      "Doctor consultation",
      "Multiple test packages"
    ],
    requirements: [
      "Fasting (for specific tests)",
      "Valid prescription",
      "Government ID"
    ],
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500"
  },
  {
    title: "Emergency Services",
    description: "24/7 emergency medical assistance and ambulance services. Get immediate help when you need it most.",
    shortDescription: "24/7 emergency medical assistance",
    icon: "Ambulance",
    category: "emergency",
    price: 0,
    duration: 0,
    isActive: true,
    isFeatured: true,
    features: [
      "24/7 availability",
      "Ambulance service",
      "Emergency consultation",
      "Hospital coordination"
    ],
    requirements: [
      "Emergency contact number",
      "Location details",
      "Medical condition description"
    ],
    imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500"
  },
  {
    title: "Health Checkups",
    description: "Comprehensive health checkup packages designed to assess your overall health and detect potential issues early.",
    shortDescription: "Complete health assessment packages",
    icon: "Heart",
    category: "wellness",
    price: 1500,
    duration: 120,
    isActive: true,
    isFeatured: false,
    features: [
      "Full body checkup",
      "Blood tests",
      "ECG and X-ray",
      "Doctor consultation"
    ],
    requirements: [
      "Fasting required",
      "Appointment booking",
      "Health questionnaire"
    ],
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500"
  },
  {
    title: "Mental Health Support",
    description: "Professional mental health counseling and therapy sessions with licensed psychologists and psychiatrists.",
    shortDescription: "Professional mental health counseling",
    icon: "Users",
    category: "specialty",
    price: 800,
    duration: 60,
    isActive: true,
    isFeatured: false,
    features: [
      "Individual therapy",
      "Group sessions",
      "Crisis intervention",
      "Medication management"
    ],
    requirements: [
      "Initial assessment",
      "Confidentiality agreement",
      "Regular appointment schedule"
    ],
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500"
  },
  {
    title: "Pharmacy Services",
    description: "Convenient online pharmacy with prescription delivery and over-the-counter medications.",
    shortDescription: "Online pharmacy with delivery",
    icon: "Pill",
    category: "support",
    price: 0,
    duration: 0,
    isActive: true,
    isFeatured: false,
    features: [
      "Prescription delivery",
      "OTC medications",
      "Medicine reminders",
      "Drug interaction check"
    ],
    requirements: [
      "Valid prescription",
      "Delivery address",
      "Payment method"
    ],
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"
  },
  {
    title: "Telemedicine",
    description: "Advanced telemedicine platform connecting patients with specialists across various medical fields.",
    shortDescription: "Specialist consultations via telemedicine",
    icon: "Phone",
    category: "consultation",
    price: 750,
    duration: 45,
    isActive: true,
    isFeatured: false,
    features: [
      "Specialist consultations",
      "Second opinions",
      "Treatment planning",
      "Follow-up care"
    ],
    requirements: [
      "Medical history",
      "Current symptoms",
      "Previous test results"
    ],
    imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500"
  },
  {
    title: "Health Records Management",
    description: "Secure digital storage and management of your health records with easy access and sharing capabilities.",
    shortDescription: "Digital health records management",
    icon: "ClipboardList",
    category: "support",
    price: 0,
    duration: 0,
    isActive: true,
    isFeatured: false,
    features: [
      "Digital storage",
      "Easy sharing",
      "Backup and recovery",
      "Privacy protection"
    ],
    requirements: [
      "Account registration",
      "Identity verification",
      "Consent for data sharing"
    ],
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500"
  }
];

export const seedBranches: Omit<Branch, "id" | "createdAt" | "creatorInfo">[] = [
  {
    name: "Main Branch - Mumbai",
    address: "123 Healthcare Street, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    phoneNumber: "+91 9876543210",
    email: "mumbai@clinic.com",
    managerName: "Dr. Priya Sharma",
    managerPhone: "+91 9876543211",
    timings: {
      startTime: "08:00",
      endTime: "20:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    isActive: true
  },
  {
    name: "Delhi Branch",
    address: "456 Medical Plaza, Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    phoneNumber: "+91 9876543212",
    email: "delhi@clinic.com",
    managerName: "Dr. Rajesh Kumar",
    managerPhone: "+91 9876543213",
    timings: {
      startTime: "09:00",
      endTime: "19:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    isActive: true
  },
  {
    name: "Bangalore Branch",
    address: "789 Health Center, Koramangala",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560034",
    phoneNumber: "+91 9876543214",
    email: "bangalore@clinic.com",
    managerName: "Dr. Ananya Reddy",
    managerPhone: "+91 9876543215",
    timings: {
      startTime: "08:30",
      endTime: "18:30",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    isActive: true
  },
  {
    name: "Chennai Branch",
    address: "321 Wellness Hub, T. Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600017",
    phoneNumber: "+91 9876543216",
    email: "chennai@clinic.com",
    managerName: "Dr. Suresh Iyer",
    managerPhone: "+91 9876543217",
    timings: {
      startTime: "09:00",
      endTime: "19:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    isActive: true
  },
  {
    name: "Pune Branch",
    address: "654 Care Center, Koregaon Park",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    phoneNumber: "+91 9876543218",
    email: "pune@clinic.com",
    managerName: "Dr. Meera Joshi",
    managerPhone: "+91 9876543219",
    timings: {
      startTime: "08:00",
      endTime: "20:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    isActive: true
  },
  {
    name: "Hyderabad Branch",
    address: "987 Medical Complex, Banjara Hills",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500034",
    phoneNumber: "+91 9876543220",
    email: "hyderabad@clinic.com",
    managerName: "Dr. Vikram Rao",
    managerPhone: "+91 9876543221",
    timings: {
      startTime: "09:00",
      endTime: "19:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    isActive: true
  }
];