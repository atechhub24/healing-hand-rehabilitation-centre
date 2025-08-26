"use client";

import { EditMedicationDialog } from "@/components/medications/EditMedicationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  type MedicationOption,
  MEDICATION_CATEGORIES,
} from "@/lib/data/medications";
import mutate from "@/lib/firebase/mutate-data";
import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

type FirebaseMedication = MedicationOption & { id: string };

export default function MedicationsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [editingMedication, setEditingMedication] =
    useState<MedicationOption | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch medications from Firebase
  const [medications, isLoading, refetch] = useFetch<FirebaseMedication[]>(
    user ? `medications/${user.uid}` : ""
  );

  // Ensure medications is always an array and filter out invalid entries
  const safeMedications = useMemo(() => {
    if (!Array.isArray(medications)) return [];
    return medications.filter(
      (med) => med && med.value && med.label && med.category
    );
  }, [medications]);

  // Filter medications based on search and category
  const filteredMedications = useMemo(() => {
    let filtered = safeMedications;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((med) => med.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (med) =>
          med.label.toLowerCase().includes(lowercaseQuery) ||
          med.description?.toLowerCase().includes(lowercaseQuery) ||
          med.category.toLowerCase().includes(lowercaseQuery)
      );
    }

    return filtered;
  }, [safeMedications, searchQuery, selectedCategory]);

  const handleDelete = async (medication: MedicationOption) => {
    if (!user) return;

    try {
      // Find the medication ID in Firebase from the fetched array (items include an id)
      const medsArray: FirebaseMedication[] = Array.isArray(medications)
        ? medications
        : [];
      const matched = medsArray.find((m) => m && m.value === medication.value);
      const medicationId = matched?.id as string | undefined;

      if (!medicationId) {
        throw new Error("Medication not found in database");
      }

      const result = await mutate({
        path: `medications/${user.uid}/${medicationId}`,
        action: "delete",
      });

      if (result.success) {
        refetch();
        toast({
          title: "Medication deleted successfully!",
        });
      } else {
        throw new Error(result.error || "Failed to delete medication");
      }
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast({
        title: "Failed to delete medication",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleNewMedication = () => {
    setEditingMedication(null);
    setIsEditDialogOpen(true);
  };

  const handleEditMedication = (medication: MedicationOption) => {
    setEditingMedication(medication);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingMedication(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Medications
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your medication database
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            Refresh
          </Button>
          <Button onClick={handleNewMedication}>
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("All")}
          >
            All
          </Button>
          {MEDICATION_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Medications List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading medications...</p>
          </div>
        </div>
      ) : (
        <>
          {filteredMedications.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMedications.map((medication) => (
                <MedicationCard
                  key={medication.value}
                  medication={medication}
                  onDelete={handleDelete}
                  onEdit={handleEditMedication}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== "All"
                  ? "No medications found matching your criteria"
                  : "No medications found"}
              </p>
              <Button onClick={handleRefresh} variant="outline">
                Refresh
              </Button>
            </div>
          )}
        </>
      )}

      {/* Edit Medication Dialog */}
      <EditMedicationDialog
        medication={editingMedication}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={refetch}
      />
    </div>
  );
}

// Medication Card Component
interface MedicationCardProps {
  medication: MedicationOption;
  onDelete: (medication: MedicationOption) => void;
  onEdit: (medication: MedicationOption) => void;
}

function MedicationCard({ medication, onDelete, onEdit }: MedicationCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    if (showDeleteConfirm) {
      onDelete(medication);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{medication.label}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {medication.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {medication.description && (
          <div>
            <h4 className="font-semibold text-sm mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">
              {medication.description}
            </p>
          </div>
        )}

        {/* Common Dosages removed per requirement */}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(medication)}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteClick}
            className={`flex-1 ${
              showDeleteConfirm ? "bg-red-100 text-red-700 border-red-300" : ""
            }`}
          >
            {showDeleteConfirm ? "Click to Confirm" : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
