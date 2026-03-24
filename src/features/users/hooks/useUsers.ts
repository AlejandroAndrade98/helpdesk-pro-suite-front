import { useQuery } from '@tanstack/react-query';
import { userService } from '@/features/users/services/userService';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAgents() {
  return useQuery({
    queryKey: ['users', 'agents'],
    queryFn: userService.getAgents,
    staleTime: 5 * 60 * 1000,
  });
}
