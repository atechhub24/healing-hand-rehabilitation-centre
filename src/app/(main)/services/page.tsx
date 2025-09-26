"use client";

import { useState } from "react";
import Link from "next/link";
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
  Search,
  Star,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { Testimonials } from "@/components/ui/testimonials";
import { formatCurrency } from "@ashirbad/js-core";
import { Service } from "@/types";
import useFetch from "@/lib/hooks/use-fetch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as LucideIcons from "lucide-react";

// Fallback services if no data from Firebase
const fallbackServices = [
  {
    title: "Physical Therapy",
    description:
      "Restore movement and function with personalized physical therapy programs designed for your recovery.",
    icon: <Stethoscope className="h-6 w-6" />,
  },
  {
    title: "Occupational Therapy",
    description: "Learn daily living skills and regain independence through specialized occupational therapy.",
    icon: <TestTube className="h-6 w-6" />,
  },
  {
    title: "Speech Therapy",
    description: "Improve communication skills and swallowing abilities with expert speech therapy services.",
    icon: <Ambulance className="h-6 w-6" />,
  },
  {
    title: "Neurological Rehabilitation",
    description: "Specialized rehabilitation for stroke, brain injury, and neurological conditions.",
    icon: <Building2 className="h-6 w-6" />,
  },
  {
    title: "Pain Management",
    description:
      "Comprehensive pain relief strategies to improve your quality of life and mobility.",
    icon: <ClipboardList className="h-6 w-6" />,
  },
  {
    title: "Cardiac Rehabilitation",
    description: "Heart-healthy recovery programs to strengthen your cardiovascular system.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Assessment & Consultation",
    description:
      "Comprehensive evaluation and personalized treatment planning for your rehabilitation journey.",
    icon: <CalendarCheck className="h-6 w-6" />,
  },
  {
    title: "Home Therapy Support",
    description:
      "Convenient home-based therapy services for continued rehabilitation in your comfort zone.",
    icon: <Clock className="h-6 w-6" />,
  },
];

const testimonials = [
  {
    image: "/testimonials/patient1.jpg",
    name: "Priya Sharma",
    username: "@priya_s",
    text: "Healing Hand Rehabilitation Centre helped me recover completely after my knee surgery. The physiotherapy team was excellent and very supportive throughout my recovery journey.",
    social: "https://twitter.com",
  },
  {
    image: "/testimonials/patient2.jpg",
    name: "Rajesh Kumar",
    username: "@rajesh_k",
    text: "After my father's stroke, the speech therapy and occupational therapy services here were incredible. The therapists are very knowledgeable and caring.",
    social: "https://twitter.com",
  },
  {
    image: "/testimonials/patient3.jpg",
    name: "Anita Patel",
    username: "@anita_p",
    text: "I needed urgent rehabilitation services after my accident, and Healing Hand Rehabilitation Centre connected me with a specialist within hours. This service is a lifesaver!",
    social: "https://twitter.com",
  },
  {
    image: "/testimonials/patient4.jpg",
    name: "Suresh Reddy",
    username: "@suresh_r",
    text: "The pain management program here helped me get back to my normal life. No more chronic back pain thanks to their expert treatment and care.",
    social: "https://twitter.com",
  },
  {
    image: "/testimonials/patient5.jpg",
    name: "Kavita Singh",
    username: "@kavita_s",
    text: "As a working mother, the home therapy support was invaluable during my recovery. The therapists came to my home and provided excellent care.",
    social: "https://twitter.com",
  },
  {
    image: "/testimonials/patient6.jpg",
    name: "Arjun Mehta",
    username: "@arjun_m",
    text: "The cardiac rehabilitation program helped me regain my strength after heart surgery. The team's dedication and expertise made all the difference. Thank you Healing Hand Rehabilitation Centre!",
    social: "https://twitter.com",
  },
];

const Feature = ({
  title,
  description,
  icon,
  index,
  price,
  duration,
  isFeatured,
  isActive,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  price?: number;
  duration?: number;
  isFeatured?: boolean;
  isActive?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col relative group/feature bg-white rounded-2xl border overflow-hidden py-10 shadow-sm hover:shadow-md transition-shadow",
        "dark:border-neutral-800 dark:bg-neutral-900",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 ? (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      ) : null}
      {index >= 4 ? (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      ) : null}

      {/* Featured/Active Badges inside card */}
      {isFeatured || isActive ? (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {isFeatured ? (
            <span className="inline-flex items-center rounded-full bg-green-500/90 text-white text-xs font-medium px-3 py-1 shadow ring-1 ring-green-400/50">
              <Star className="h-3 w-3 mr-1" /> Featured
            </span>
          ) : null}
          {isActive ? (
            <span className="inline-flex items-center rounded-full bg-emerald-500/90 text-white text-xs font-medium px-3 py-1 shadow ring-1 ring-emerald-400/50">
              Active
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mb-4 relative z-0 px-10 text-neutral-600 dark:text-neutral-400">
        <div className="h-10 w-10 rounded-xl bg-green-50 dark:bg-neutral-800 grid place-items-center">
          {icon}
        </div>
      </div>
      <div className="text-xl font-semibold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-green-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10 mb-4">
        {description}
      </p>

      {/* Service Details */}
      {price || duration ? (
        <div className="relative z-10 px-10 space-y-1">
          {price && price > 0 ? (
            <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
              <DollarSign className="h-3 w-3" />
              <span>{formatCurrency(price)}</span>
            </div>
          ) : null}
          {duration ? (
            <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
              <Clock className="h-3 w-3" />
              <span>{duration} minutes</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Fetch services from Firebase
  const [servicesData, isLoading] = useFetch<Record<string, Service>>(
    "services",
    { needRaw: true }
  );

  // Convert services data to array and filter active services
  const activeServices = servicesData
    ? Object.entries(servicesData)
        .map(([serviceId, service]) => ({ ...service, id: serviceId }))
        .filter((service) => service.isActive)
    : [];

  // Get unique categories for filter
  const categories = [
    "All",
    ...new Set(activeServices.map((service) => service.category)),
  ];

  // Filter services based on search and category
  const filteredServices = activeServices.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Get icon component dynamically
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName] || Stethoscope;
    return <IconComponent className="h-6 w-6" />;
  };

  // Use filtered services or fallback to static services
  const displayServices =
    filteredServices.length > 0 ? filteredServices : fallbackServices;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
        <div className="bg-white py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">Our Rehabilitation Services</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-4">
            Comprehensive rehabilitation solutions designed to help you recover, rebuild strength,
            and regain independence through personalized therapy programs.
          </p>

          {/* Data Source Indicator */}
          <div className="text-center mb-8">
            {activeServices.length > 0 ? (
              <Badge variant="default" className="bg-green-500 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Live Data ({activeServices.length} rehabilitation services)
              </Badge>
            ) : (
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                Sample Data (8 rehabilitation services)
              </Badge>
            )}
          </div>

          {/* Search and Filter Section */}
          {activeServices.length > 0 ? (
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search rehabilitation services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "All"
                            ? "All Categories"
                            : category.charAt(0).toUpperCase() +
                              category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredServices.length !== activeServices.length ? (
                <div className="mt-4 text-sm text-gray-600 text-center">
                  Showing {filteredServices.length} of {activeServices.length}{" "}
                  rehabilitation services
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* Features Grid with Hover Effects */}
      <div className="bg-white py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
          {displayServices.map((service, index) => {
            // Handle both dynamic and fallback services
            const serviceData =
              "id" in service
                ? service
                : {
                    title: service.title,
                    description: service.description,
                    icon: service.icon,
                    price: undefined,
                    duration: undefined,
                    isFeatured: false,
                  };

            // Get the appropriate icon component
            const iconComponent =
              "id" in service ? getIconComponent(service.icon) : service.icon;

            return (
              <Feature
                key={serviceData.title}
                title={serviceData.title}
                description={serviceData.description}
                icon={iconComponent}
                index={index}
                price={serviceData.price}
                duration={serviceData.duration}
                isFeatured={serviceData.isFeatured}
                isActive={
                  "id" in service ? (service as Service & { isActive: boolean }).isActive : undefined
                }
              />
            );
          })}
        </div>
      </div>

      {/* No Results */}
      {activeServices.length > 0 && filteredServices.length === 0 ? (
        <div className="bg-white py-20">
          <div className="container mx-auto px-4 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No rehabilitation services found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or category filter to find the rehabilitation service you need.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      ) : null}

      {/* Admin Call-to-Action */}
      {activeServices.length === 0 ? (
        <div className="bg-white py-20">
          <div className="container mx-auto px-4 text-center">
            <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Rehabilitation Services Available
            </h3>
            <p className="text-gray-600 mb-6">
              Rehabilitation services haven&apos;t been added yet. Admin users can add services
              through the dashboard to help patients with their recovery journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/admin/services">
                  <LucideIcons.Plus className="h-4 w-4 mr-2" />
                  Manage Rehabilitation Services (Admin)
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-20">
        <Testimonials
          testimonials={testimonials}
          title="What Our Patients Say"
          description="Real recovery stories from patients who have transformed their lives through our rehabilitation programs."
          maxDisplayed={6}
          className="container mx-auto px-4"
        />
      </div>
    </div>
  );
}
