import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class SubActivityPayload {
  @ApiProperty({
    description: 'Subactivity name',
    example: 'Workshop',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Activity id',
    example: 1,
  })
  @IsInt()
  activity_id!: number;
}

export class SubActivityUpdatePayload extends PickType(SubActivityPayload, [
  'name',
]) {}
