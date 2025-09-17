"use client";

import { Service } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, 
  Edit, 
  Trash2,
  MoreHorizontal,
  Star,
  Clock,
  DollarSign,
  Users,
  CheckCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import * as LucideIcons from "lucide-react";

interface ServiceListProps {
  services: Service[];
  isLoading: boolean;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

/**
 * Service List Component
 * 
 * This component displays a list of clinic services in a card layout.
 * It provides options to edit and delete services.
 */
export default function ServiceList({ services, isLoading, onEdit, onDelete }: ServiceListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  // Handle delete confirmation
  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (serviceToDelete) {
      onDelete(serviceToDelete.id);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  // Get icon component dynamically
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || Stethoscope;
    return <IconComponent className="h-5 w-5" />;
  };

  // Format category for display
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors = {
      consultation: "bg-blue-100 text-blue-800",
      diagnostic: "bg-green-100 text-green-800",
      emergency: "bg-red-100 text-red-800",
      support: "bg-purple-100 text-purple-800",
      wellness: "bg-yellow-100 text-yellow-800",
      specialty: "bg-indigo-100 text-indigo-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (services.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first clinic service.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="relative hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getIconComponent(service.icon)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {service.shortDescription}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {service.isFeatured && (
                        <Badge variant="default" className="bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge 
                        variant={service.isActive ? "default" : "secondary"}
                        className={service.isActive ? "bg-green-500" : ""}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(service)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(service)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={getCategoryColor(service.category)}
                    >
                      {formatCategory(service.category)}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Service Details */}
                  <div className="space-y-2">
                    {service.price && service.price > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">₹{service.price}</span>
                      </div>
                    )}
                    
                    {service.duration && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{service.duration} minutes</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                        <CheckCircle className="h-4 w-4" />
                        <span>Features</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {service.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{service.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {service.requirements && service.requirements.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                        <Users className="h-4 w-4" />
                        <span>Requirements</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {service.requirements.slice(0, 2).map((requirement, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {requirement}
                          </Badge>
                        ))}
                        {service.requirements.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{service.requirements.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      Created: {new Date(service.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{serviceToDelete?.title}"? This action cannot be undone.
              All data associated with this service will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}