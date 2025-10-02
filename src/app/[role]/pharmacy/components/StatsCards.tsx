"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, ShoppingCart, DollarSign } from "lucide-react";
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

interface StatsCardsProps {
  medicines: Medicine[];
  sales: Sale[];
}

export function StatsCards({ medicines, sales }: StatsCardsProps) {
  // Calculate total sales amount
  const totalSalesAmount = sales.reduce(
    (sum, sale) => sum + sale.totalPrice,
    0
  );

  // Calculate total medicines in stock
  const totalMedicinesInStock = medicines.reduce(
    (sum, medicine) => sum + medicine.quantity,
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Medicines
          </CardTitle>
          <Pill className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{medicines.length}</div>
          <p className="text-xs text-muted-foreground">
            Medicine types in inventory
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Stock</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMedicinesInStock}</div>
          <p className="text-xs text-muted-foreground">
            Total units available
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{totalSalesAmount.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Revenue from sales</p>
        </CardContent>
      </Card>
    </div>
  );
}