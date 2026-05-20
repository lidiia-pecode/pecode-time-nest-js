import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  Delete,
} from '@nestjs/common';
import { Serialize, SerializeList } from 'src/lib/interceptors';
import {
  ActivityGroupResponse,
  ActivityGroupPayload,
  ActivityGroupPaginatedResponse,
} from './dtos';
import { IdParam, PaginationQuery } from 'src/lib/dtos';
import { ActivityGroupsService } from './services';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Activity-groups')
@Controller('activity-groups')
export class ActivityGroupsController {
  constructor(private service: ActivityGroupsService) {}

  // --- POST ---
  @ApiOperation({ summary: 'Create activity group' })
  @ApiResponse({ status: 201, type: ActivityGroupResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post('/')
  @Serialize(ActivityGroupResponse)
  create(@Body() payload: ActivityGroupPayload) {
    return this.service.create(payload);
  }

  // --- GET BY ID ---
  @ApiOperation({ summary: 'Get activity group by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: ActivityGroupResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Activity group not found' })
  @Get('/:id')
  @Serialize(ActivityGroupResponse)
  getById(@Param() { id }: IdParam) {
    return this.service.getById(id);
  }

  // --- UPDATE BY ID ---
  @ApiOperation({ summary: 'Update activity group by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: ActivityGroupResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Activity group not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Patch('/:id')
  @Serialize(ActivityGroupResponse)
  update(@Param() { id }: IdParam, @Body() payload: ActivityGroupPayload) {
    return this.service.update(id, payload);
  }

  // --- GET ALL ---
  @ApiOperation({ summary: 'Get list of activity groups (paginated)' })
  @ApiResponse({ status: 200, type: ActivityGroupPaginatedResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/')
  @SerializeList(ActivityGroupResponse)
  list(@Query() pagination: PaginationQuery) {
    return this.service.list(pagination);
  }

  // --- DELETE BY ID ---
  @ApiOperation({ summary: 'Delete activity group by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Activity group successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Activity group not found' })
  @Delete('/:id')
  deleteById(@Param() { id }: IdParam) {
    return this.service.deleteById(id);
  }
}
