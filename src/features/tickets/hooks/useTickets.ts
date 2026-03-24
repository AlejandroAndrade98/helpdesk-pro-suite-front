import { useQuery } from '@tanstack/react-query';
import { ticketService } from '@/features/tickets/services/ticketService';
import type { PaginatedRequest } from '@/types/api';

export function useTickets(params: PaginatedRequest = { page: 1, pageSize: 50 }) {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
}
