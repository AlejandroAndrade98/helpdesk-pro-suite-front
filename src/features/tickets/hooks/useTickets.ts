import { useQuery } from '@tanstack/react-query';
import { ticketService } from '@/features/tickets/services/ticketService';
import { useCurrentUser } from '@/features/users/hooks/useCurrentUser';
import type { PaginatedRequest, PaginatedResponse, Ticket } from '@/types/api';
import { TOKEN_KEY } from '@/constants/api';

function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function useTickets(params: PaginatedRequest = { page: 1, pageSize: 50 }) {
  const { data: currentUser } = useCurrentUser();
  const token = getAccessToken();

  return useQuery<PaginatedResponse<Ticket>>({
    queryKey: ['tickets', currentUser?.id, token, params],
    queryFn: () => ticketService.getAll(params),
    enabled: !!token && !!currentUser,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}