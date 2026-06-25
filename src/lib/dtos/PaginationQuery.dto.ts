import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { DEFAULT_PAGINATION_PAGE_SIZE } from '../const';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQuery {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({ required: false, default: DEFAULT_PAGINATION_PAGE_SIZE })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page_size: number = DEFAULT_PAGINATION_PAGE_SIZE;

  get offset() {
    return (this.page - 1) * this.page_size;
  }

  get limit() {
    return this.page_size;
  }
}
