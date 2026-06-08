import api from './api';
import type { UpdateUserDto, User } from '@/types';

export const usersService = {
  getMe: () =>
    api.get<User>('/users/me').then((r) => r.data),

  updateMe: (dto: UpdateUserDto) =>
    api.patch<User>('/users/me', dto).then((r) => r.data),
};
