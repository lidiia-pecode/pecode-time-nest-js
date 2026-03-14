import { Activity, SubActivity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { SubActivityPayload, SubActivityUpdatePayload } from '../dtos';
import { PaginationQuery } from 'src/lib/dtos';

@Injectable()
export class SubActivitiesService {
  constructor(
    @InjectRepository(SubActivity) private repo: Repository<SubActivity>,
    @InjectRepository(Activity) private activityRepo: Repository<Activity>,
  ) {}

  private async validateActivity(id: number) {
    const isExists = await this.activityRepo.existsBy({ id });
    if (!isExists) {
      throw new BadRequestException(`Activity with id=${id} does not exist`);
    }
  }

  private async validateSubActivityName(
    name: string,
    activity_id: number,
    id?: number,
  ) {
    const isDuplicate = await this.repo.exists({
      where: {
        activity: { id: activity_id },
        name,
        ...(id ? { id: Not(id) } : {}),
      },
    });
    if (isDuplicate) {
      throw new BadRequestException(
        `Sub activity with name "${name}" already exists in activity`,
      );
    }
  }

  async getById(id: number) {
    const subActivity = await this.repo.findOne({ where: { id } });
    if (!subActivity) {
      throw new NotFoundException(`Sub activity with id=${id} does not exist`);
    }
    return subActivity;
  }

  async create(data: SubActivityPayload) {
    await this.validateActivity(data.activity_id);
    await this.validateSubActivityName(data.name, data.activity_id);

    const subActivity = this.repo.create({
      activity: { id: data.activity_id },
      name: data.name,
    });

    const { id } = await this.repo.save(subActivity);
    return this.getById(id);
  }

  async update(id: number, data: SubActivityUpdatePayload) {
    let subActivity = await this.getById(id);

    await this.validateSubActivityName(
      data.name || subActivity.name,
      subActivity.activity_id,
      id,
    );

    subActivity = {
      ...subActivity,
      name: data.name,
    };

    await this.repo.save(subActivity);

    return this.getById(id);
  }

  async deleteById(id: number) {
    await this.repo.delete(id);
  }

  async list(pagination: PaginationQuery, activity_id?: number) {
    const [results, count] = await this.repo.findAndCount({
      skip: pagination.offset,
      take: pagination.limit,
      ...(activity_id ? { where: { activity: { id: activity_id } } } : {}),
    });

    return { results, count };
  }
}
