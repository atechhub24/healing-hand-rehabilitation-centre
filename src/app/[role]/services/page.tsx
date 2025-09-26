"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import mutate from "@/lib/firebase/mutate-data";
import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import { clearDatabase, seedDatabase } from "@/lib/seed-database";
import { Service } from "@/types";
import {
  Filter,
  Plus,
  Search,
  Star,
  Stethoscope,
  Trash2
} from "lucide-react";
import { useState } from "react";
import ServiceForm from "./service-form";
import ServiceList from "./service-list";

/**
 * Services Management Page Component
 * 
 * This component provides a comprehensive interface for managing clinic services.
 * It includes functionality to view, add, edit, and delete services.
 * Only admin users can access this page.
 */
export default function ServicesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isSeeding, setIsSeeding] = useState(false);

  // Fetch services from Firebase using useFetch hook
  const [servicesData, isLoading, refetch] = useFetch<Record<string, Service>>(
    "services",
    { needRaw: true }
  );

  // Convert services data to array format
  const services = servicesData 
    ? Object.entries(servicesData).map(([, service]) => ({ ...service }))
    : [];

  // Filter services based on search, category, and status
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    const matchesStatus = statusFilter === "All" || 
      (statusFilter === "Active" && service.isActive) ||
      (statusFilter === "Inactive" && !service.isActive) ||
      (statusFilter === "Featured" && service.isFeatured);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle service creation/update
  const handleServiceSubmit = async (serviceData: Omit<Service, "id" | "createdAt" | "creatorInfo">) => {
    try {
      if (editingService) {
        // Update existing service
        const result = await mutate({
          path: `services/${editingService.id}`,
          data: serviceData,
          action: "update",
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to update service");
        }

        toast({
          title: "Success",
          description: "Service updated successfully",
        });
      } else {
        // Create new service
        const result = await mutate({
          path: "services",
          data: {
            ...serviceData,
            createdAt: new Date().toISOString(),
          },
          action: "createWithId",
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to create service");
        }

        toast({
          title: "Success",
          description: "Service created successfully",
        });
      }
      
      setShowForm(false);
      setEditingService(null);
      refetch(); // Refresh the list using useFetch refetch
    } catch (error) {
      console.error("Error saving service:", error);
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive",
      });
    }
  };

  // Handle service deletion
  const handleServiceDelete = async (serviceId: string) => {
    try {
      const result = await mutate({
        path: `services/${serviceId}`,
        action: "delete",
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to delete service");
      }

      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
      refetch(); // Refresh the list using useFetch refetch
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  // Handle edit service
  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  // Handle form close
  const handleFormClose = () => {
    setShowForm(false);
    setEditingService(null);
  };

  // Handle seed database
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const result = await seedDatabase();
      
      if (result.success) {
        toast({
          title: "Database Seeded Successfully! 🎉",
          description: `Created ${result.servicesCreated} services and ${result.branchesCreated} branches`,
        });
        refetch(); // Refresh the list
      } else {
        toast({
          title: "Seeding Completed with Errors",
          description: `Created ${result.servicesCreated} services and ${result.branchesCreated} branches. ${result.errors.length} errors occurred.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error seeding database:", error);
      toast({
        title: "Error",
        description: "Failed to seed database",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  // Handle clear database
  const handleClearDatabase = async () => {
    if (!confirm("Are you sure you want to clear all services and branches? This action cannot be undone.")) {
      return;
    }

    setIsSeeding(true);
    try {
      const result = await clearDatabase();
      
      if (result.success) {
        toast({
          title: "Database Cleared Successfully! 🗑️",
          description: "All services and branches have been removed",
        });
        refetch(); // Refresh the list
      } else {
        toast({
          title: "Error Clearing Database",
          description: result.errors.join(", "),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error clearing database:", error);
      toast({
        title: "Error",
        description: "Failed to clear database",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Access Denied
              </h2>
              <p className="text-gray-600">
                Only admin users can access services management.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Stethoscope className="h-8 w-8" />
            Services Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your clinic services and offerings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Star className="h-4 w-4" />
            {isSeeding ? "Seeding..." : "Seed Data"}
          </Button>
          <Button
            onClick={handleClearDatabase}
            disabled={isSeeding}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">
              All services
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Badge variant="default" className="h-4 w-4 bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(service => service.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Services</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(service => service.isFeatured).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Highlighted services
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(services.map(s => s.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Service categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search services by title, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="md:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="specialty">Specialty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active Only</SelectItem>
                  <SelectItem value="Inactive">Inactive Only</SelectItem>
                  <SelectItem value="Featured">Featured Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredServices.length !== services.length && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredServices.length} of {services.length} services
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Form Modal */}
      {showForm && (
        <ServiceForm
          service={editingService}
          onSubmit={handleServiceSubmit}
          onClose={handleFormClose}
        />
      )}

      {/* Service List */}
      <ServiceList
        services={filteredServices}
        isLoading={isLoading}
        onEdit={handleEditService}
        onDelete={handleServiceDelete}
      />
    </div>
  );
}