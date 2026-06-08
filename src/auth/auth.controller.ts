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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
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

  // ---  LOGIN WITH GOOGLE ---
  @ApiOperation({
    summary: 'Login with Google',
    description: `
      Redirects user to Google login page.

      ⚠️ This endpoint MUST be opened in browser.
      It cannot be tested via Swagger or curl because it performs HTTP redirect to Google OAuth.

      Flow:
      1. User opens this endpoint in browser
      2. Redirected to Google login page
      3. After success → redirected back to /auth/google/callback
    `,
  })
  @ApiResponse({
    status: 302,
    description: 'Redirect to Google OAuth',
  })
  @Public()
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  // ---  GOOGLE CALLBACK ---
  @ApiOperation({
    summary: 'Google OAuth callback',
    description: `
      Handles redirect from Google after successful login.

      ⚠️ This endpoint is NOT meant to be called manually.

      It is triggered automatically by Google OAuth server after user authentication.

      Flow:
      1. User logs in via /auth/google
      2. Google redirects back with authorization code
      3. Backend exchanges code for user profile
      4. JWT tokens are created and set as cookies
      5. User receives success response
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'User authenticated successfully',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @Public()
  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.service.login(user);

    this.setCookies(res, tokens);

    return { success: true };
  }

  // --- REFRESH ---
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      example: { success: true },
    },
  })
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

  // --- LOGOUT ---
  @ApiOperation({ summary: 'Logout current session' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully.',
  })
  @UseGuards(RefreshGuard)
  @Post('/logout')
  async logout(
    @SessionId() session_id: UUID,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.clearCookies(res);
    return this.service.logout(session_id);
  }

  // --- LOGOUT ALL ---
  @ApiOperation({ summary: 'Logout from all devices' })
  @ApiResponse({
    status: 200,
    description: 'User logged out from all sessions.',
  })
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
