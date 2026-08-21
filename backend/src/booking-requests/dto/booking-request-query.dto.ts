import { BookingRequestStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class BookingRequestQueryDto {
  /**
   * Note that EXPIRED is derived rather than stored, so it is not a valid
   * filter — a request that has lapsed is still PENDING in the database.
   */
  @IsOptional()
  @IsEnum(BookingRequestStatus)
  status?: BookingRequestStatus;
}
