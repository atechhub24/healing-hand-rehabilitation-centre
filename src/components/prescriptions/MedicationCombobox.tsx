"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MEDICATIONS, type MedicationOption } from "@/lib/data/medications";
import useFetch from "@/lib/hooks/use-fetch";
import { useAuth } from "@/lib/hooks/use-auth";
import mutate from "@/lib/firebase/mutate-data";
import { toast } from "@/components/ui/use-toast";

interface MedicationComboboxProps {
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly placeholder?: string;
  readonly className?: string;
}

export function MedicationCombobox({
  value,
  onValueChange,
  placeholder = "Select medication...",
  className,
}: MedicationComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const { user } = useAuth();

  // Fetch medications from Firebase
  const [firebaseMedications, isLoading, refetch] = useFetch<
    MedicationOption[]
  >(user ? `medications/${user.uid}` : "");

  // Combine Firebase medications with default medications
  const allMedications = React.useMemo(() => {
    const firebaseMeds = firebaseMedications || [];
    const defaultMeds = MEDICATIONS || [];

    // Create a map to avoid duplicates (Firebase meds take priority)
    const medicationMap = new Map<string, MedicationOption>();

    // Add default medications first
    defaultMeds.forEach((med) => {
      if (med && med.value && med.label) {
        medicationMap.set(med.value, med);
      }
    });

    // Add Firebase medications (will override defaults if same value)
    firebaseMeds.forEach((med) => {
      if (med && med.value && med.label) {
        medicationMap.set(med.value, med);
      }
    });

    return Array.from(medicationMap.values());
  }, [firebaseMedications]);

  // Filter medications based on search query
  const filteredMedications = React.useMemo(() => {
    if (!searchQuery) return allMedications;

    const lowercaseQuery = searchQuery.toLowerCase();
    return allMedications.filter(
      (med) =>
        med &&
        med.label &&
        med.category &&
        (med.label.toLowerCase().includes(lowercaseQuery) ||
          med.description?.toLowerCase().includes(lowercaseQuery) ||
          med.category.toLowerCase().includes(lowercaseQuery))
    );
  }, [allMedications, searchQuery]);

  // Group filtered medications by category
  const groupedMedications = React.useMemo(() => {
    const groups: Record<string, MedicationOption[]> = {};
    filteredMedications.forEach((medication) => {
      if (!groups[medication.category]) {
        groups[medication.category] = [];
      }
      groups[medication.category].push(medication);
    });
    return groups;
  }, [filteredMedications]);

  const selectedMedication = allMedications.find(
    (medication) => medication.value === value
  );

  // Function to create a new medication
  const createNewMedication = async (medicationName: string) => {
    if (!user || !medicationName.trim()) return;

    setIsCreating(true);
    try {
      const newMedication: MedicationOption = {
        value: medicationName.toLowerCase().replace(/\s+/g, "-"),
        label: medicationName,
        category: "Other",
        commonDosages: [],
        description: "Custom medication",
      };

      const result = await mutate({
        path: `medications/${user.uid}`,
        data: newMedication as unknown as Record<string, unknown>,
        action: "createWithId",
      });

      if (result.success) {
        toast({
          title: "Medication added successfully!",
          description: `${medicationName} has been added to your medication list.`,
        });
        refetch();
        onValueChange(newMedication.value);
        setOpen(false);
      } else {
        throw new Error(result.error || "Failed to create medication");
      }
    } catch (error) {
      console.error("Error creating medication:", error);
      toast({
        title: "Failed to add medication",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedMedication ? selectedMedication.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search medications..."
            className="h-9"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Loading medications...
              </div>
            ) : (
              <>
                <CommandEmpty>
                  <div className="py-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      No medication found.
                    </p>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => createNewMedication(searchQuery)}
                        disabled={isCreating}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {isCreating ? "Adding..." : `Add "${searchQuery}"`}
                      </Button>
                    )}
                  </div>
                </CommandEmpty>

                {Object.entries(groupedMedications).map(
                  ([category, medications]) => (
                    <CommandGroup key={category} heading={category}>
                      {medications.map((medication) => (
                        <CommandItem
                          key={medication.value}
                          value={medication.value}
                          onSelect={(currentValue) => {
                            onValueChange(
                              currentValue === value ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  value === medication.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <span className="font-medium">
                                {medication.label}
                              </span>
                            </div>
                            {medication.description && (
                              <span className="text-xs text-muted-foreground ml-6">
                                {medication.description}
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )
                )}

                {/* Show "Add new medication" option when there's a search query and no exact match */}
                {searchQuery && filteredMedications.length === 0 && (
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => createNewMedication(searchQuery)}
                      disabled={isCreating}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      <span className="font-medium">
                        {isCreating ? "Adding..." : `Add "${searchQuery}"`}
                      </span>
                    </CommandItem>
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
