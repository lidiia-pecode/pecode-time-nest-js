import { ActivityGroup } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { ActivityGroupPayload } from '../dtos';
import { PaginationQuery } from 'src/lib/dtos';

@Injectable()
export class ActivityGroupsService {
  constructor(
    @InjectRepository(ActivityGroup) private repo: Repository<ActivityGroup>,
  ) {}

  private async validateGroupName(name: string, id?: number) {
    const isDuplicate = await this.repo.exists({
      where: { name, ...(id ? { id: Not(id) } : {}) },
    });
    if (isDuplicate) {
      throw new BadRequestException(
        `Activity group with name "${name}" already exists`,
      );
    }
  }

  async getById(id: number) {
    const activityGroup = await this.repo.findOne({ where: { id } });
    if (!activityGroup) {
      throw new NotFoundException(
        `activity group with id=${id} does not exist`,
      );
    }
    return activityGroup;
  }

  async create(data: ActivityGroupPayload) {
    await this.validateGroupName(data.name);

    const activityGroup = this.repo.create({
      name: data.name,
    });

    return await this.repo.save(activityGroup);
  }

  async update(id: number, data: ActivityGroupPayload) {
    let activityGroup = await this.getById(id);

    await this.validateGroupName(data.name, id);

    return await this.repo.save({ ...activityGroup, name: data.name });
  }

  async deleteById(id: number) {
    await this.getById(id);
    await this.repo.delete(id);
  }

  async list(pagination: PaginationQuery) {
    const [results, count] = await this.repo.findAndCount({
      skip: pagination.offset,
      take: pagination.limit,
    });

    return { results, count };
  }
}
