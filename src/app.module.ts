import { Module } from '@nestjs/common';
import { ActivitiesModule } from './activities/activities.module';
import { UsersModule } from './users/users.module';
import { TimeLogsModule } from './time-logs/time-logs.module';

@Module({
  imports: [ActivitiesModule, UsersModule, TimeLogsModule],
})
export class AppModule {}
