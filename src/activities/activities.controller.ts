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
  ActivityPaginatedResponse,
  ActivityPayload,
  ActivityResponse,
  ActivityUpdatePayload,
} from './dtos';
import { PaginationQuery, IdParam } from 'src/lib/dtos';
import { ActivitiesService } from './services';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private service: ActivitiesService) {}

  // --- POST ---
  @ApiOperation({ summary: 'Create activity' })
  @ApiResponse({ status: 201, type: ActivityResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post('/')
  @Serialize(ActivityResponse)
  create(@Body() payload: ActivityPayload) {
    return this.service.create(payload);
  }

  // --- GET BY ID ---
  @ApiOperation({ summary: 'Get activity by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: ActivityResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  @Get('/:id')
  @Serialize(ActivityResponse)
  getById(@Param() { id }: IdParam) {
    return this.service.getById(id);
  }

  // --- UPDATE BY ID ---
  @ApiOperation({ summary: 'Update activity by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: ActivityResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Patch('/:id')
  @Serialize(ActivityResponse)
  update(@Param() { id }: IdParam, @Body() payload: ActivityUpdatePayload) {
    return this.service.update(id, payload);
  }

  // --- GET ALL ---
  @ApiOperation({ summary: 'Get list of activities (paginated)' })
  @ApiResponse({ status: 200, type: ActivityPaginatedResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/')
  @SerializeList(ActivityResponse)
  list(@Query() pagination: PaginationQuery) {
    return this.service.list(pagination);
  }

  // --- DELETE BY ID ---
  @ApiOperation({ summary: 'Delete activity by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Activity successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  @Delete('/:id')
  deleteById(@Param() { id }: IdParam) {
    return this.service.deleteById(id);
  }
}
