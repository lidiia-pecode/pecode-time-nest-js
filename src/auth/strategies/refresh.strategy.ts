import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { cookieExtractor } from '../helpers/cookies-extractor';
import { RefreshPayload } from '../types/refresh-payload';
import { AuthContext } from '../types/auth-context';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthSession } from '../entities/auth-session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private usersService: UsersService,
    @InjectRepository(AuthSession) private sessionRepo: Repository<AuthSession>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor('refresh_token'),
      ]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET!,
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  async validate({
    user_id,
    session_id,
  }: RefreshPayload): Promise<AuthContext> {
    const session = await this.sessionRepo.findOneBy({
      id: session_id,
      user_id,
    });

    if (!session) {
      throw new UnauthorizedException('Session is deleted, user is logged out');
    }

    const user = await this.usersService.getUserById(user_id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return { user, session_id };
  }
}
