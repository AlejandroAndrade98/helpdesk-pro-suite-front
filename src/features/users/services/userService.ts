import apiClient from '@/services/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type { User } from '@/types/api';

function normalizeUser(raw: any): User {
  return {
    id: String(raw.id ?? ''),
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    email: raw.email ?? '',
    role: raw.role ?? 2,
    createdAt: raw.createdAtUtc ?? raw.createdAt ?? '',
  };
}

export const userService = {
  getMe: async (): Promise<User> => {
    const res = await apiClient.get(API_ENDPOINTS.users.me);
    console.log('[userService.getMe] raw:', res.data);
    return normalizeUser(res.data);
  },
  getAgents: async (): Promise<User[]> => {
    const res = await apiClient.get(API_ENDPOINTS.users.agents);
    const raw = Array.isArray(res.data) ? res.data : (res.data?.items ?? []);
    return raw.map(normalizeUser);
  },
  getAll: async (): Promise<User[]> => {
    const res = await apiClient.get(API_ENDPOINTS.users.list);
    console.log('[userService.getAll] raw:', res.data);
    const raw = Array.isArray(res.data) ? res.data : (res.data?.items ?? []);
    return raw.map(normalizeUser);
  },
};
