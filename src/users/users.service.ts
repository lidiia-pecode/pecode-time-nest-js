import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { UserPayload, UserUpdatePayload } from './dtos/UserPayload.dto';
import { PaginationQuery } from 'src/lib/dtos';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  private async validateCreateUser(username: string, email: string) {
    const existingUsername = await this.repo.findOneBy({ username });
    const existingEmail = await this.repo.findOneBy({ email });

    if (existingUsername) {
      throw new BadRequestException(
        `User with username "${username}" already exists`,
      );
    }

    if (existingEmail) {
      throw new BadRequestException(
        `User with email "${email}" already exists`,
      );
    }
  }

  private async validateUpdateUser(username: string, id: number) {
    const existingUsername = await this.repo.exists({
      where: { username, ...(id ? { id: Not(id) } : {}) },
    });

    if (existingUsername) {
      throw new BadRequestException(
        `User with username "${username}" already exists`,
      );
    }
  }

  async list(pagination: PaginationQuery) {
    const [results, count] = await this.repo.findAndCount({
      skip: pagination.offset,
      take: pagination.limit,
    });

    return { results, count };
  }

  async getUserById(id: number) {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} does not exist`);
    }

    return user;
  }

  async createUser(payload: UserPayload) {
    await this.validateCreateUser(payload.username, payload.email);

    const newUser = this.repo.create(payload);

    return await this.repo.save(newUser);
  }

  async updateUser(id: number, payload: UserUpdatePayload) {
    const user = await this.getUserById(id);

    if (payload.username) {
      await this.validateUpdateUser(payload.username, id);
    }

    return await this.repo.save({ ...user, ...payload });
  }

  async deleteUser(id: number) {
    await this.getUserById(id);
    await this.repo.delete(id);
  }
}
