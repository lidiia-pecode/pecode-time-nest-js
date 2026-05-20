import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationQuery } from 'src/lib/dtos';
import { IsDateWithoutTimeString } from 'src/lib/validators/IsDateWithoutTimeString';

export class TimeLogsQuery extends PaginationQuery {
  @ApiProperty({
    required: false,
    example: 1,
    description: 'Filter by user id',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  user_id?: number;

  @ApiProperty({
    required: false,
    description: 'Start date (inclusive), format YYYY-MM-DD',
    example: '2026-04-01',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateWithoutTimeString()
  start_date?: string;

  @ApiProperty({
    required: false,
    description: 'End date (inclusive), format YYYY-MM-DD',
    example: '2026-04-30',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateWithoutTimeString()
  end_date?: string;
}
