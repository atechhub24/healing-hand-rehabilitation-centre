"use client";

import { useState, useEffect, useMemo } from "react";
import { Branch } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Building2, ChevronDown, MapPin, Clock } from "lucide-react";
import useFetch from "@/lib/hooks/use-fetch";
import Link from "next/link";

/**
 * Branch Selector Component
 * 
 * This component displays a dropdown menu in the navigation bar
 * that allows users to select and view different clinic branches.
 * Only shows when there are active branches in the database.
 */
export function BranchSelector() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Fetch active branches from Firebase
  const [branchesData, isLoading] = useFetch<Record<string, Branch>>(
    "branches",
    { needRaw: true }
  );

  // Convert branches data to array and filter active branches
  const activeBranches = useMemo(() => {
    return branchesData 
      ? Object.entries(branchesData)
          .map(([, branch]) => ({ ...branch }))
          .filter(branch => branch.isActive)
      : [];
  }, [branchesData]);

  // Set default selected branch (first active branch)
  useEffect(() => {
    if (activeBranches.length > 0 && !selectedBranch) {
      setSelectedBranch(activeBranches[0]);
    }
  }, [activeBranches, selectedBranch]);

  // Don't render if no active branches or still loading
  if (isLoading || activeBranches.length === 0) {
    return null;
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 min-w-[200px] justify-between"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline-block">
              {selectedBranch ? selectedBranch.name : "Select Branch"}
            </span>
            <span className="sm:hidden">Branch</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80" align="start">
        <div className="p-2">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-sm">Our Branches</span>
            <Badge variant="secondary" className="text-xs">
              {activeBranches.length} Location{activeBranches.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="space-y-2">
            {activeBranches.map((branch) => (
              <DropdownMenuItem
                key={branch.id}
                asChild
                className="p-0"
              >
                <Link 
                  href={`/branches/${branch.id}`}
                  className="flex flex-col p-3 rounded-md hover:bg-gray-50 w-full"
                  onClick={() => setSelectedBranch(branch)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{branch.name}</h4>
                        <Badge 
                          variant="default" 
                          className="bg-green-500 text-white text-xs"
                        >
                          Active
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">
                            {branch.address}, {branch.city}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatTime(branch.timings.startTime)} - {formatTime(branch.timings.endTime)}
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {formatDays(branch.timings.days)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
          
          <div className="mt-3 pt-2 border-t">
            <DropdownMenuItem asChild>
              <Link 
                href="/branches" 
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Building2 className="h-4 w-4" />
                View All Branches
              </Link>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}