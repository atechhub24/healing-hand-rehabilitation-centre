"use client";

import { useState, useEffect, useRef } from "react";
import { Branch } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  ChevronDown,
  MapPin,
  Clock,
  Phone,
  Star,
  X,
} from "lucide-react";
import useFetch from "@/lib/hooks/use-fetch";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Mega Menu Component for Branch Selection
 *
 * A responsive mega menu that displays clinic branches in a grid layout
 * with detailed information including location, timings, and contact details.
 */
export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch active branches from Firebase
  const [branchesData, isLoading] = useFetch<Record<string, Branch>>(
    "branches",
    { needRaw: true }
  );

  // Convert branches data to array and filter active branches
  const activeBranches = branchesData
    ? Object.entries(branchesData)
        .map(([serviceId, branch]) => ({ ...branch, id: serviceId }))
        .filter((branch) => branch.isActive)
    : [];

  // Limit to first 3 branches for mega menu display
  const displayBranches = activeBranches.slice(0, 3);
  const hasMoreBranches = activeBranches.length > 3;

  // Set default selected branch (first active branch)
  useEffect(() => {
    if (activeBranches.length > 0 && !selectedBranch) {
      setSelectedBranch(activeBranches[0]);
    }
  }, [activeBranches, selectedBranch]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Don't render if no active branches or still loading
  if (isLoading || activeBranches.length === 0) {
    return null;
  }

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Format days for display
  const formatDays = (days: string[]) => {
    if (days.length === 0) return "Closed";
    if (days.length === 7) return "Every day";
    if (days.length === 6 && !days.includes("Sunday")) {
      return "Monday - Saturday";
    }
    if (
      days.length === 5 &&
      !days.includes("Saturday") &&
      !days.includes("Sunday")
    ) {
      return "Monday - Friday";
    }
    return days.join(", ");
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <Button
        variant="outline"
        className={cn(
          "flex items-center gap-2 min-w-[180px] justify-between transition-all duration-200",
          isOpen && "ring-2 ring-blue-500 ring-offset-2"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-blue-600" />
          <span className="hidden sm:inline-block font-medium">
            {selectedBranch ? selectedBranch.name : "Our Branches"}
          </span>
          <span className="sm:hidden font-medium">Branches</span>
          <Badge variant="secondary" className="text-xs hidden md:inline-flex">
            {activeBranches.length}
          </Badge>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      {/* Mega Menu Content */}
      {isOpen ? (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/5 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 z-50 w-[95vw] max-w-3xl bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Our Branches
                    </h3>
                    <p className="text-sm text-gray-600">
                      {activeBranches.length} location
                      {activeBranches.length !== 1 ? "s" : ""} available
                      {hasMoreBranches && (
                        <span className="text-blue-600 ml-1">
                          (showing {displayBranches.length})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Branches Grid */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {displayBranches.map((branch, index) => (
                  <Link
                    key={branch.id}
                    href={`/branches/${branch.id}`}
                    className="group block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white hover:bg-blue-50"
                    onClick={() => {
                      setSelectedBranch(branch);
                      setIsOpen(false);
                    }}
                  >
                    {/* Branch Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {branch.name}
                          </h4>
                          {index === 0 ? (
                            <Badge
                              variant="default"
                              className="bg-yellow-500 text-white text-xs"
                            >
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          ) : (
                            <Badge
                              variant="default"
                              className="bg-green-500 text-white text-xs"
                            >
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Branch Details */}
                    <div className="space-y-2 text-sm">
                      {/* Address */}
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                        <span className="line-clamp-2">
                          {branch.address}, {branch.city}
                        </span>
                      </div>

                      {/* Timings */}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span>
                          {formatTime(branch.timings.startTime)} -{" "}
                          {formatTime(branch.timings.endTime)}
                        </span>
                      </div>

                      {/* Days */}
                      <div className="text-xs text-gray-500 pl-6">
                        {formatDays(branch.timings.days)}
                      </div>

                      {/* Phone (if available) */}
                      {branch.phone ? (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                          <span className="text-sm">{branch.phone}</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Hover Effect */}
                    <div className="mt-3 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view details →
                    </div>
                  </Link>
                ))}

                {/* More Branches Indicator */}
                {hasMoreBranches && (
                  <Link
                    href="/branches"
                    className="group block p-4 rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 bg-blue-50/30"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex flex-col items-center justify-center text-center h-full min-h-[120px]">
                      <div className="p-3 bg-blue-100 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-blue-700 mb-1">
                        +{activeBranches.length - displayBranches.length} More
                        Locations
                      </h4>
                      <p className="text-sm text-blue-600">
                        Click to view all branches
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-gray-600">
                  {hasMoreBranches
                    ? `Showing ${displayBranches.length} of ${activeBranches.length} locations`
                    : "Need help choosing? Contact our support team."}
                </div>
                <div className="flex items-center gap-2">
                  {hasMoreBranches ? (
                    <Link
                      href="/branches"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Building2 className="h-4 w-4" />
                      View All {activeBranches.length} Branches
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/branches"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        View All Branches
                      </Link>
                      <span className="text-gray-300">|</span>
                      <Link
                        href="/contact"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Contact Us
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
