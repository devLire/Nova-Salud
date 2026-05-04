import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockProducts } from "@/data/mockProducts";
import { mockCustomers } from "@/data/mockCustomers";
import type { Product, Sale, SaleItem, Alert, Customer } from "@/lib/types";

export type StockState = "normal" | "low" | "critical" | "out";

export const getStockState = (p: Product): StockState => {
  if (p.stock <= 0) return "out";
  if (p.stock <= Math.max(1, Math.floor(p.minStock * 0.3))) return "critical";
  if (p.stock < p.minStock) return "low";
  return "normal";
};

interface PharmacyState {
  products: Product[];
  sales: Sale[];
  alerts: Alert[];
  customers: Customer[];
  errorsAvoided: number;

  updateProduct: (id: string, patch: Partial<Product>) => void;
  addProduct: (p: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;

  addCustomer: (c: Omit<Customer, "id" | "createdAt">) => Customer;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  registerSale: (items: SaleItem[], durationSec: number, customerId?: string) => Sale;
  refreshAlerts: () => void;
  resetDemo: () => void;
}

const buildAlerts = (products: Product[]): Alert[] => {
  const now = new Date().toISOString();
  return products
    .map((p) => {
      const s = getStockState(p);
      if (s === "normal") return null;
      const level: Alert["level"] = s === "out" ? "out" : s === "critical" ? "critical" : "low";
      const message =
        s === "out"
          ? `Sin stock: ${p.name}`
          : s === "critical"
          ? `Stock crítico (${p.stock}) — ${p.name}`
          : `Stock bajo (${p.stock}/${p.minStock}) — ${p.name}`;
      return { id: `a-${p.id}`, productId: p.id, level, message, createdAt: now } as Alert;
    })
    .filter(Boolean) as Alert[];
};

export const usePharmacyStore = create<PharmacyState>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      sales: [],
      alerts: buildAlerts(mockProducts),
      customers: mockCustomers,
      errorsAvoided: 0,

      updateProduct: (id, patch) =>
        set((s) => {
          const products = s.products.map((p) => (p.id === id ? { ...p, ...patch } : p));
          return { products, alerts: buildAlerts(products) };
        }),

      addProduct: (p) =>
        set((s) => {
          const newP: Product = { ...p, id: `p-${Date.now()}` };
          const products = [newP, ...s.products];
          return { products, alerts: buildAlerts(products) };
        }),

      deleteProduct: (id) =>
        set((s) => {
          const products = s.products.filter((p) => p.id !== id);
          return { products, alerts: buildAlerts(products) };
        }),

      addCustomer: (c) => {
        const newC: Customer = { ...c, id: `c-${Date.now()}`, createdAt: new Date().toISOString() };
        set((s) => ({ customers: [newC, ...s.customers] }));
        return newC;
      },
      updateCustomer: (id, patch) =>
        set((s) => ({ customers: s.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      deleteCustomer: (id) =>
        set((s) => ({ customers: s.customers.filter((c) => c.id !== id) })),

      registerSale: (items, durationSec, customerId) => {
        const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
        const customer = get().customers.find((c) => c.id === customerId)?.name;
        const sale: Sale = {
          id: `s-${Date.now()}`,
          items,
          total,
          durationSec,
          customerId,
          customer,
          createdAt: new Date().toISOString(),
        };
        set((s) => {
          let errorsAvoided = s.errorsAvoided;
          const products = s.products.map((p) => {
            const sold = items.find((it) => it.productId === p.id);
            if (!sold) return p;
            if (sold.qty > p.stock) errorsAvoided += 1;
            return { ...p, stock: Math.max(0, p.stock - sold.qty) };
          });
          return {
            sales: [sale, ...s.sales],
            products,
            alerts: buildAlerts(products),
            errorsAvoided,
          };
        });
        return sale;
      },

      refreshAlerts: () => set((s) => ({ alerts: buildAlerts(s.products) })),
      resetDemo: () =>
        set({
          products: mockProducts,
          sales: [],
          alerts: buildAlerts(mockProducts),
          customers: mockCustomers,
          errorsAvoided: 0,
        }),
    }),
    {
      name: "nova-salud-store",
      version: 2,
    },
  ),
);
