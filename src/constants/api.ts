export const API_BASE_URL = 'https://helpdesk-api-7fu9.onrender.com';

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  users: {
    me: '/users/me',
    agents: '/users/agents',
    list: '/users',
  },
  tickets: {
    list: '/tickets',
    create: '/tickets',
    detail: (id: string) => `/tickets/${id}`,
    status: (id: string) => `/tickets/${id}/status`,
    assign: (id: string) => `/tickets/${id}/assign`,
  },
  comments: {
    list: (ticketId: string) => `/tickets/${ticketId}/comments`,
    create: (ticketId: string) => `/tickets/${ticketId}/comments`,
  },
} as const;

export const TOKEN_KEY = 'accessToken';
export const USER_KEY = 'currentUser';
export const LANGUAGE_KEY = 'helpdesk_language';
