import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '@/features/comments/services/commentService';
import type { CreateCommentRequest } from '@/types/api';

export function useCreateComment(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommentRequest) => commentService.create(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
    },
  });
}
