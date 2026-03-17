import { OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { IsDateWithoutTimeString } from 'src/lib/validators/IsDateWithoutTimeString';

export enum TimeLogType {
  WORK_ACTIVITY = 'WORK_ACTIVITY',
  PAID_VACATION = 'PAID_VACATION',
  UNPAID_VACATION = 'UNPAID_VACATION',
  SICK_LEAVE = 'SICK_LEAVE',
}

export class TimeLogsPayload {
  @IsEnum(TimeLogType)
  type: TimeLogType;

  @IsOptional()
  @IsInt()
  activity_id?: number;

  @IsOptional()
  @IsInt()
  sub_activity_id?: number;

  @IsInt()
  user_id: number;

  @IsInt()
  @Min(1)
  @Max(24)
  time: number;

  @IsDateWithoutTimeString()
  date: string;
}

export class TimeLogsUpdatePayload extends PartialType(
  OmitType(TimeLogsPayload, ['user_id'] as const),
) {}
