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
} from './dtos';
import { IdParam, PaginationQuery } from 'src/lib/dtos';
import { SubActivitiesService } from './services';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sub-activities')
@Controller('sub-activities')
export class SubActivitiesController {
  constructor(private service: SubActivitiesService) {}

  // --- POST ---
  @ApiOperation({ summary: 'Create sub-activity' })
  @Post('/')
  @Serialize(SubActivityResponse, { status: 201 })
  create(@Body() payload: SubActivityPayload) {
    return this.service.create(payload);
  }

  // --- GET BY ID ---
  @ApiOperation({ summary: 'Get sub-activity by id' })
  @Get('/:id')
  @Serialize(SubActivityResponse)
  getById(@Param() { id }: IdParam) {
    return this.service.getById(id);
  }

  // --- UPDATE BY ID ---
  @ApiOperation({ summary: 'Update sub-activity by id' })
  @Patch('/:id')
  @Serialize(SubActivityResponse)
  update(@Param() { id }: IdParam, @Body() payload: SubActivityUpdatePayload) {
    return this.service.update(id, payload);
  }

  // --- GET ALL ---
  @ApiOperation({ summary: 'Get list of sub-activities (paginated)' })
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
  @ApiResponse({
    status: 200,
    description: 'Sub-activity successfully deleted',
  })
  @Delete('/:id')
  deleteById(@Param() { id }: IdParam) {
    return this.service.deleteById(id);
  }
}
