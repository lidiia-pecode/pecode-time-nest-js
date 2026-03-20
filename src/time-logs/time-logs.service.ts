import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeLog } from './entities/time-log.entity';
import { Repository } from 'typeorm';
import {
  TimeLogsPayload,
  TimeLogsUpdatePayload,
  TimeLogType,
} from './dtos/TimeLogsPayload.dto';
import { TimeLogsQuery } from './dtos/TimeLogsQuery.dto';
import { Activity, SubActivity } from 'src/activities/entities';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TimeLogsService {
  constructor(
    @InjectRepository(TimeLog) private timelogRepo: Repository<TimeLog>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Activity) private activityRepo: Repository<Activity>,
    @InjectRepository(SubActivity) private subActRepo: Repository<SubActivity>,
  ) {}

  private async validateTimeLog(
    payload: TimeLogsPayload | TimeLogsUpdatePayload,
  ) {
    if (payload.type === TimeLogType.WORK_ACTIVITY) {
      if (!payload.activity_id && !payload.sub_activity_id) {
        throw new BadRequestException(
          'WORK_ACTIVITY requires activity_id or sub_activity_id',
        );
      }
    }

    if ('user_id' in payload && payload.user_id) {
      const user = await this.userRepo.findOneBy({ id: payload.user_id });

      if (!user) {
        throw new BadRequestException(
          `User with id: ${payload.user_id} doesn't exist`,
        );
      }
    }

    let activity: Activity | null = null;
    let subActivity: SubActivity | null = null;

    if (payload.activity_id) {
      activity = await this.activityRepo.findOneBy({ id: payload.activity_id });

      if (!activity) {
        throw new BadRequestException(
          `Activity with id: ${payload.activity_id} doesn't exist`,
        );
      }
    }

    if (payload.sub_activity_id) {
      subActivity = await this.subActRepo.findOneBy({
        id: payload.sub_activity_id,
      });

      if (!subActivity) {
        throw new BadRequestException(
          `SubActivity with id: ${payload.sub_activity_id} doesn't exist`,
        );
      }
    }

    if (payload.activity_id && payload.sub_activity_id) {
      if (subActivity?.activity_id !== activity?.id) {
        throw new BadRequestException(
          `SubActivity ${subActivity?.id} does not belong to Activity ${activity?.id}`,
        );
      }
    }
  }

  private async validateDailyHours(
    userId: number,
    date: string,
    time: number,
    excludeId?: number,
  ) {
    const qb = this.timelogRepo
      .createQueryBuilder('timeLog')
      .select('SUM(timeLog.time)', 'total')
      .where('timeLog.user_id = :userId', { userId })
      .andWhere('timeLog.date = :date', { date });

    if (excludeId) {
      qb.andWhere('timeLog.id != :excludeId', { excludeId });
    }

    const result = (await qb.getRawOne<{ total: string | null }>()) || {
      total: null,
    };
    const total = Number(result.total ?? 0);

    if (total + time > 1440) {
      throw new BadRequestException(
        `Total logged time for ${date} cannot exceed 24 hours`,
      );
    }
  }

  async list(query: TimeLogsQuery) {
    const qb = this.timelogRepo.createQueryBuilder('timeLog');

    if (query.user_id) {
      qb.andWhere('timeLog.user_id = :userId', { userId: query.user_id });
    }

    if (query.start_date) {
      qb.andWhere('timeLog.date >= :start', { start: query.start_date });
    }

    if (query.end_date) {
      qb.andWhere('timeLog.date <= :end', { end: query.end_date });
    }

    qb.skip(query.offset).take(query.limit);

    const [results, count] = await qb.getManyAndCount();

    return { results, count };
  }

  async getTimeLogById(id: number) {
    const timeLog = await this.timelogRepo.findOneBy({ id });

    if (!timeLog) {
      throw new NotFoundException(`Time log with id: ${id} does not exist`);
    }

    return timeLog;
  }

  async createTimeLog(payload: TimeLogsPayload) {
    await this.validateTimeLog(payload);

    await this.validateDailyHours(payload.user_id, payload.date, payload.time);

    const timeLog = this.timelogRepo.create({
      type: payload.type,
      time: payload.time,
      date: payload.date,
      user: { id: payload.user_id },
      activity: payload.activity_id ? { id: payload.activity_id } : null,
      sub_activity: payload.sub_activity_id
        ? { id: payload.sub_activity_id }
        : null,
    });

    return this.timelogRepo.save(timeLog);
  }

  async updateTimeLog(id: number, payload: TimeLogsUpdatePayload) {
    const timeLog = await this.getTimeLogById(id);

    const updated = Object.assign({}, timeLog, payload);

    await this.validateTimeLog(updated);

    await this.validateDailyHours(
      timeLog.user_id,
      updated.date,
      updated.time,
      id,
    );

    return this.timelogRepo.save(updated);
  }

  async deleteTimelog(id: number) {
    await this.getTimeLogById(id);
    await this.timelogRepo.delete(id);
  }
}
