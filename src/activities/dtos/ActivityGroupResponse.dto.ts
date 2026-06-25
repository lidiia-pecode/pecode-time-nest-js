import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

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
