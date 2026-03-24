export const ROUTES = {
  login: '/login',
  register: '/register',
  dashboard: '/',
  tickets: '/tickets',
  ticketDetail: (id: string) => `/tickets/${id}`,
  users: '/users',
  profile: '/profile',
} as const;
