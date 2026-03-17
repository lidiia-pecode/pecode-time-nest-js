import {
  Body,
  Controller,
  Delete,
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

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

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
  update(@Param() { id }: IdParam, @Body() payload: UserUpdatePayload) {
    return this.service.updateUser(id, payload);
  }

  @Delete(':id')
  delete(@Param() { id }: IdParam) {
    return this.service.deleteUser(id);
  }
}
