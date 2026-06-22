import { useMemo } from 'react';
import { mockCoaches } from '../data/mockCoaches';
import { SortOption } from '../types/coach.types';

interface UseCoachesOptions {
  sport?: string;
  venue?: string;
  query?: string;
  sort?: SortOption;
}

export const useCoaches = (options: UseCoachesOptions = {}) => {
  const { sport, venue, query, sort = 'highest-rated' } = options;

  const coaches = useMemo(() => {
    let result = [...mockCoaches];

    if (sport && sport !== 'All') {
      result = result.filter((c) => c.sport === sport);
    }
    if (venue && venue !== 'All') {
      result = result.filter((c) => c.venue === venue);
    }
    if (query?.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'highest-rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest-price':
        result.sort((a, b) => a.sessionRate - b.sessionRate);
        break;
      case 'most-experienced':
        result.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
        break;
    }

    return result;
  }, [sport, venue, query, sort]);

  return { coaches, total: coaches.length };
};
