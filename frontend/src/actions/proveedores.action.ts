import { api } from '../api/api';
import type { ProveedoresResponse } from '../infrastructure/interfaces/responses/proveedores.response';
import type {ProveedorInterface} from "@/infrastructure/interfaces/models";

export const getProveedores = async () => {
  const { data } = await api.get<ProveedoresResponse>('/proveedores');
  return data.data;
};

export const getProveedorByID = async (id: string) => {
  const { data } = await api.get(`/proveedores/${id}`);
  return data;
};

export const createProveedor = async (proveedor: ProveedorInterface) => {
  const { data } = await api.post('/proveedores', proveedor);
  return data;
};

export const updateProveedor = async ({ id, data: proveedorData }: { id: string, data: ProveedorInterface }) => {
  const { data } = await api.put(`/proveedores/${id}`, proveedorData);
  return data;
};

export const deleteProveedor = async (id: string) => {
  const { data } = await api.delete(`/proveedores/${id}`);
  return data;
};
