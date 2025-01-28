"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { Package, AlertTriangle, ArrowDown, ArrowUp } from "lucide-react";

const inventory: InventoryItem[] = [
  {
    id: 1,
    name: "Blood Collection Tubes",
    category: "Collection Supplies",
    currentStock: 500,
    minRequired: 100,
    status: "in-stock",
    lastUpdated: "2024-01-20",
    unit: "pieces",
  },
  {
    id: 2,
    name: "Test Reagent A",
    category: "Reagents",
    currentStock: 50,
    minRequired: 75,
    status: "low-stock",
    lastUpdated: "2024-01-21",
    unit: "ml",
  },
  {
    id: 3,
    name: "Microscope Slides",
    category: "Lab Equipment",
    currentStock: 1000,
    minRequired: 200,
    status: "in-stock",
    lastUpdated: "2024-01-19",
    unit: "pieces",
  },
  // Add more inventory items as needed
];

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minRequired: number;
  status: "in-stock" | "low-stock";
  lastUpdated: string;
  unit: string;
}

function InventoryCard({ item }: { item: InventoryItem }) {
  const isLowStock = item.currentStock <= item.minRequired;

  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Package className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.category}</p>
          </div>
        </div>
        {isLowStock && (
          <div className="flex items-center gap-1 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-medium">Low Stock</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Current Stock</p>
            <p className="text-lg font-semibold text-gray-900">
              {item.currentStock} {item.unit}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Min Required</p>
            <p className="text-lg font-semibold text-gray-900">
              {item.minRequired} {item.unit}
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Last updated: {item.lastUpdated}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
          <ArrowUp className="h-4 w-4" />
          Add Stock
        </button>
        <button className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
          <ArrowDown className="h-4 w-4" />
          Remove Stock
        </button>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const { role } = useAuth();

  if (role !== "lab") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Inventory</h2>
          <p className="text-sm text-gray-500">
            Manage laboratory supplies and equipment
          </p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Categories</option>
            <option value="collection">Collection Supplies</option>
            <option value="reagents">Reagents</option>
            <option value="equipment">Lab Equipment</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add New Item
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {inventory.map((item) => (
          <InventoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
