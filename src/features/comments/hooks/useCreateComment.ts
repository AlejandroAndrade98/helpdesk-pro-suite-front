import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '@/features/comments/services/commentService';
import { useCurrentUser } from '@/features/users/hooks/useCurrentUser';
import { TOKEN_KEY } from '@/constants/api';
import type { CreateCommentRequest } from '@/types/api';

function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function useCreateComment(ticketId: string) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const token = getAccessToken();

  return useMutation({
    mutationFn: (data: CreateCommentRequest) => commentService.create(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', ticketId, currentUser?.id, token],
      });
    },
  });
}