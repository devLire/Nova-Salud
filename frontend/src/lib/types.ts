export type StockStatus = "normal" | "low" | "critical" | "out";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  presentation: string;
  price: number;
  stock: number;
  minStock: number;
  expiresAt?: string;
  requiresPrescription?: boolean;
}

export interface SaleItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  createdAt: string;
  durationSec: number;
  customerId?: string;
  customer?: string;
}

export interface Alert {
  id: string;
  productId: string;
  level: "low" | "critical" | "out";
  message: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  document: string; // DNI/RUC
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
}
