export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  users: {
    list: '/users',
    me: '/users/me',
    agents: '/users/agents',
    updateRole: (id: number) => `/users/${id}/role`,
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
  reports: {
    overview: '/reports/overview',
    ticketsByStatus: '/reports/tickets-by-status',
    ticketsByPriority: '/reports/tickets-by-priority',
    ticketsTrend: '/reports/tickets-trend',
    agentWorkload: '/reports/agent-workload',
    exportTickets: '/reports/export/tickets',
  },
} as const;

export const TOKEN_KEY = 'accessToken';
export const USER_KEY = 'currentUser';
export const LANGUAGE_KEY = 'helpdesk_language';
