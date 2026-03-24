export const ROUTES = {
  login: '/login',
  register: '/register',
  home: '/',
  dashboard: '/dashboard',
  requesterHome: '/my-tickets',
  tickets: '/tickets',
  ticketDetail: (id: string) => `/tickets/${id}`,
  users: '/users',
  profile: '/profile',
} as const;
