import { BookingMode } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateBookingRequestDto {
  @IsUUID('4')
  coachId: string;

  @IsUUID('4')
  sportId: string;

  @IsEnum(BookingMode)
  mode: BookingMode;

  /**
   * SINGLE: the session date. PACKAGE: the anchor the recurrence runs from —
   * week 1 is the seven days beginning here.
   */
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'startDate must be YYYY-MM-DD.' })
  startDate: string;

  /** Coach-local, 24-hour. */
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'startTime must be HH:mm.' })
  startTime: string;

  /** Package only. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  weeks?: number;

  /** Package only — 0 = Sunday. */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  daysOfWeek?: number[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  /** Required when the caller is a PARENT, rejected otherwise. */
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  childName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(17)
  childAge?: number;
}
