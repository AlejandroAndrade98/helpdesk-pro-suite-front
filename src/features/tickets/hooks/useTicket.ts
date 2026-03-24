import { useQuery } from '@tanstack/react-query';
import { ticketService } from '@/features/tickets/services/ticketService';

export function useTicket(id: string) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketService.getById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}
