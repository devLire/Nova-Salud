import { api } from '../api/api';
import type { CategoriesResponse } from '../infrastructure/interfaces/responses/categories.response';
import type {CategoriaInterface} from "@/infrastructure/interfaces/models";

export const getCategorias = async () => {
  const { data } = await api.get<CategoriesResponse>('/categorias');
  return data.data;
};

export const getCategoriaByID = async (id: string) => {
  const { data } = await api.get(`/categorias/${id}`);
  return data;
};

export const createCategoria = async (categoria: CategoriaInterface) => {
  const { data } = await api.post('/categorias', categoria);
  return data;
};

export const updateCategoria = async ({ id, data: categoriaData }: { id: string, data: CategoriaInterface }) => {
  const { data } = await api.put(`/categorias/${id}`, categoriaData);
  return data;
};

export const deleteCategoria = async (id: string) => {
  const { data } = await api.delete(`/categorias/${id}`);
  return data;
};
