import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { coachesService } from '@/services';
import type { CoachQueryParams, CreateCoachProfileDto, UpdateCoachProfileDto } from '@/types';

export const coachKeys = {
  all: ['coaches'] as const,
  list: (params?: CoachQueryParams) => ['coaches', 'list', params ?? {}] as const,
  detail: (id: string) => ['coaches', 'detail', id] as const,
  mine: ['coaches', 'me'] as const,
};

export function useCoaches(params?: CoachQueryParams) {
  return useQuery({
    queryKey: coachKeys.list(params),
    queryFn: () => coachesService.list(params),
  });
}

/** 404s when the signed-in user has not created a coach profile yet. */
export function useMyCoachProfile(enabled = true) {
  return useQuery({
    queryKey: coachKeys.mine,
    queryFn: coachesService.getMine,
    enabled,
    retry: false,
  });
}

export function useCoach(id: string | undefined) {
  return useQuery({
    queryKey: coachKeys.detail(id ?? ''),
    queryFn: () => coachesService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateCoachProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCoachProfileDto) => coachesService.create(dto),
    onSuccess: () => void qc.invalidateQueries({ queryKey: coachKeys.all }),
  });
}

export function useUpdateCoachProfile(id: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateCoachProfileDto) => coachesService.update(id!, dto),
    onSuccess: () => void qc.invalidateQueries({ queryKey: coachKeys.all }),
  });
}
