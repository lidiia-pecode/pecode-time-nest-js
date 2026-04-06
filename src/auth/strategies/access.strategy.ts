import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { cookieExtractor } from '../helpers/cookies-extractor';
import { AccessPayload } from '../types/access-payload';
import { AuthContext } from '../types/auth-context';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthSession } from '../entities/auth-session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    private usersService: UsersService,
    @InjectRepository(AuthSession) private sessionRepo: Repository<AuthSession>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor('access_token'),
      ]),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  async validate({
    id,
    email,
    session_id,
  }: AccessPayload): Promise<AuthContext> {
    const session = await this.sessionRepo.findOneBy({
      id: session_id,
      user_id: id,
    });
    if (!session) {
      throw new UnauthorizedException('Session is deleted, user is logged out');
    }

    const user = await this.usersService.getUserById(id);

    if (!user || user.email !== email) {
      throw new UnauthorizedException();
    }

    return { user, session_id };
  }
}
