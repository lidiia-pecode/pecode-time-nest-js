import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { IsDateWithoutTimeString } from 'src/lib/validators/IsDateWithoutTimeString';

export enum TimeLogType {
  WORK_ACTIVITY = 'WORK_ACTIVITY',
  PAID_VACATION = 'PAID_VACATION',
  UNPAID_VACATION = 'UNPAID_VACATION',
  SICK_LEAVE = 'SICK_LEAVE',
}

export class TimeLogsPayload {
  @ApiProperty({
    description: 'Timelog type',
    enum: TimeLogType,
    example: TimeLogType.WORK_ACTIVITY,
  })
  @IsEnum(TimeLogType)
  type!: TimeLogType;

  @ApiProperty({
    description: 'Activity id (required for WORK_ACTIVITY)',
    example: 1,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  activity_id?: number;

  @ApiProperty({
    description: 'Subactivity id (optional)',
    example: 1,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  sub_activity_id?: number;

  @ApiProperty({
    description: 'User id',
    example: 1,
  })
  @IsInt()
  user_id!: number;

  @ApiProperty({
    description: 'Logged time in minutes (1-1440)',
    example: 60,
    minimum: 1,
    maximum: 1440,
  })
  @IsInt()
  @Min(1)
  @Max(1440)
  time!: number;

  @ApiProperty({
    description: 'Date in format YYYY-MM-DD',
    example: '2026-04-22',
    type: String,
    format: 'date',
  })
  @IsDateWithoutTimeString()
  date!: string;
}

export class TimeLogsUpdatePayload extends PartialType(
  OmitType(TimeLogsPayload, ['user_id'] as const),
) {}
