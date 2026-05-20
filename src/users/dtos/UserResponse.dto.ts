import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PaginatedResponseDto } from 'src/lib/dtos/PaginatedResponse.dto';

export class UserResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'smith@gmail.com' })
  @Expose()
  email!: string;

  @ApiProperty({ example: 'Sam' })
  @Expose()
  first_name!: string;

  @ApiProperty({ example: 'Smith' })
  @Expose()
  last_name!: string;

  @ApiProperty({ example: 'sam-smith-249e3dad' })
  @Expose()
  username!: string;
}

export class UserPaginatedResponse extends PaginatedResponseDto(UserResponse) {}
