import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ActivityGroupPayload {
  @ApiProperty({
    description: 'Activity group name',
    example: 'Projects',
  })
  @IsString()
  name!: string;
}
