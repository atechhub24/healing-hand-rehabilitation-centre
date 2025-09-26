"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useFetch from "@/lib/hooks/use-fetch";
import { Branch } from "@/types";
import {
  Building2,
  Clock,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Search,
  User
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/**
 * Public Branches Page
 * 
 * This page displays all active clinic branches in a modern, responsive design.
 * Users can browse branches, view details, and get directions.
 */
export default function BranchesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");

  // Fetch branches from Firebase
  const [branchesData, isLoading] = useFetch<Record<string, Branch>>(
    "branches",
    { needRaw: true }
  );

  // Convert branches data to array and filter active branches
  const activeBranches = branchesData 
    ? Object.entries(branchesData)
        .map(([, branch]) => ({ ...branch }))
        .filter(branch => branch.isActive)
    : [];

  // Get unique cities for filter
  const cities = ["All", ...new Set(activeBranches.map(branch => branch.city))];

  // Filter branches based on search and city
  const filteredBranches = activeBranches.filter(branch => {
    const matchesSearch = 
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = selectedCity === "All" || branch.city === selectedCity;
    
    return matchesSearch && matchesCity;
  });

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Format days for display
  const formatDays = (days: string[]) => {
    if (days.length === 0) return "Closed";
    if (days.length === 7) return "Every day";
    if (days.length === 5 && !days.includes("Saturday") && !days.includes("Sunday")) {
      return "Monday - Friday";
    }
    return days.join(", ");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (activeBranches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Branches Available
            </h1>
            <p className="text-gray-600 mb-8">
             {
              "We're sorry, but there are currently no active branches available."
}
            </p>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Clinic Locations
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Find the nearest branch to you and discover our comprehensive healthcare services
            </p>
            <div className="flex items-center justify-center gap-2 text-green-200">
              <Building2 className="h-5 w-5" />
              <span>{activeBranches.length} Active Location{activeBranches.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search branches by name, address, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {filteredBranches.length !== activeBranches.length && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredBranches.length} of {activeBranches.length} branches
            </div>
          )}
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.map((branch) => (
            <Card key={branch.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">{branch.name}</CardTitle>
                  </div>
                  <Badge 
                    variant="default" 
                    className="bg-green-500 text-white"
                  >
                    Active
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Address */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">{branch.address}</p>
                      <p className="text-gray-600">
                        {branch.city}, {branch.state} - {branch.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{branch.phoneNumber}</span>
                  </div>
                  
                  {branch.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{branch.email}</span>
                    </div>
                  )}
                </div>

                {/* Manager Information */}
                {branch.managerName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div className="text-sm">
                      <p className="font-medium">{branch.managerName}</p>
                      {branch.managerPhone && (
                        <p className="text-gray-600">{branch.managerPhone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Operating Hours */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">
                        {formatTime(branch.timings.startTime)} - {formatTime(branch.timings.endTime)}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {formatDays(branch.timings.days)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/branches/${branch.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const address = encodeURIComponent(`${branch.address}, ${branch.city}, ${branch.state} ${branch.pincode}`);
                      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
                    }}
                  >
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredBranches.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No branches found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or city filter.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCity("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}