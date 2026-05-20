import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PaginatedResponseDto } from 'src/lib/dtos/PaginatedResponse.dto';

export class ActivityGroupResponse {
  @ApiProperty({
    description: 'Activity group id',
    example: 1,
  })
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Activity group name',
    example: 'Internal activities',
  })
  @Expose()
  name!: string;
}

export class ActivityGroupPaginatedResponse extends PaginatedResponseDto(
  ActivityGroupResponse,
) {}
