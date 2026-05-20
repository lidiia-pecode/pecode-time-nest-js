import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PaginatedResponseDto } from 'src/lib/dtos/PaginatedResponse.dto';

export class SubActivityResponse {
  @ApiProperty({
    description: 'Subactivity id',
    example: 3,
  })
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Subactivity name',
    example: 'Meeting',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'Activity id',
    example: 1,
  })
  @Expose()
  activity_id!: number;
}

export class SubActivityPaginatedResponse extends PaginatedResponseDto(
  SubActivityResponse,
) {}
