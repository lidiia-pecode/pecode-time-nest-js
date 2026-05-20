import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export function PaginatedResponseDto<T>(ItemType: Type<T>) {
  class PaginatedResponse {
    @ApiProperty({
      nullable: true,
      description: 'URL to the next page of results',
    })
    next!: string | null;

    @ApiProperty({
      nullable: true,
      description: 'URL to the previous page of results',
    })
    previous!: string | null;

    @ApiProperty()
    count!: number;

    @ApiProperty({ isArray: true, type: ItemType })
    results!: T[];
  }

  return PaginatedResponse;
}
