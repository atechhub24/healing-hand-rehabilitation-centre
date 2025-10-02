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
interface Sale {
  id?: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  paymentMethod: string;
  saleDate: string;
}

interface SalesHistoryTabProps {
  sales: Sale[];
  isLoading: boolean;
}

export function SalesHistoryTab({ sales, isLoading }: SalesHistoryTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading sales...</p>
            </div>
          </div>
        ) : sales.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total Price (₹)</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Sale Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.medicineName}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>{sale.customerPhone}</TableCell>
                    <TableCell>₹{sale.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>{sale.paymentMethod}</TableCell>
                    <TableCell>{format(new Date(sale.saleDate), "dd MMM yyyy")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No sales records found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}