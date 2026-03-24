import { useQuery } from '@tanstack/react-query';
import { userService } from '@/features/users/services/userService';
import type { User } from '@/types/api';

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: userService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAgents() {
  return useQuery<User[]>({
    queryKey: ['users', 'agents'],
    queryFn: userService.getAgents,
    staleTime: 5 * 60 * 1000,
  });
}
