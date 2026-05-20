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
  SubActivityPayload,
  SubActivityResponse,
  SubActivityUpdatePayload,
  SubActivityQuery,
  SubActivityPaginatedResponse,
} from './dtos';
import { IdParam, PaginationQuery } from 'src/lib/dtos';
import { SubActivitiesService } from './services';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sub-activities')
@Controller('sub-activities')
export class SubActivitiesController {
  constructor(private service: SubActivitiesService) {}

  // --- POST ---
  @ApiOperation({ summary: 'Create sub-activity' })
  @ApiResponse({ status: 201, type: SubActivityResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post('/')
  @Serialize(SubActivityResponse)
  create(@Body() payload: SubActivityPayload) {
    return this.service.create(payload);
  }

  // --- GET BY ID ---
  @ApiOperation({ summary: 'Get sub-activity by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: SubActivityResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Sub-activity not found' })
  @Get('/:id')
  @Serialize(SubActivityResponse)
  getById(@Param() { id }: IdParam) {
    return this.service.getById(id);
  }

  // --- UPDATE BY ID ---
  @ApiOperation({ summary: 'Update sub-activity by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: SubActivityResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Sub-activity not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Patch('/:id')
  @Serialize(SubActivityResponse)
  update(@Param() { id }: IdParam, @Body() payload: SubActivityUpdatePayload) {
    return this.service.update(id, payload);
  }

  // --- GET ALL ---
  @ApiOperation({ summary: 'Get list of sub-activities (paginated)' })
  @ApiResponse({ status: 200, type: SubActivityPaginatedResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/')
  @SerializeList(SubActivityResponse)
  list(
    @Query() { activity_id }: SubActivityQuery,
    @Query() pagination: PaginationQuery,
  ) {
    return this.service.list(pagination, activity_id);
  }

  // --- DELETE BY ID ---
  @ApiOperation({ summary: 'Delete sub-activity by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Sub-activity successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Sub-activity not found' })
  @Delete('/:id')
  deleteById(@Param() { id }: IdParam) {
    return this.service.deleteById(id);
  }
}
