import { VerificationStatus } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/** An admin may only move a profile to a decided state, never back to PENDING. */
const DECISIONS = [
  VerificationStatus.APPROVED,
  VerificationStatus.REJECTED,
] as const;

export class ReviewCoachDto {
  @IsEnum(DECISIONS, { message: 'status must be APPROVED or REJECTED.' })
  status: (typeof DECISIONS)[number];

  /** Required on rejection — a coach turned away is owed a reason. */
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  note?: string;
}
