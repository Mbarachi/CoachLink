import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { payoutsService } from '@/services';
import type { SavePayoutAccountDto } from '@/types';

export const payoutKeys = {
  all: ['payouts'] as const,
  list: () => ['payouts', 'list'] as const,
  banks: () => ['payouts', 'banks'] as const,
};

export function usePayouts() {
  return useQuery({
    queryKey: payoutKeys.list(),
    queryFn: () => payoutsService.list(),
    staleTime: 1000 * 60,
  });
}

/** The bank list barely changes, so it is fetched once and kept. */
export function useBanks(enabled = true) {
  return useQuery({
    queryKey: payoutKeys.banks(),
    queryFn: () => payoutsService.banks(),
    staleTime: 1000 * 60 * 60 * 24,
    enabled,
  });
}

export function useSavePayoutAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: SavePayoutAccountDto) => payoutsService.saveAccount(dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: payoutKeys.all });
      // The account lives on the coach profile, which the page also reads.
      void qc.invalidateQueries({ queryKey: ['coaches'] });
    },
  });
}
