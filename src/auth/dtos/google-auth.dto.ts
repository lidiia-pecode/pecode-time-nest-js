import { IsEmail, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GoogleUserPayload {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : null,
  )
  @IsEmail()
  email: string;

  @IsString()
  googleId: string;
}
