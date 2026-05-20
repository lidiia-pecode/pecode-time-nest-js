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
import { UserPaginatedResponse, UserResponse } from './dtos/UserResponse.dto';
import { IdParam, PaginationQuery } from 'src/lib/dtos';
import { UserPayload, UserUpdatePayload } from './dtos/UserPayload.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/lib/decorators/current-user.decorator';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  // --- GET ME ---
  @Serialize(UserResponse)
  @Get('/me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, type: UserResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  // --- GET ALL USERS ---
  @Get('/')
  @ApiOperation({ summary: 'Get list of all users (paginated)' })
  @ApiResponse({ status: 200, type: UserPaginatedResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @SerializeList(UserResponse)
  list(@Query() pagination: PaginationQuery) {
    return this.service.list(pagination);
  }

  // --- GET USER BY ID ---
  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: UserResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Serialize(UserResponse)
  get(@Param() { id }: IdParam) {
    return this.service.getUserById(id);
  }

  // --- CRAETE USER ---
  @Post('/')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: UserResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Serialize(UserResponse)
  create(@Body() payload: UserPayload) {
    return this.service.createUser(payload);
  }

  // --- UPDATE USER BY ID ---
  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: UserResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 400, description: 'Validation error' })
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
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  delete(@Param() { id }: IdParam, @CurrentUser() currentUser: User) {
    if (id !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own profile');
    }
    return this.service.deleteUser(id);
  }
}
