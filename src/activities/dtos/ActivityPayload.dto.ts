import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class ActivityPayload {
  @ApiProperty({
    description: 'Activity name',
    example: 'Back-end education',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Activity group id',
    example: 1,
  })
  @IsInt()
  group_id!: number;
}

export class ActivityUpdatePayload extends PartialType(ActivityPayload) {}
