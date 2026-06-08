import api from './api';
import type { Sport } from '@/types';

export const sportsService = {
  list: () =>
    api.get<Sport[]>('/sports').then((r) => r.data),
};
