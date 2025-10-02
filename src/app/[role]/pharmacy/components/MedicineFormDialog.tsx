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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

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

interface MedicineFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingMedicine: Medicine | null;
  medicineForm: Omit<Medicine, "id">;
  setMedicineForm: React.Dispatch<React.SetStateAction<Omit<Medicine, "id">>>;
  isLoading: boolean;
  handleMedicineSubmit: () => void;
  resetMedicineForm: () => void;
}

const MEDICINE_CATEGORIES = [
  "Prescription",
  "Over the Counter",
  "Supplements",
  "Vaccines",
  "Other",
];

export function MedicineFormDialog({
  isOpen,
  onOpenChange,
  editingMedicine,
  medicineForm,
  setMedicineForm,
  isLoading,
  handleMedicineSubmit,
  resetMedicineForm,
}: MedicineFormDialogProps) {
  // Handle medicine form changes
  const handleMedicineFormChange = (
    field: keyof Medicine,
    value: string | number
  ) => {
    setMedicineForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={resetMedicineForm}>
          <Plus className="h-4 w-4 mr-2" />
          {editingMedicine ? "Edit Purchase" : "Add Purchase"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingMedicine ? "Edit Purchase" : "Add New Purchase"}
          </DialogTitle>
          <DialogDescription>
            {editingMedicine
              ? "Update purchase details"
              : "Add a new medicine purchase to your inventory"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Medicine Name *</Label>
            <Input
              id="name"
              value={medicineForm.name}
              onChange={(e) =>
                handleMedicineFormChange("name", e.target.value)
              }
              placeholder="e.g., Paracetamol"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={medicineForm.category}
              onValueChange={(value) =>
                handleMedicineFormChange("category", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {MEDICINE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Selling Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              value={medicineForm.price}
              onChange={(e) =>
                handleMedicineFormChange("price", e.target.value)
              }
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              value={medicineForm.quantity}
              onChange={(e) =>
                handleMedicineFormChange("quantity", e.target.value)
              }
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="expiryDate">Expiry Date *</Label>
            <Input
              id="expiryDate"
              type="date"
              value={medicineForm.expiryDate}
              onChange={(e) =>
                handleMedicineFormChange("expiryDate", e.target.value)
              }
            />
          </div>

          <div>
            <Label htmlFor="purchaseDate">Purchase Date *</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={medicineForm.purchaseDate}
              onChange={(e) =>
                handleMedicineFormChange("purchaseDate", e.target.value)
              }
            />
          </div>

          <div>
            <Label htmlFor="purchasePrice">Purchase Price (₹) *</Label>
            <Input
              id="purchasePrice"
              type="number"
              value={medicineForm.purchasePrice}
              onChange={(e) =>
                handleMedicineFormChange("purchasePrice", e.target.value)
              }
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="purchaseBillNumber">
              Purchase Bill Number *
            </Label>
            <Input
              id="purchaseBillNumber"
              value={medicineForm.purchaseBillNumber}
              onChange={(e) =>
                handleMedicineFormChange(
                  "purchaseBillNumber",
                  e.target.value
                )
              }
              placeholder="e.g., BILL-001"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="shopName">Shop Name *</Label>
            <Input
              id="shopName"
              value={medicineForm.shopName}
              onChange={(e) =>
                handleMedicineFormChange("shopName", e.target.value)
              }
              placeholder="e.g., Medical Supplies Store"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={medicineForm.description}
              onChange={(e) =>
                handleMedicineFormChange("description", e.target.value)
              }
              placeholder="Additional details about the medicine..."
              rows={3}
            />
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
            onClick={handleMedicineSubmit}
            disabled={
              isLoading ||
              !medicineForm.name ||
              !medicineForm.price ||
              !medicineForm.quantity
            }
          >
            {isLoading ? "Saving..." : editingMedicine ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}