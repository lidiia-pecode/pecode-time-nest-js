import { PartialType } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserPayload {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  username: string;
}

export class UserUpdatePayload extends PartialType(UserPayload) {}
