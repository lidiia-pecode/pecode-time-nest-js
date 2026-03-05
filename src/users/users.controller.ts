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

const HARDCODED_USER: UserResponse = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Lidiia',
  lastName: 'Tsymborovych',
  username: 'lidocaine',
};

@Controller('users')
export class UsersController {
  @Get('/')
  @SerializeList(UserResponse)
  list(@Query() pagination: PaginationQuery) {
    return {
      next: null,
      previous: null,
      count: 1,
      results: [HARDCODED_USER],
    };
  }

  @Get(':id')
  @Serialize(UserResponse)
  get(@Param() { id }: IdParam) {
    return HARDCODED_USER;
  }

  @Post('/')
  @Serialize(UserResponse)
  create(@Body() payload: UserPayload) {
    return HARDCODED_USER;
  }

  @Patch(':id')
  @Serialize(UserResponse)
  update(@Param() { id }: IdParam, @Body() payload: UserUpdatePayload) {
    return HARDCODED_USER;
  }

  @Delete(':id')
  delete(@Param() { id }: IdParam) {}
}
