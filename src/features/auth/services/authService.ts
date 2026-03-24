import apiClient from '@/services/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type { LoginRequest, RegisterRequest } from '@/types/api';

interface LoginResponse {
  accessToken: string;
  [key: string]: unknown;
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post(API_ENDPOINTS.auth.login, {
      email: data.email,
      password: data.password,
    });
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.auth.register, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
  },
};
