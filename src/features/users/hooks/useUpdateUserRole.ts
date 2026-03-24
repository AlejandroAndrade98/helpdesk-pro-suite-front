import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/features/users/services/userService';
import type { UserRole } from '@/types/api';

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: UserRole }) =>
      userService.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
}