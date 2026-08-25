import { useQuery } from '@tanstack/react-query';

import { sportsService } from '@/services';

export const sportKeys = {
  all: ['sports'] as const,
};

export function useSports() {
  return useQuery({
    queryKey: sportKeys.all,
    queryFn: sportsService.list,
    // The MVP ships two sports that effectively never change.
    staleTime: 1000 * 60 * 60,
  });
}
