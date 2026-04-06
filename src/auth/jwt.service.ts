import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { AccessPayload } from './types/access-payload';
import { RefreshPayload } from './types/refresh-payload';

@Injectable()
export class JwtService {
  constructor(private _jwtService: NestJwtService) {}

  signAccess({ id, email, session_id }: AccessPayload) {
    return this._jwtService.sign(
      { id, email, session_id },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '10m',
      },
    );
  }

  verifyAccess(token: string) {
    return this._jwtService.verify<AccessPayload>(token, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  signRefresh({ session_id, user_id }: RefreshPayload) {
    return this._jwtService.sign(
      { session_id, user_id },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '30d',
      },
    );
  }

  verifyRefresh(token: string) {
    return this._jwtService.verify<RefreshPayload>(token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });
  }
}
