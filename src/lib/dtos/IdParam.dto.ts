import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class IdParam {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  id!: number;
}
