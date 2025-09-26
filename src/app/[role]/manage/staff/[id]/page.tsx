"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  User,
  Mail,
  Calendar,
  Clock,
  ArrowLeft,
  Briefcase,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import useFetch from "@/lib/hooks/use-fetch";
import { Staff } from "@/types";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | React.ReactNode;
  colorClass?: string;
}

function InfoItem({ icon, label, value, colorClass }: InfoItemProps) {
  return (
    <div className="flex items-start gap-2">
      <div className={cn("mt-1", colorClass || "text-muted-foreground")}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-base font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}

export default function StaffDetailsPage() {
  const router = useRouter();
  const params = useParams();

  // Fetch staff data
  const [staffData, isLoading] = useFetch<Staff>(`users/${params.id}`, {
    needRaw: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!staffData) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Staff not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Staff Details
            </h2>
            <p className="text-sm text-muted-foreground">
              View staff information and appointments
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`${params.id}/edit`)}
        >
          Edit Details
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {staffData.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {staffData.title || "Staff Member"}
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <InfoItem
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={staffData.email}
              />
              {staffData.title && (
                <InfoItem
                  icon={<Briefcase className="h-4 w-4" />}
                  label="Job Title"
                  value={staffData.title}
                />
              )}
              {staffData.phoneNumber && (
                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone Number"
                  value={staffData.phoneNumber}
                />
              )}
            </div>

            <div className="space-y-4">
              <InfoItem
                icon={<Calendar className="h-4 w-4" />}
                label="Member Since"
                value={format(new Date(staffData.createdAt), "PPP")}
              />
              <InfoItem
                icon={<Clock className="h-4 w-4" />}
                label="Last Login"
                value={format(new Date(staffData.lastLogin), "PPP")}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
