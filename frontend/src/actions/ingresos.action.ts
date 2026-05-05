import { api } from '../api/api';
import type { IngresosResponse } from '../infrastructure/interfaces/responses/ingresos.response';
import type {IngresoInterface} from "@/infrastructure/interfaces/models";

export const getIngresos = async () => {
  const { data } = await api.get<IngresosResponse>('/ingresos');
  return data.data;
};

export const getIngresoByID = async (id: string) => {
  const { data } = await api.get(`/ingresos/${id}`);
  return data;
};

export const createIngreso = async (ingreso: IngresoInterface) => {
  const { data } = await api.post('/ingresos', ingreso);
  return data;
};
