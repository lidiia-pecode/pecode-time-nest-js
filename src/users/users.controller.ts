import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Serialize, SerializeList } from 'src/lib/interceptors';
import { UserResponse } from './dtos/UserResponse.dto';
import { IdParam, PaginationQuery } from 'src/lib/dtos';
import { UserPayload, UserUpdatePayload } from './dtos/UserPayload.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/lib/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Serialize(UserResponse)
  @Get('/me')
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Get('/')
  @SerializeList(UserResponse)
  list(@Query() pagination: PaginationQuery) {
    return this.service.list(pagination);
  }

  @Get(':id')
  @Serialize(UserResponse)
  get(@Param() { id }: IdParam) {
    return this.service.getUserById(id);
  }

  @Post('/')
  @Serialize(UserResponse)
  create(@Body() payload: UserPayload) {
    return this.service.createUser(payload);
  }

  @Patch(':id')
  @Serialize(UserResponse)
  update(
    @Param() { id }: IdParam,
    @Body() payload: UserUpdatePayload,
    @CurrentUser() currentUser: User,
  ) {
    if (id !== currentUser.id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.service.updateUser(id, payload);
  }

  @Delete(':id')
  delete(@Param() { id }: IdParam, @CurrentUser() currentUser: User) {
    if (id !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own profile');
    }
    return this.service.deleteUser(id);
  }
}
