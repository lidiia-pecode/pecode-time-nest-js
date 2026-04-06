import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtService } from './jwt.service';
import { User } from '../users/entities/user.entity';
import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { AuthSession } from './entities/auth-session.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    TypeOrmModule.forFeature([User, AuthSession]),
    JwtModule.register({ global: true }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    GoogleStrategy,
    AccessStrategy,
    RefreshStrategy,
  ],
})
export class AuthModule {}
