import { useQuery } from '@tanstack/react-query';
import { ticketService } from '@/features/tickets/services/ticketService';
import { useCurrentUser } from '@/features/users/hooks/useCurrentUser';
import type { Ticket } from '@/types/api';
import { TOKEN_KEY } from '@/constants/api';

function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function useTicket(id: string) {
  const { data: currentUser } = useCurrentUser();
  const token = getAccessToken();

  return useQuery<Ticket>({
    queryKey: ['ticket', id, currentUser?.id, token],
    queryFn: () => ticketService.getById(id),
    enabled: !!id && !!token && !!currentUser,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}