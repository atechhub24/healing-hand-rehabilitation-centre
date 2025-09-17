"use client";

import { useState, useMemo } from "react";
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
  Filter,
  Star,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { Testimonials } from "@/components/ui/testimonials";
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
    title: "Online Consultations",
    description: "Connect with healthcare providers from the comfort of your home.",
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
    description: "Secure digital storage and management of your health records.",
    icon: <ClipboardList className="h-6 w-6" />,
  },
  {
    title: "Family Care",
    description: "Comprehensive healthcare solutions for your entire family.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Appointment Booking",
    description: "Schedule appointments with healthcare providers quickly and easily.",
    icon: <CalendarCheck className="h-6 w-6" />,
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock access to healthcare professionals for emergencies.",
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
  price,
  duration,
  isFeatured,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  price?: number;
  duration?: number;
  isFeatured?: boolean;
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
      
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-4 right-4 z-20">
          <Badge variant="default" className="bg-yellow-500 text-white">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        </div>
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
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10 mb-4">
        {description}
      </p>
      
      {/* Service Details */}
      {(price || duration) && (
        <div className="relative z-10 px-10 space-y-1">
          {price && price > 0 && (
            <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
              <DollarSign className="h-3 w-3" />
              <span>₹{price}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
              <Clock className="h-3 w-3" />
              <span>{duration} minutes</span>
            </div>
          )}
        </div>
      )}
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
        .map(([id, service]) => ({ id, ...service }))
        .filter(service => service.isActive)
    : [];

  // Get unique categories for filter
  const categories = ["All", ...new Set(activeServices.map(service => service.category))];

  // Filter services based on search and category
  const filteredServices = activeServices.filter(service => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get icon component dynamically
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || Stethoscope;
    return <IconComponent className="h-6 w-6" />;
  };

  // Use filtered services or fallback to static services
  const displayServices = filteredServices.length > 0 ? filteredServices : fallbackServices;

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
          <h1 className="text-4xl font-bold text-center mb-6">Our Services</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-8">
            Comprehensive healthcare solutions designed to provide you with the
            best medical care and support, anytime and anywhere.
          </p>
          
          {/* Search and Filter Section */}
          {activeServices.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "All" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {filteredServices.length !== activeServices.length && (
                <div className="mt-4 text-sm text-gray-600 text-center">
                  Showing {filteredServices.length} of {activeServices.length} services
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features Grid with Hover Effects */}
      <div className="bg-white py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
          {displayServices.map((service, index) => {
            // Handle both dynamic and fallback services
            const serviceData = 'id' in service ? service : {
              title: service.title,
              description: service.description,
              icon: service.icon,
              price: undefined,
              duration: undefined,
              isFeatured: false,
            };

            return (
              <Feature 
                key={serviceData.title} 
                title={serviceData.title}
                description={serviceData.description}
                icon={serviceData.icon}
                index={index}
                price={serviceData.price}
                duration={serviceData.duration}
                isFeatured={serviceData.isFeatured}
              />
            );
          })}
        </div>
      </div>

      {/* No Results */}
      {activeServices.length > 0 && filteredServices.length === 0 && (
        <div className="bg-white py-20">
          <div className="container mx-auto px-4 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or category filter.
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
      )}

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
