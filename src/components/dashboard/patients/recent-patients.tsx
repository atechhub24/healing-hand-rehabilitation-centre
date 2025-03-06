"use client";

import { useCallback, useEffect } from "react";
import Link from "next/link";
import { Patient } from "@/types/patient";
import useFetch from "@/lib/hooks/use-fetch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface RecentPatientsProps {
  role: string;
  onError: (message: string) => void;
}

export default function RecentPatients({ role, onError }: RecentPatientsProps) {
  const [patients, isLoading] = useFetch<Patient[]>("patients");

  // Handle fetch errors
  useEffect(() => {
    if (!patients && !isLoading) {
      onError("Failed to fetch patients data");
    }
  }, [patients, isLoading, onError]);

  // Get the 5 most recent patients
  const recentPatients = useCallback(() => {
    if (!patients) return [];
    return [...patients]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [patients]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                />
              ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Patients</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${role}/patients`} className="flex items-center gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Blood Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentPatients().map((patient) => (
              <TableRow key={patient.uid}>
                <TableCell className="font-medium">
                  <Link
                    href={`/${role}/patients/${patient.uid}`}
                    className="hover:underline"
                  >
                    {patient.name}
                  </Link>
                </TableCell>
                <TableCell>{patient.age} yrs</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{patient.phone}</span>
                    <span className="text-muted-foreground">
                      {patient.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{patient.bloodType || "N/A"}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.status === "active"
                        ? "bg-green-100 text-green-800"
                        : patient.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {patient.status}
                  </span>
                </TableCell>
                <TableCell>
                  {patient.lastVisit
                    ? new Date(patient.lastVisit).toLocaleDateString()
                    : "No visits"}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/${role}/patients/${patient.uid}`}>
                      View Details
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
