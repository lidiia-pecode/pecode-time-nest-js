import { Expose } from 'class-transformer';
import { TimeLogType } from './TimeLogsPayload.dto';
import { ApiProperty } from '@nestjs/swagger';
// import { PaginatedResponseDto } from 'src/lib/dtos/PaginatedResponse.dto';

export class TimeLogsResponse {
  @ApiProperty({
    description: 'Timelog id',
    example: 1,
  })
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Timelog type',
    enum: TimeLogType,
    example: TimeLogType.WORK_ACTIVITY,
  })
  @Expose()
  type!: TimeLogType;

  @ApiProperty({
    description: 'Activity id',
    example: 1,
    nullable: true,
  })
  @Expose()
  activity_id!: number | null;

  @ApiProperty({
    description: 'Subactivity id',
    example: 1,
    nullable: true,
  })
  @Expose()
  sub_activity_id!: number | null;

  @ApiProperty({
    description: 'User id',
    example: 1,
  })
  @Expose()
  user_id!: number;

  @ApiProperty({
    description: 'Logged time in minutes (1-1440)',
    example: 60,
    minimum: 1,
    maximum: 1440,
  })
  @Expose()
  time!: number;

  @ApiProperty({
    description: 'Date in format YYYY-MM-DD',
    example: '2026-04-22',
    type: String,
    format: 'date',
  })
  @Expose()
  date!: string;
}

// export class TimeLogsPaginatedResponse extends PaginatedResponseDto(
//   TimeLogsResponse,
// ) {}
