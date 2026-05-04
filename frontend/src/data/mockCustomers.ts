import type { Customer } from "@/lib/types";

export const mockCustomers: Customer[] = [
  { id: "c1", name: "María Quispe", document: "45678912", phone: "987654321", email: "maria@example.com", createdAt: new Date().toISOString() },
  { id: "c2", name: "Carlos Mendoza", document: "10293847", phone: "956321478", email: "carlos@example.com", createdAt: new Date().toISOString() },
  { id: "c3", name: "Lucía Ramírez", document: "78451236", phone: "912345678", createdAt: new Date().toISOString() },
  { id: "c4", name: "Pedro Salinas", document: "33445566", phone: "934567812", createdAt: new Date().toISOString() },
];
