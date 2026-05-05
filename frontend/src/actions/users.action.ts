import { api } from '../api/api';
import type { UsersResponse } from '../infrastructure/interfaces/responses/users.response';
import type {UserInterface} from "@/infrastructure/interfaces/models";

export const getUsers = async () => {
  const { data } = await api.get<UsersResponse>('/users');
  return data.data;
};

export const getUserByID = async (id: string) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const createUser = async (user: UserInterface) => {
  const { data } = await api.post('/users', user);
  return data;
};

export const updateUser = async ({ id, data: userData }: { id: string, data: UserInterface }) => {
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
