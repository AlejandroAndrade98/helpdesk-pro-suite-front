import { useQuery } from '@tanstack/react-query';
import { commentService } from '@/features/comments/services/commentService';
import { useCurrentUser } from '@/features/users/hooks/useCurrentUser';
import { TOKEN_KEY } from '@/constants/api';
import type { Comment } from '@/types/api';

function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function useComments(ticketId: string) {
  const { data: currentUser } = useCurrentUser();
  const token = getAccessToken();

  return useQuery<Comment[]>({
    queryKey: ['comments', ticketId, currentUser?.id, token],
    queryFn: () => commentService.getByTicket(ticketId),
    enabled: !!ticketId && !!token && !!currentUser,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}