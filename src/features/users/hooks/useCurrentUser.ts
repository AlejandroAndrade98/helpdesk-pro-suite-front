import { useQuery } from '@tanstack/react-query';
import { userService } from '@/features/users/services/userService';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: userService.getMe,
    staleTime: 5 * 60 * 1000,
  });
}
