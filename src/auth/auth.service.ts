import { createHmac, randomUUID, timingSafeEqual, UUID } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GoogleUserPayload } from './dtos/google-auth.dto';
import { AuthSession } from './entities/auth-session.entity';
import { AuthContext } from './types/auth-context';
import { JwtService } from './jwt.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AuthSession)
    private sessionRepository: Repository<AuthSession>,
    private readonly jwtService: JwtService,
  ) {}

  generateUniqueUsername(base: string): string {
    const normalizedBase = base.toLowerCase().replace(/\s+/g, '');
    return `${normalizedBase}-${randomUUID().slice(0, 8)}`;
  }

  async validateGoogleUser(details: GoogleUserPayload): Promise<User> {
    const { googleId, email, firstName, lastName } = details;

    let user = await this.userRepository.findOne({
      where: { googleId },
    });

    if (user) return user;

    user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      const baseUsername = `${firstName}_${lastName}`;
      const username = this.generateUniqueUsername(baseUsername);

      user = this.userRepository.create({
        email,
        firstName,
        lastName,
        username,
        googleId,
      });
      await this.userRepository.save(user);

      return user;
    }

    user.googleId = googleId;
    await this.userRepository.save(user);
    return user;
  }

  private hashRefreshToken(token: string) {
    return createHmac('sha256', process.env.REFRESH_TOKEN_HASH_SECRET!)
      .update(token)
      .digest('base64url');
  }

  private verifyRefreshTokenHash(token: string, tokenHash: string) {
    const computed = this.hashRefreshToken(token);

    const a = Buffer.from(computed);
    const b = Buffer.from(tokenHash);

    return a.length === b.length && timingSafeEqual(a, b);
  }

  private async createSessionTokens(user: User, sessionId?: UUID) {
    const id = sessionId ?? randomUUID();

    const access_token = this.jwtService.signAccess({
      id: user.id,
      email: user.email,
      session_id: id,
    });

    const refresh_token = this.jwtService.signRefresh({
      session_id: id,
      user_id: user.id,
    });

    const refresh_hash = this.hashRefreshToken(refresh_token);

    const authSession = this.sessionRepository.create({
      id,
      user_id: user.id,
      refresh_hash,
    });

    await this.sessionRepository.save(authSession);

    return { access_token, refresh_token, sessionId: id };
  }

  async login(user: User) {
    const { access_token, refresh_token } =
      await this.createSessionTokens(user);
    return { access_token, refresh_token };
  }

  async refreshTokens(
    refresh_token: string,
    { user, session_id }: AuthContext,
  ) {
    if (!session_id) throw new UnauthorizedException();

    const authSession = await this.sessionRepository.findOneBy({
      id: session_id,
      user_id: user.id,
    });

    if (
      !authSession ||
      !this.verifyRefreshTokenHash(refresh_token, authSession.refresh_hash)
    ) {
      throw new UnauthorizedException();
    }

    const { access_token, refresh_token: newRefreshToken } =
      await this.createSessionTokens(user, session_id);
    return { access_token, refresh_token: newRefreshToken };
  }

  public async logout(session_id: UUID) {
    await this.sessionRepository.delete({ id: session_id });
    return { success: true };
  }

  public async logoutAll(userId: number): Promise<{ success: true }> {
    await this.sessionRepository.delete({ user_id: userId });
    return { success: true };
  }
}
