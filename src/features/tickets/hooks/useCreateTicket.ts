import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '@/features/tickets/services/ticketService';
import type { CreateTicketRequest } from '@/types/api';

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTicketRequest) => ticketService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
