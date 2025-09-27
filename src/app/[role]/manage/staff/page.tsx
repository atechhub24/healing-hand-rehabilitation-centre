"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { deleteUser } from "@/lib/firebase/delete-user";
import mutateData from "@/lib/firebase/mutate-data";
import useFetch from "@/lib/hooks/use-fetch";
import { Plus, Trash, Edit, Eye, Copy } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@ashirbad/js-core";

interface Staff {
  uid: string;
  name: string;
  email: string;
  password?: string;
  title?: string; // Job title/position
  phoneNumber?: string;
  role: string;
  createdAt?: string;
  lastLogin?: string;
  // Optional fields
  joiningDate?: string; // ISO date (yyyy-mm-dd)
  salary?: number; // monthly salary
}

export default function StaffPage() {
  const { role } = useParams();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [viewStaff, setViewStaff] = useState<Staff | null>(null);

  const [staffMembers, isLoading] = useFetch<Staff[]>("users", {
    filter: (item: unknown) => {
      const staff = item as Staff;
      return staff.role === "staff";
    },
  });

  // Filter staff members based on search term
  const filteredStaff = staffMembers?.filter((staff) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      staff.name?.toLowerCase().includes(searchLower) ||
      staff.email?.toLowerCase().includes(searchLower) ||
      staff.title?.toLowerCase().includes(searchLower) ||
      staff.phoneNumber?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (staff: Staff) => {
    if (!staff.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Cannot delete user without password. Please try again later.",
      });
      return;
    }

    setStaffToDelete(staff);
  };

  const confirmDelete = async () => {
    if (!staffToDelete) return;

    setIsDeleting(staffToDelete.uid);
    try {
      // First delete the user authentication
      await deleteUser(staffToDelete.email, staffToDelete.password!);

      // Then remove the user data from the database
      await mutateData({
        path: `/users/${staffToDelete.uid}`,
        action: "delete",
      });

      toast({
        title: "Success",
        description: "Staff deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete staff. Please try again.",
      });
    }
    setIsDeleting(null);
    setStaffToDelete(null);
  };

  return (
    <>
      {/* View Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Staff Details</DialogTitle>
            <DialogDescription>
              Full information about the staff member.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <div className="text-muted-foreground">Name</div>
              <div className="font-medium">{viewStaff?.name ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Email</div>
              <div className="font-medium break-all">
                {viewStaff?.email ?? "-"}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Title</div>
              <div className="font-medium">{viewStaff?.title ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Phone</div>
              <div className="font-medium">{viewStaff?.phoneNumber ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Joining Date</div>
              <div className="font-medium">{viewStaff?.joiningDate ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Salary</div>
              <div className="font-medium">
                {typeof viewStaff?.salary === "number"
                  ? formatCurrency(viewStaff!.salary)
                  : "-"}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Created At</div>
              <div className="font-medium">{viewStaff?.createdAt ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Last Login</div>
              <div className="font-medium">{viewStaff?.lastLogin ?? "-"}</div>
            </div>
            {/* Removed User ID from details per request */}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!staffToDelete}
        onOpenChange={() => setStaffToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {staffToDelete?.name}
              </span>
              &apos;s account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Staff Management
          </h1>
          <Link href={`/${role}/manage/staff/new`}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add New Staff
            </Button>
          </Link>
        </div>

        <div className="mb-4">
          <Input
            type="search"
            placeholder="Search by name, title, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="bg-card rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-muted-foreground"
                    >
                      Loading staff...
                    </td>
                  </tr>
                ) : !filteredStaff ||
                  (Array.isArray(filteredStaff) &&
                    filteredStaff.length === 0) ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-muted-foreground"
                    >
                      {searchTerm
                        ? "No staff found matching your search"
                        : "No staff found"}
                    </td>
                  </tr>
                ) : (
                  filteredStaff?.map((staff) => (
                    <tr key={staff.uid} className="hover:bg-muted/50">
                      <td className="px-6 py-4 text-foreground">
                        {staff.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {staff.title || "Not specified"}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        <div className="flex items-center gap-2">
                          <span>{staff.email}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(staff.email);
                              toast({
                                title: "Email Copied",
                                description: "Email address has been copied to clipboard",
                              });
                            }}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {staff.phoneNumber || "Not provided"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setViewStaff(staff);
                              setDetailsOpen(true);
                            }}
                            className="text-foreground hover:bg-muted"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Link
                            href={`/${role}/manage/staff/${staff.uid}/edit`}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            onClick={() => handleDelete(staff)}
                            disabled={isDeleting === staff.uid}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
