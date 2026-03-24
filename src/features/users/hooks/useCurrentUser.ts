import { useQuery } from '@tanstack/react-query';
import { userService } from '@/features/users/services/userService';
import type { User } from '@/types/api';
import { TOKEN_KEY } from '@/constants/api';


function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function useCurrentUser() {
  const token = getAccessToken();

  return useQuery<User>({
    queryKey: ['users', 'me', token],
    queryFn: userService.getMe,
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}