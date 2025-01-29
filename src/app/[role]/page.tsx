"use client";

import { useParams } from "next/navigation";
import RoleStats from "@/components/dashboard/stats/role-stats";
import QuickLinks from "@/components/dashboard/quick-links/quick-links";
import RecentActivity from "@/components/dashboard/activity/recent-activity";

export default function DashboardPage() {
  const params = useParams();
  const role = params.role as string;

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
        <RoleStats role={role} />
      </section>

      {/* Quick Links Section */}
      <section aria-label="Quick Links">
        <QuickLinks role={role} />
      </section>

      {/* Recent Activity Section */}
      <section aria-label="Recent Activity">
        <RecentActivity role={role} />
      </section>
    </div>
  );
}
