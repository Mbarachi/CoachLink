import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CoachQueryDto {
  /** Sport name, e.g. "Swimming" — matches what the UI's filter chips display. */
  @IsOptional()
  @IsString()
  sport?: string;

  @IsOptional()
  @IsString()
  venue?: string;

  /** Free-text match against coach name or venue. */
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
