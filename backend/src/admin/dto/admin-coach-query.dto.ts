import { VerificationStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class AdminCoachQueryDto {
  /** Defaults to PENDING — the queue an admin actually opens the page for. */
  @IsOptional()
  @IsEnum(VerificationStatus)
  status?: VerificationStatus;
}
