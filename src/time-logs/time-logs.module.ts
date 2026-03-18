import { Module } from '@nestjs/common';
import { TimeLogsController } from './time-logs.controller';
import { TimeLogsService } from './time-logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeLog } from './entities/time-log.entity';
import { User } from 'src/users/entities/user.entity';
import { Activity, SubActivity } from 'src/activities/entities';

@Module({
  imports: [TypeOrmModule.forFeature([TimeLog, User, Activity, SubActivity])],
  controllers: [TimeLogsController],
  providers: [TimeLogsService],
})
export class TimeLogsModule {}
