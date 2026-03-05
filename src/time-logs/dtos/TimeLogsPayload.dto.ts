import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum TimeLogType {
  WORK_ACTIVITY = 'WORK_ACTIVITY',
  PAID_VACATION = 'PAID_VACATION',
  UNPAID_VACATION = 'UNPAID_VACATION',
  SICK_LEAVE = 'SICK_LEAVE',
}

export class TimeLogsPayload {
  @IsEnum(TimeLogType)
  type: TimeLogType;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  activity_id?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  sub_activity_id?: number;

  @IsInt()
  @Type(() => Number)
  user_id: number;

  @IsInt()
  @Min(0)
  @Max(24)
  @Type(() => Number)
  time: number;

  @IsDate()
  @Type(() => Date)
  date: Date;
}

export class TimeLogsUpdatePayload extends PartialType(TimeLogsPayload) {}
