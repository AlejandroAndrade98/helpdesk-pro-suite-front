import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '@/features/tickets/services/ticketService';
import type { UpdateTicketStatusRequest } from '@/types/api';

export function useUpdateTicketStatus(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTicketStatusRequest) => ticketService.updateStatus(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId] });
    },
  });
}
