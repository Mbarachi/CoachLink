import api from './api';
import type {
  InitializePaymentDto,
  InitializePaymentResponse,
  Payment,
} from '@/types';

export const paymentsService = {
  initialize: (dto: InitializePaymentDto) =>
    api
      .post<InitializePaymentResponse>('/payments/initialize', dto)
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<Payment>(`/payments/${id}`).then((r) => r.data),
};
