"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import mutate from "@/lib/firebase/mutate-data";
import { useAuth } from "@/lib/hooks/use-auth";
import useFetch from "@/lib/hooks/use-fetch";
import { useEffect, useRef, useState } from "react";

// Import components
import { InventoryTab } from "./components/InventoryTab";
import { MedicineFormDialog } from "./components/MedicineFormDialog";
import { PurchaseHistoryTab } from "./components/PurchaseHistoryTab";
import { SaleFormDialog } from "./components/SaleFormDialog";
import { SalesHistoryTab } from "./components/SalesHistoryTab";
import { StatsCards } from "./components/StatsCards";

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

export default function PharmacyPage() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMedicineDialogOpen, setIsMedicineDialogOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [selectedMedicineForSale, setSelectedMedicineForSale] =
    useState<Medicine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refs to track previous values to avoid infinite loops
  const prevFetchedMedicines = useRef<Medicine[] | null>(null);
  const prevFetchedSales = useRef<Sale[] | null>(null);
  const prevMedicinesLoading = useRef<boolean>(true);
  const prevSalesLoading = useRef<boolean>(true);

  // Form states
  const [medicineForm, setMedicineForm] = useState<Omit<Medicine, "id">>({
    name: "",
    price: 0,
    expiryDate: "",
    quantity: 0,
    purchaseDate: "",
    purchasePrice: 0,
    purchaseBillNumber: "",
    shopName: "",
    description: "",
    category: "Other",
  });

  const [saleForm, setSaleForm] = useState<Omit<Sale, "id" | "medicineName">>({
    medicineId: "",
    quantity: 1,
    totalPrice: 0,
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    paymentMethod: "Cash",
    saleDate: new Date().toISOString().split("T")[0],
  });

  // Fetch medicines and sales
  const [fetchedMedicines, medicinesLoading] = useFetch<Medicine[]>(
    user ? `pharmacy/medicines/${user.uid}` : ""
  );
  const [fetchedSales, salesLoading] = useFetch<Sale[]>(
    user ? `pharmacy/sales/${user.uid}` : ""
  );

  useEffect(() => {
    // Check if values actually changed to prevent infinite loops
    // Instead of comparing objects directly, compare their JSON representations
    const currentMedicinesJSON = fetchedMedicines
      ? JSON.stringify(fetchedMedicines)
      : null;
    const prevMedicinesJSON = prevFetchedMedicines.current
      ? JSON.stringify(prevFetchedMedicines.current)
      : null;
    const medicinesChanged =
      currentMedicinesJSON !== prevMedicinesJSON ||
      prevMedicinesLoading.current !== medicinesLoading;

    const currentSalesJSON = fetchedSales ? JSON.stringify(fetchedSales) : null;
    const prevSalesJSON = prevFetchedSales.current
      ? JSON.stringify(prevFetchedSales.current)
      : null;
    const salesChanged =
      currentSalesJSON !== prevSalesJSON ||
      prevSalesLoading.current !== salesLoading;

    if (medicinesChanged && fetchedMedicines && !medicinesLoading) {
      setMedicines(Array.isArray(fetchedMedicines) ? fetchedMedicines : []);
      prevFetchedMedicines.current = fetchedMedicines; // Store the actual reference
    }

    if (salesChanged && fetchedSales && !salesLoading) {
      setSales(Array.isArray(fetchedSales) ? fetchedSales : []);
      prevFetchedSales.current = fetchedSales; // Store the actual reference
    }

    if (
      prevMedicinesLoading.current !== medicinesLoading ||
      prevSalesLoading.current !== salesLoading
    ) {
      if (!medicinesLoading && !salesLoading) {
        setIsLoading(false);
      }
    }

    // Update the refs for next comparison
    prevMedicinesLoading.current = medicinesLoading;
    prevSalesLoading.current = salesLoading;
  }, [fetchedMedicines, fetchedSales, medicinesLoading, salesLoading]);

  // Handle medicine form changes

  // Handle sale form changes
  const handleSaleFormChange = (
    field: keyof Omit<Sale, "id" | "medicineName">,
    value: string | number
  ) => {
    setSaleForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle medicine form submit
  const handleMedicineSubmit = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const medicineData = {
        ...medicineForm,
        price: Number(medicineForm.price),
        quantity: Number(medicineForm.quantity),
        purchasePrice: Number(medicineForm.purchasePrice),
      };

      if (editingMedicine && editingMedicine.id) {
        // Update existing medicine
        const result = await mutate({
          path: `pharmacy/medicines/${user.uid}/${editingMedicine.id}`,
          data: medicineData as Record<string, unknown>,
          action: "update",
        });

        if (result.success) {
          toast({
            title: "Success",
            description: "Medicine updated successfully!",
          });
        } else {
          throw new Error(result.error || "Failed to update medicine");
        }
      } else {
        // Create new medicine
        const result = await mutate({
          path: `pharmacy/medicines/${user.uid}`,
          data: medicineData as Record<string, unknown>,
          action: "createWithId",
        });

        if (result.success) {
          toast({
            title: "Success",
            description: "Medicine added successfully!",
          });
        } else {
          throw new Error(result.error || "Failed to add medicine");
        }
      }

      // Reset form and close dialog
      resetMedicineForm();
      setIsMedicineDialogOpen(false);
    } catch (error) {
      console.error("Error saving medicine:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save medicine",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sale form submit
  const handleSaleSubmit = async () => {
    if (!user || !selectedMedicineForSale) return;

    try {
      setIsLoading(true);

      // Validate quantity
      if (saleForm.quantity > selectedMedicineForSale.quantity) {
        toast({
          title: "Error",
          description: "Not enough quantity in stock",
          variant: "destructive",
        });
        return;
      }

      const saleData = {
        ...saleForm,
        medicineId: selectedMedicineForSale.id || "",
        medicineName: selectedMedicineForSale.name,
        quantity: Number(saleForm.quantity),
        totalPrice: Number(saleForm.totalPrice),
      };

      // Create sale record
      const saleResult = await mutate({
        path: `pharmacy/sales/${user.uid}`,
        data: saleData as Record<string, unknown>,
        action: "createWithId",
      });

      if (!saleResult.success) {
        throw new Error(saleResult.error || "Failed to record sale");
      }

      // Update medicine quantity
      const updatedQuantity =
        selectedMedicineForSale.quantity - saleForm.quantity;
      const updateResult = await mutate({
        path: `pharmacy/medicines/${user.uid}/${selectedMedicineForSale.id}`,
        data: { quantity: updatedQuantity } as Record<string, unknown>,
        action: "update",
      });

      if (!updateResult.success) {
        throw new Error(
          updateResult.error || "Failed to update medicine quantity"
        );
      }

      toast({
        title: "Success",
        description: "Sale recorded successfully!",
      });

      // Reset form and close dialog
      resetSaleForm();
      setIsSaleDialogOpen(false);
    } catch (error) {
      console.error("Error recording sale:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to record sale",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset medicine form
  const resetMedicineForm = () => {
    setMedicineForm({
      name: "",
      price: 0,
      expiryDate: "",
      quantity: 0,
      purchaseDate: "",
      purchasePrice: 0,
      purchaseBillNumber: "",
      shopName: "",
      description: "",
      category: "Other",
    });
    setEditingMedicine(null);
  };

  // Reset sale form
  const resetSaleForm = () => {
    setSaleForm({
      medicineId: "",
      quantity: 1,
      totalPrice: 0,
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      paymentMethod: "Cash",
      saleDate: new Date().toISOString().split("T")[0],
    });
    setSelectedMedicineForSale(null);
  };

  // Open edit medicine dialog
  const openEditMedicineDialog = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setMedicineForm({
      name: medicine.name,
      price: medicine.price,
      expiryDate: medicine.expiryDate,
      quantity: medicine.quantity,
      purchaseDate: medicine.purchaseDate,
      purchasePrice: medicine.purchasePrice,
      purchaseBillNumber: medicine.purchaseBillNumber,
      shopName: medicine.shopName,
      description: medicine.description || "",
      category: medicine.category,
    });
    setIsMedicineDialogOpen(true);
  };

  // Open sale medicine dialog
  const openSaleMedicineDialog = (medicine: Medicine) => {
    setSelectedMedicineForSale(medicine);
    setSaleForm({
      ...saleForm,
      medicineId: medicine.id || "",
      totalPrice: medicine.price,
    });
    setIsSaleDialogOpen(true);
  };

  // Handle delete medicine
  const handleDeleteMedicine = async (medicineId: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const result = await mutate({
        path: `pharmacy/medicines/${user.uid}/${medicineId}`,
        action: "delete",
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Medicine deleted successfully!",
        });
      } else {
        throw new Error(result.error || "Failed to delete medicine");
      }
    } catch (error) {
      console.error("Error deleting medicine:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete medicine",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Pharmacy</h2>
          <p className="text-sm text-muted-foreground">
            Manage medicines, purchases and sales
          </p>
        </div>
        <div className="flex gap-2">
          <SaleFormDialog
            isOpen={isSaleDialogOpen}
            onOpenChange={setIsSaleDialogOpen}
            selectedMedicineForSale={selectedMedicineForSale}
            setSelectedMedicineForSale={setSelectedMedicineForSale}
            saleForm={saleForm}
            setSaleForm={setSaleForm}
            medicines={medicines}
            isLoading={isLoading}
            handleSaleSubmit={handleSaleSubmit}
            resetSaleForm={resetSaleForm}
            handleSaleFormChange={handleSaleFormChange}
          />
          <MedicineFormDialog
            isOpen={isMedicineDialogOpen}
            onOpenChange={setIsMedicineDialogOpen}
            editingMedicine={editingMedicine}
            medicineForm={medicineForm}
            setMedicineForm={setMedicineForm}
            isLoading={isLoading}
            handleMedicineSubmit={handleMedicineSubmit}
            resetMedicineForm={resetMedicineForm}
          />
        </div>
      </div>

      <StatsCards medicines={medicines} sales={sales} />

      {/* Tabs for Inventory, Purchases, and Sales */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Medicine Inventory</TabsTrigger>
          <TabsTrigger value="purchases">Purchase History</TabsTrigger>
          <TabsTrigger value="sales">Sales History</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryTab
            medicines={medicines}
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            openEditMedicineDialog={openEditMedicineDialog}
            openSaleMedicineDialog={openSaleMedicineDialog}
            handleDeleteMedicine={handleDeleteMedicine}
            resetMedicineForm={resetMedicineForm}
            setIsMedicineDialogOpen={setIsMedicineDialogOpen}
          />
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <PurchaseHistoryTab medicines={medicines} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <SalesHistoryTab sales={sales} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
