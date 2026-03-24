import { useQuery } from '@tanstack/react-query';
import { commentService } from '@/features/comments/services/commentService';

export function useComments(ticketId: string) {
  return useQuery({
    queryKey: ['comments', ticketId],
    queryFn: () => commentService.getByTicket(ticketId),
    staleTime: 2 * 60 * 1000,
    enabled: !!ticketId,
  });
}
