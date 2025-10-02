"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

// Define types
interface Medicine {
  id?: string;
  name: string;
  price: number;
  expiryDate: string;
  quantity: number;
  purchaseDate: string;
  purchasePrice: number;
  purchaseBillNumber: string;
  shopName: string;
  description?: string;
  category: string;
}

interface PurchaseHistoryTabProps {
  medicines: Medicine[];
  isLoading: boolean;
}

export function PurchaseHistoryTab({ medicines, isLoading }: PurchaseHistoryTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading purchases...</p>
            </div>
          </div>
        ) : medicines.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Purchase Price (₹)</TableHead>
                  <TableHead>Total Cost (₹)</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Shop Name</TableHead>
                  <TableHead>Bill Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>{medicine.category}</TableCell>
                    <TableCell>{medicine.quantity}</TableCell>
                    <TableCell>₹{medicine.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell>₹{(medicine.purchasePrice * medicine.quantity).toFixed(2)}</TableCell>
                    <TableCell>{format(new Date(medicine.purchaseDate), "dd MMM yyyy")}</TableCell>
                    <TableCell>{medicine.shopName}</TableCell>
                    <TableCell>{medicine.purchaseBillNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No purchase records found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}