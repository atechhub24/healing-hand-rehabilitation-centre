"use client";

import { useParams } from "next/navigation";
import { Branch } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  Navigation,
  Calendar,
  ArrowLeft,
  Star,
  CheckCircle
} from "lucide-react";
import useFetch from "@/lib/hooks/use-fetch";
import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * Individual Branch Detail Page
 * 
 * This page displays detailed information about a specific clinic branch
 * including location, contact details, operating hours, and services.
 */
export default function BranchDetailPage() {
  const params = useParams();
  const branchId = params.id as string;

  // Fetch specific branch from Firebase
  const [branchData, isLoading] = useFetch<Branch>(
    `branches/${branchId}`,
    { needRaw: true }
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Branch not found
  if (!branchData || !branchData.isActive) {
    notFound();
  }

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

  // Get directions URL
  const getDirectionsUrl = () => {
    const address = encodeURIComponent(`${branchData.address}, ${branchData.city}, ${branchData.state} ${branchData.pincode}`);
    return `https://www.google.com/maps/search/?api=1&query=${address}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/branches" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Branches
              </Link>
            </Button>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-8 w-8 text-green-600" />
                <h1 className="text-3xl font-bold text-gray-900">{branchData.name}</h1>
                <Badge 
                  variant="default" 
                  className="bg-green-500 text-white"
                >
                  Active
                </Badge>
              </div>
              <p className="text-gray-600 text-lg">
                {branchData.address}, {branchData.city}, {branchData.state} {branchData.pincode}
              </p>
            </div>
            
            <Button 
              onClick={() => window.open(getDirectionsUrl(), '_blank')}
              className="flex items-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              Get Directions
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Location Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Address</h4>
                    <p className="text-gray-900">{branchData.address}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">City</h4>
                    <p className="text-gray-900">{branchData.city}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">State</h4>
                    <p className="text-gray-900">{branchData.state}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Pincode</h4>
                    <p className="text-gray-900">{branchData.pincode}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Phone Number</h4>
                    <p className="text-gray-900">{branchData.phoneNumber}</p>
                  </div>
                  {branchData.email && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Email</h4>
                      <p className="text-gray-900">{branchData.email}</p>
                    </div>
                  )}
                </div>
                
                {branchData.managerName && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Branch Manager</h4>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{branchData.managerName}</p>
                        {branchData.managerPhone && (
                          <p className="text-sm text-gray-600">{branchData.managerPhone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Our Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">General Consultation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Emergency Care</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Diagnostic Services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Pharmacy Services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Laboratory Tests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Specialist Consultation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-lg font-semibold text-green-900">>
                    {formatTime(branchData.timings.startTime)} - {formatTime(branchData.timings.endTime)}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    {formatDays(branchData.timings.days)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700">Daily Schedule</h4>
                  <div className="space-y-1">
                    {branchData.timings.days.map((day) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="text-gray-600">{day}</span>
                        <span className="text-gray-900">
                          {formatTime(branchData.timings.startTime)} - {formatTime(branchData.timings.endTime)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => window.open(getDirectionsUrl(), '_blank')}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`tel:${branchData.phoneNumber}`, '_self')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                
                {branchData.email && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(`mailto:${branchData.email}`, '_self')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Branch Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Branch Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Established</span>
                  <span className="text-gray-900">
                    {new Date(branchData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <Badge variant="default" className="bg-green-500 text-white">
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Branch ID</span>
                  <span className="text-gray-900 font-mono text-xs">{branchData.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}