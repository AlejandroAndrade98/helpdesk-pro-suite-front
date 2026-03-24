import apiClient from '@/services/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type { User, UserRole } from '@/types/api';

function normalizeUser(raw: any): User {
  return {
    id: Number(raw?.id ?? 0),
    displayName: raw?.displayName ?? '',
    email: raw?.email ?? '',
    role: raw?.role ?? 1,
  };
}

export const userService = {
  getMe: async (): Promise<User> => {
    const res = await apiClient.get(API_ENDPOINTS.users.me);
    return normalizeUser(res.data);
  },

  getAgents: async (): Promise<User[]> => {
    const res = await apiClient.get(API_ENDPOINTS.users.agents);
    const raw = Array.isArray(res.data) ? res.data : (res.data?.items ?? []);
    return raw.map(normalizeUser);
  },

  getAll: async (): Promise<User[]> => {
    const res = await apiClient.get(API_ENDPOINTS.users.list);
    const raw = Array.isArray(res.data) ? res.data : (res.data?.items ?? []);
    return raw.map(normalizeUser);
  },

  updateRole: async (id: number, role: UserRole): Promise<User> => {
    const res = await apiClient.patch(API_ENDPOINTS.users.updateRole(id), { role });
    return normalizeUser(res.data);
  },
};