import { Module } from '@nestjs/common';
import { ActivitiesModule } from './activities/activities.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity, ActivityGroup, SubActivity } from './activities/entities';
import { UsersModule } from './users/users.module';
import { TimeLogsModule } from './time-logs/time-logs.module';
import { User } from './users/entities/user.entity';
import { TimeLog } from './time-logs/entities/time-log.entity';
import { AuthModule } from './auth/auth.module';
import { AuthSession } from './auth/entities/auth-session.entity';
import { APP_GUARD } from '@nestjs/core';
import { AccessGuard } from './auth/guards';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +(process.env.DATABASE_PORT ?? 5432),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        Activity,
        ActivityGroup,
        SubActivity,
        User,
        TimeLog,
        AuthSession,
      ],
      synchronize: false,
    }),

    ActivitiesModule,
    UsersModule,
    TimeLogsModule,
    AuthModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
})
export class AppModule {}
