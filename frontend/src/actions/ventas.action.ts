import { api } from '../api/api';
import type { VentasResponse } from '../infrastructure/interfaces/responses/ventas.response';
import type {VentaInterface} from "@/infrastructure/interfaces/models";

export const getVentas = async () => {
  const { data } = await api.get<VentasResponse>('/ventas');
  return data.data;
};

export const getVentaByID = async (id: string) => {
  const { data } = await api.get(`/ventas/${id}`);
  return data;
};

export const createVenta = async (venta: VentaInterface) => {
  const { data } = await api.post('/ventas', venta);
  return data;
};

export const updateVenta = async ({ id, data: ventaData }: { id: string, data: VentaInterface }) => {
  const { data } = await api.put(`/ventas/${id}`, ventaData);
  return data;
};
