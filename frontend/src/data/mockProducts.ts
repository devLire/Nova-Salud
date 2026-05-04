import type { Product } from "@/lib/types";

export const mockProducts: Product[] = [
  { id: "p1", sku: "PAR-500", name: "Paracetamol 500mg", category: "Analgésicos", presentation: "Caja x 100 tabletas", price: 0.30, stock: 240, minStock: 50 },
  { id: "p2", sku: "IBU-400", name: "Ibuprofeno 400mg", category: "Analgésicos", presentation: "Caja x 50 tabletas", price: 0.50, stock: 18, minStock: 30 },
  { id: "p3", sku: "AMX-500", name: "Amoxicilina 500mg", category: "Antibióticos", presentation: "Caja x 21 cápsulas", price: 1.20, stock: 4, minStock: 15, requiresPrescription: true },
  { id: "p4", sku: "LOR-10", name: "Loratadina 10mg", category: "Antialérgicos", presentation: "Blister x 10", price: 0.80, stock: 72, minStock: 25 },
  { id: "p5", sku: "OME-20", name: "Omeprazol 20mg", category: "Gastrointestinal", presentation: "Caja x 30 cápsulas", price: 0.90, stock: 0, minStock: 20 },
  { id: "p6", sku: "VIT-C", name: "Vitamina C 1g efervescente", category: "Vitaminas", presentation: "Tubo x 10", price: 4.50, stock: 35, minStock: 15 },
  { id: "p7", sku: "ALC-70", name: "Alcohol 70° 250ml", category: "Higiene", presentation: "Frasco 250ml", price: 3.50, stock: 120, minStock: 30 },
  { id: "p8", sku: "MAS-KN95", name: "Mascarilla KN95", category: "Protección", presentation: "Unidad", price: 1.50, stock: 8, minStock: 50 },
  { id: "p9", sku: "ALG-100", name: "Algodón hidrófilo 100g", category: "Curaciones", presentation: "Bolsa 100g", price: 2.00, stock: 45, minStock: 20 },
  { id: "p10", sku: "DEX-PAN", name: "Dexametasona + Panbiotic", category: "Antiinflamatorios", presentation: "Caja x 20", price: 5.20, stock: 12, minStock: 10, requiresPrescription: true },
  { id: "p11", sku: "SAL-RHF", name: "Suero Rehidratante", category: "Gastrointestinal", presentation: "Sobre", price: 1.80, stock: 60, minStock: 25 },
  { id: "p12", sku: "GUA-LAT", name: "Guantes de látex (par)", category: "Protección", presentation: "Par", price: 0.70, stock: 200, minStock: 80 },
];
