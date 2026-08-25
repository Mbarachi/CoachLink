import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { usersService } from '@/services';
import { useAuthStore } from '@/store/auth.store';
import type { UpdateUserDto } from '@/types';

export const meKeys = {
  detail: ['users', 'me'] as const,
};

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: meKeys.detail,
    queryFn: usersService.getMe,
    enabled: isAuthenticated,
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: (dto: UpdateUserDto) => usersService.updateMe(dto),
    onSuccess: (user) => {
      // Keep the persisted store in step so a reload shows the new values.
      updateUser(user);
      qc.setQueryData(meKeys.detail, user);
    },
  });
}
