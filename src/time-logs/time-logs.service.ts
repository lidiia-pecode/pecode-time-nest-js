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

@Injectable()
export class TimeLogsService {
  constructor(@InjectRepository(TimeLog) private repo: Repository<TimeLog>) {}

  private validateTimeLog(payload: TimeLogsPayload | TimeLogsUpdatePayload) {
    if (payload.type === TimeLogType.WORK_ACTIVITY) {
      if (!payload.activity_id && !payload.sub_activity_id) {
        throw new BadRequestException(
          'WORK_ACTIVITY requires activity_id or sub_activity_id',
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
    const qb = this.repo
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

    if (total + time > 24) {
      throw new BadRequestException(
        `Total logged time for ${date} cannot exceed 24 hours`,
      );
    }
  }

  async list(query: TimeLogsQuery) {
    const qb = this.repo.createQueryBuilder('timeLog');

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
    const timeLog = await this.repo.findOneBy({ id });

    if (!timeLog) {
      throw new NotFoundException(`Time log with id: ${id} does not exist`);
    }

    return timeLog;
  }

  async createTimeLog(payload: TimeLogsPayload) {
    this.validateTimeLog(payload);

    await this.validateDailyHours(payload.user_id, payload.date, payload.time);

    const timeLog = this.repo.create({
      type: payload.type,
      time: payload.time,
      date: payload.date,
      user: { id: payload.user_id },
      activity: payload.activity_id ? { id: payload.activity_id } : null,
      subActivity: payload.sub_activity_id
        ? { id: payload.sub_activity_id }
        : null,
    });

    return this.repo.save(timeLog);
  }

  async updateTimeLog(id: number, payload: TimeLogsUpdatePayload) {
    const timeLog = await this.getTimeLogById(id);

    const updated = Object.assign({}, timeLog, payload);

    this.validateTimeLog(updated);

    await this.validateDailyHours(
      timeLog.user_id,
      updated.date,
      updated.time,
      id,
    );

    return this.repo.save(updated);
  }

  async deleteTimelog(id: number) {
    await this.getTimeLogById(id);
    await this.repo.delete(id);
  }
}
