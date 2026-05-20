import { Expose, Type } from 'class-transformer';
import { ActivityGroupResponse } from './ActivityGroupResponse.dto';
import { PaginatedResponseDto } from 'src/lib/dtos/PaginatedResponse.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ActivityResponse {
  @ApiProperty({
    description: 'Activity id',
    example: 2,
  })
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Activity name',
    example: 'Onboarding',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'Activity group info',
    type: ActivityGroupResponse,
  })
  @Expose()
  @Type(() => ActivityGroupResponse)
  group!: ActivityGroupResponse;
}

export class ActivityPaginatedResponse extends PaginatedResponseDto(
  ActivityResponse,
) {}
