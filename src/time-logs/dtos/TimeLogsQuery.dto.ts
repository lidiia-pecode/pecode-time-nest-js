import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationQuery } from 'src/lib/dtos';
import { IsDateWithoutTimeString } from 'src/lib/validators/IsDateWithoutTimeString';

export class TimeLogsQuery extends PaginationQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  user_id?: number;

  @IsOptional()
  @IsDateWithoutTimeString()
  start_date?: string;

  @IsOptional()
  @IsDateWithoutTimeString()
  end_date?: string;
}
