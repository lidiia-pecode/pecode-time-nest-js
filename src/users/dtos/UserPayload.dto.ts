import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserPayload {
  @ApiProperty({
    description: 'User email address',
    example: 'samanth@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'User first_name',
    example: 'Samantha',
  })
  @IsString()
  first_name!: string;

  @ApiProperty({
    description: 'User last_name',
    example: 'Brown',
  })
  @IsString()
  last_name!: string;

  @ApiProperty({
    description: 'User nickname',
    example: 'agent007',
  })
  @IsString()
  username!: string;
}

export class UserUpdatePayload extends PartialType(
  OmitType(UserPayload, ['email'] as const),
) {}
