"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import RoleStats from "@/components/dashboard/stats/role-stats";
import QuickLinks from "@/components/dashboard/quick-links/quick-links";
import RecentActivity from "@/components/dashboard/activity/recent-activity";
import RecentPatients from "@/components/dashboard/patients/recent-patients";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DashboardPage() {
  const params = useParams();
  const role = params.role as string;
  const [error, setError] = useState<string | null>(null);

  const handleError = (message: string) => {
    setError(message);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening today
        </p>
      </div>

      {/* Stats Section */}
      <section aria-label="Statistics">
        <RoleStats role={role} onError={handleError} />
      </section>

      {/* Quick Links Section */}
      <section aria-label="Quick Links">
        <QuickLinks role={role} onError={handleError} />
      </section>

      {/* Recent Patients Section */}
      <section aria-label="Recent Patients">
        <RecentPatients role={role} onError={handleError} />
      </section>

      {/* Recent Activity Section */}
      <section aria-label="Recent Activity">
        <RecentActivity role={role} onError={handleError} />
      </section>

      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setError(null)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
