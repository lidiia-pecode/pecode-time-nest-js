import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';

import type { Response } from 'express';
import type { UUID } from 'crypto';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/lib/decorators/current-user.decorator';
import { RefreshToken } from 'src/lib/decorators/refresh-token.decorator';
import { RefreshGuard } from './guards';
import { SessionId } from 'src/lib/decorators/session-id.decorator';
import { Public } from 'src/lib/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  private setCookies(
    res: Response,
    {
      access_token,
      refresh_token,
    }: {
      access_token: string;
      refresh_token: string;
    },
  ) {
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth',
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('refresh_token', { path: '/auth' });
    res.clearCookie('access_token', { path: '/' });
  }

  @Public()
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.service.login(user);

    this.setCookies(res, tokens);

    return { success: true };
  }

  @Post('/refresh')
  @Public()
  @UseGuards(RefreshGuard)
  async refresh(
    @CurrentUser() user: User,
    @SessionId() session_id: UUID,
    @RefreshToken() refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.service.refreshTokens(refresh_token, {
      user,
      session_id,
    });

    this.setCookies(res, tokens);

    return { success: true };
  }

  @Public()
  @UseGuards(RefreshGuard)
  @Post('/logout')
  async logout(
    @SessionId() session_id: UUID,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.clearCookies(res);
    return this.service.logout(session_id);
  }

  @Public()
  @UseGuards(RefreshGuard)
  @Post('/logout-all')
  async logoutAll(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.clearCookies(res);
    return await this.service.logoutAll(user.id);
  }
}
