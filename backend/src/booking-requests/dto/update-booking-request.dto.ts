import { BookingRequestStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

/**
 * The only mutation a request supports is a status transition. Which
 * transitions are legal depends on who is asking, so the service — not this
 * DTO — decides: a coach may ACCEPT or DECLINE, an athlete may CANCEL.
 */
const TRANSITIONS = [
  BookingRequestStatus.ACCEPTED,
  BookingRequestStatus.DECLINED,
  BookingRequestStatus.CANCELLED,
] as const;

export type RequestedTransition = (typeof TRANSITIONS)[number];

export class UpdateBookingRequestDto {
  @IsEnum(TRANSITIONS, {
    message: 'status must be one of ACCEPTED, DECLINED, CANCELLED.',
  })
  status: RequestedTransition;
}
