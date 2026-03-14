import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { SubActivitiesController } from './sub-activities.controller';
import { ActivityGroupsController } from './activity-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity, ActivityGroup, SubActivity } from './entities';
import {
  ActivitiesService,
  ActivityGroupsService,
  SubActivitiesService,
} from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, ActivityGroup, SubActivity])],
  controllers: [
    ActivitiesController,
    SubActivitiesController,
    ActivityGroupsController,
  ],
  providers: [ActivityGroupsService, ActivitiesService, SubActivitiesService],
  exports: [ActivityGroupsService, ActivitiesService, SubActivitiesService],
})
export class ActivitiesModule {}
