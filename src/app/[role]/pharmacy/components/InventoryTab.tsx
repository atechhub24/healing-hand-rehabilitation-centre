"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Edit, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";

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

interface InventoryTabProps {
  medicines: Medicine[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  openEditMedicineDialog: (medicine: Medicine) => void;
  openSaleMedicineDialog: (medicine: Medicine) => void;
  handleDeleteMedicine: (medicineId: string) => void;
  resetMedicineForm: () => void;
  setIsMedicineDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function InventoryTab({
  medicines,
  isLoading,
  searchQuery,
  setSearchQuery,
  openEditMedicineDialog,
  openSaleMedicineDialog,
  handleDeleteMedicine,
  resetMedicineForm,
  setIsMedicineDialogOpen,
}: InventoryTabProps) {
  // Filter medicines based on search
  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.shopName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Medicine Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Medicine Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading medicines...</p>
              </div>
            </div>
          ) : filteredMedicines.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Shop</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicines.map((medicine) => (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-medium">
                        {medicine.name}
                      </TableCell>
                      <TableCell>{medicine.category}</TableCell>
                      <TableCell>₹{medicine.price.toFixed(2)}</TableCell>
                      <TableCell>{medicine.quantity}</TableCell>
                      <TableCell>
                        {format(new Date(medicine.expiryDate), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>{medicine.shopName}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openSaleMedicineDialog(medicine)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditMedicineDialog(medicine)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              medicine.id && handleDeleteMedicine(medicine.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No medicines found matching your search"
                  : "No medicines in inventory"}
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  resetMedicineForm();
                  setIsMedicineDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Medicine
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
