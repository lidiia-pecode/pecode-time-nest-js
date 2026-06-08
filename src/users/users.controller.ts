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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  // --- GET ME ---

  @Get('/me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @Serialize(UserResponse)
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  // --- GET ALL USERS ---
  @Get('/')
  @ApiOperation({ summary: 'Get list of all users (paginated)' })
  @SerializeList(UserResponse)
  list(@Query() pagination: PaginationQuery) {
    return this.service.list(pagination);
  }

  // --- GET USER BY ID ---
  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @Serialize(UserResponse)
  get(@Param() { id }: IdParam) {
    return this.service.getUserById(id);
  }

  // --- CRAETE USER ---
  @Post('/')
  @ApiOperation({ summary: 'Create user' })
  @Serialize(UserResponse, { status: 201 })
  create(@Body() payload: UserPayload) {
    return this.service.createUser(payload);
  }

  // --- UPDATE USER BY ID ---
  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
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

  // --- DELETE USER BY ID ---
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  delete(@Param() { id }: IdParam, @CurrentUser() currentUser: User) {
    if (id !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own profile');
    }
    return this.service.deleteUser(id);
  }
}
