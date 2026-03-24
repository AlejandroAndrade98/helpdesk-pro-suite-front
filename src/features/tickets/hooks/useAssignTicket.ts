import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '@/features/tickets/services/ticketService';
import type { AssignTicketRequest } from '@/types/api';

export function useAssignTicket(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignTicketRequest) => ticketService.assign(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId] });
    },
  });
}
