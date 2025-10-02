"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart } from "lucide-react";

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

interface SaleFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMedicineForSale: Medicine | null;
  setSelectedMedicineForSale: React.Dispatch<
    React.SetStateAction<Medicine | null>
  >;
  saleForm: Omit<Sale, "id" | "medicineName">;
  setSaleForm: React.Dispatch<
    React.SetStateAction<Omit<Sale, "id" | "medicineName">>
  >;
  medicines: Medicine[];
  isLoading: boolean;
  handleSaleSubmit: () => void;
  resetSaleForm: () => void;
  handleSaleFormChange: (
    field: keyof Omit<Sale, "id" | "medicineName">,
    value: string | number
  ) => void;
}

export function SaleFormDialog({
  isOpen,
  onOpenChange,
  selectedMedicineForSale,
  setSelectedMedicineForSale,
  saleForm,
  setSaleForm,
  medicines,
  isLoading,
  handleSaleSubmit,

  handleSaleFormChange,
}: SaleFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Record Sale
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Medicine Sale Form</DialogTitle>
          <DialogDescription>
            Fill in the details for the medicine sale
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="medicineSelect">Medicine Name *</Label>
            <Select
              value={selectedMedicineForSale?.id || ""}
              onValueChange={(value) => {
                const selectedMed = medicines.find((m) => m.id === value);
                if (selectedMed) {
                  setSelectedMedicineForSale(selectedMed);
                  setSaleForm((prev) => ({
                    ...prev,
                    medicineId: selectedMed.id || "",
                    totalPrice: selectedMed.price * prev.quantity,
                  }));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select medicine" />
              </SelectTrigger>
              <SelectContent>
                {medicines.map((medicine) => (
                  <SelectItem key={medicine.id} value={medicine.id || ""}>
                    {medicine.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="customerName">Sale To Whom *</Label>
            <Input
              id="customerName"
              value={saleForm.customerName}
              onChange={(e) =>
                handleSaleFormChange("customerName", e.target.value)
              }
              placeholder="Customer name"
            />
          </div>

          <div>
            <Label htmlFor="customerPhone">Customer Phone *</Label>
            <Input
              id="customerPhone"
              value={saleForm.customerPhone}
              onChange={(e) =>
                handleSaleFormChange("customerPhone", e.target.value)
              }
              placeholder="Customer phone number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={selectedMedicineForSale?.quantity || 0}
                value={saleForm.quantity}
                onChange={(e) => {
                  const quantity = Number(e.target.value);
                  handleSaleFormChange("quantity", quantity);
                  if (selectedMedicineForSale) {
                    handleSaleFormChange(
                      "totalPrice",
                      quantity * selectedMedicineForSale.price
                    );
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="saleDate">Sale Date *</Label>
              <Input
                id="saleDate"
                type="date"
                value={saleForm.saleDate}
                onChange={(e) =>
                  handleSaleFormChange("saleDate", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pricePerUnit">Sale Price Per Unit (₹)</Label>
              <Input
                id="pricePerUnit"
                type="number"
                value={selectedMedicineForSale?.price || 0}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="totalPrice">Total Price (₹)</Label>
              <Input
                id="totalPrice"
                type="number"
                value={saleForm.totalPrice}
                readOnly
              />
            </div>
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select
              value={saleForm.paymentMethod}
              onValueChange={(value) =>
                handleSaleFormChange("paymentMethod", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="online">Online Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaleSubmit}
            disabled={
              isLoading ||
              !saleForm.customerName ||
              !saleForm.customerPhone ||
              !saleForm.paymentMethod ||
              !selectedMedicineForSale ||
              saleForm.quantity <= 0 ||
              saleForm.quantity > (selectedMedicineForSale?.quantity || 0)
            }
          >
            {isLoading ? "Processing..." : "Record Sale"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
