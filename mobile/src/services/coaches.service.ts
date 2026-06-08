import api from './api';
import type {
  Coach,
  CoachQueryParams,
  CreateCoachProfileDto,
  UpdateCoachProfileDto,
} from '@/types';

export const coachesService = {
  list: (params?: CoachQueryParams) =>
    api.get<Coach[]>('/coaches', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Coach>(`/coaches/${id}`).then((r) => r.data),

  create: (dto: CreateCoachProfileDto) =>
    api.post<Coach>('/coaches', dto).then((r) => r.data),

  update: (id: string, dto: UpdateCoachProfileDto) =>
    api.patch<Coach>(`/coaches/${id}`, dto).then((r) => r.data),
};
