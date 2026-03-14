import { Activity, ActivityGroup } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, Not, Repository } from 'typeorm';
import { ActivityPayload, ActivityUpdatePayload } from '../dtos';
import { PaginationQuery } from 'src/lib/dtos';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity) private repo: Repository<Activity>,
    @InjectRepository(ActivityGroup)
    private groupRepo: Repository<ActivityGroup>,
  ) {}

  private async validateActivityGroup(id: number) {
    const isExists = await this.groupRepo.existsBy({ id });
    if (!isExists) {
      throw new BadRequestException(
        `Activity group with id=${id} does not exist`,
      );
    }
  }

  private async validateActivityName(
    name: string,
    group_id: number,
    id?: number,
  ) {
    const isDuplicate = await this.repo.exists({
      where: { group: { id: group_id }, name, ...(id ? { id: Not(id) } : {}) },
    });
    if (isDuplicate) {
      throw new BadRequestException(
        `Activity with name "${name}" already exists in activity group`,
      );
    }
  }

  private async findById(
    id: number,
    options?: Omit<FindOneOptions<Activity>, 'where'>,
  ) {
    const activity = await this.repo.findOne({ where: { id }, ...options });
    if (!activity) {
      throw new NotFoundException(`activity with id=${id} does not exist`);
    }
    return activity;
  }

  async getById(id: number) {
    const activity = await this.findById(id, {
      select: { group: true },
      relations: { group: true },
    });
    if (!activity) {
      throw new NotFoundException(`activity with id=${id} does not exist`);
    }
    return activity;
  }

  async create(data: ActivityPayload) {
    await this.validateActivityGroup(data.group_id);
    await this.validateActivityName(data.name, data.group_id);

    const activity = this.repo.create({
      group: { id: data.group_id },
      name: data.name,
    });

    const { id } = await this.repo.save(activity);
    return this.getById(id);
  }

  async update(id: number, data: ActivityUpdatePayload) {
    if (data.group_id) {
      await this.validateActivityGroup(data.group_id);
    }

    let activity = await this.findById(id);

    await this.validateActivityName(
      data.name || activity.name,
      data.group_id || activity.group_id,
      id,
    );

    activity = {
      ...activity,
      name: data.name || activity.name,
      group: { id: data.group_id || activity.group_id } as Activity['group'],
    };

    await this.repo.save(activity);

    return this.getById(id);
  }

  async deleteById(id: number) {
    await this.repo.delete(id);
  }

  async list(pagination: PaginationQuery) {
    const [results, count] = await this.repo.findAndCount({
      skip: pagination.offset,
      take: pagination.limit,
      select: { group: true },
      relations: { group: true },
    });

    return { results, count };
  }
}
