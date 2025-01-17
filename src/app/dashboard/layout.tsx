"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, role, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || !role) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-xl font-bold">Healthcare App</h2>
        </div>
        <nav className="mt-8">
          <ul className="space-y-2">
            <li>
              <a
                href="/dashboard"
                className="block px-4 py-2 hover:bg-gray-700"
              >
                Dashboard
              </a>
            </li>
            {role === "admin" && (
              <>
                <li>
                  <a
                    href="/dashboard/users"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    User Management
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard/analytics"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Analytics
                  </a>
                </li>
              </>
            )}
            {(role === "doctor" || role === "paramedic") && (
              <>
                <li>
                  <a
                    href="/dashboard/appointments"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Appointments
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard/patients"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Patients
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard/availability"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Availability
                  </a>
                </li>
              </>
            )}
            {role === "lab" && (
              <>
                <li>
                  <a
                    href="/dashboard/tests"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Test Orders
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard/catalog"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Test Catalog
                  </a>
                </li>
              </>
            )}
            {role === "customer" && (
              <>
                <li>
                  <a
                    href="/dashboard/bookings"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    My Bookings
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard/records"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Medical Records
                  </a>
                </li>
              </>
            )}
            <li>
              <a
                href="/dashboard/profile"
                className="block px-4 py-2 hover:bg-gray-700"
              >
                Profile
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
