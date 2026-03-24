import { useQuery } from '@tanstack/react-query';
import { userService } from '@/features/users/services/userService';
import type { User } from '@/types/api';

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ['users', 'me'],
    queryFn: userService.getMe,
    staleTime: 5 * 60 * 1000,
  });
}
