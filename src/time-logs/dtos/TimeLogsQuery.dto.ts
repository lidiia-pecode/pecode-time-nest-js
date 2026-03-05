import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class TimeLogsQuery {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  user_id?: number;

  @IsOptional()
  start_date?: string;

  @IsOptional()
  end_date?: string;
}
