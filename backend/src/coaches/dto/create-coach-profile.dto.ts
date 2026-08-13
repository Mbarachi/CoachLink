import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCoachProfileDto {
  @IsString()
  @MinLength(1)
  bio: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  yearsOfExperience: number;

  /** Whole naira — the UI has no sub-naira pricing. */
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sessionRate: number;

  @IsString()
  @MinLength(1)
  venue: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  sportIds: string[];
}
