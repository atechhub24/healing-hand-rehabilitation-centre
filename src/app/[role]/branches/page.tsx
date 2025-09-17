"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { Branch } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, MapPin, Phone, Mail, Clock, User, Star, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BranchForm from "./branch-form";
import BranchList from "./branch-list";
import useFetch from "@/lib/hooks/use-fetch";
import mutate from "@/lib/firebase/mutate-data";
import { seedDatabase, clearDatabase } from "@/lib/seed-database";

/**
 * Branch Management Page Component
 * 
 * This component provides a comprehensive interface for managing clinic branches.
 * It includes functionality to view, add, edit, and delete branches.
 * Only admin users can access this page.
 */
export default function BranchesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Fetch branches from Firebase using useFetch hook
  const [branchesData, isLoading, refetch] = useFetch<Record<string, Branch>>(
    "branches",
    { needRaw: true }
  );

  // Convert branches data to array format
  const branches = branchesData ? Object.entries(branchesData).map(([id, branch]) => ({
    id,
    ...branch,
  })) : [];

  // Handle branch creation/update
  const handleBranchSubmit = async (branchData: Omit<Branch, "id" | "createdAt" | "creatorInfo">) => {
    try {
      if (editingBranch) {
        // Update existing branch
        const result = await mutate({
          path: `branches/${editingBranch.id}`,
          data: branchData,
          action: "update",
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to update branch");
        }

        toast({
          title: "Success",
          description: "Branch updated successfully",
        });
      } else {
        // Create new branch
        const result = await mutate({
          path: "branches",
          data: {
            ...branchData,
            createdAt: new Date().toISOString(),
          },
          action: "createWithId",
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to create branch");
        }

        toast({
          title: "Success",
          description: "Branch created successfully",
        });
      }
      
      setShowForm(false);
      setEditingBranch(null);
      refetch(); // Refresh the list using useFetch refetch
    } catch (error) {
      console.error("Error saving branch:", error);
      toast({
        title: "Error",
        description: "Failed to save branch",
        variant: "destructive",
      });
    }
  };

  // Handle branch deletion
  const handleBranchDelete = async (branchId: string) => {
    try {
      const result = await mutate({
        path: `branches/${branchId}`,
        action: "delete",
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to delete branch");
      }

      toast({
        title: "Success",
        description: "Branch deleted successfully",
      });
      refetch(); // Refresh the list using useFetch refetch
    } catch (error) {
      console.error("Error deleting branch:", error);
      toast({
        title: "Error",
        description: "Failed to delete branch",
        variant: "destructive",
      });
    }
  };

  // Handle edit branch
  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    setShowForm(true);
  };

  // Handle form close
  const handleFormClose = () => {
    setShowForm(false);
    setEditingBranch(null);
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
                Only admin users can access branch management.
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
            <Building2 className="h-8 w-8" />
            Branch Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your clinic branches and locations
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
            Add Branch
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
            <p className="text-xs text-muted-foreground">
              All clinic locations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Branches</CardTitle>
            <Badge variant="default" className="h-4 w-4 bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branches.filter(branch => branch.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Branches</CardTitle>
            <Badge variant="secondary" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branches.filter(branch => !branch.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Temporarily closed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Branch Form Modal */}
      {showForm && (
        <BranchForm
          branch={editingBranch}
          onSubmit={handleBranchSubmit}
          onClose={handleFormClose}
        />
      )}

      {/* Branch List */}
      <BranchList
        branches={branches}
        isLoading={isLoading}
        onEdit={handleEditBranch}
        onDelete={handleBranchDelete}
      />
    </div>
  );
}