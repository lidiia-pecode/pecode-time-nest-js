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
import { ActivityGroupResponse, ActivityGroupPayload } from './dtos';
import { IdParam, PaginationQuery } from 'src/lib/dtos';
import { ActivityGroupsService } from './services';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Activity-groups')
@Controller('activity-groups')
export class ActivityGroupsController {
  constructor(private service: ActivityGroupsService) {}

  // --- POST ---
  @ApiOperation({ summary: 'Create activity group' })
  @Post('/')
  @Serialize(ActivityGroupResponse, { status: 201 })
  create(@Body() payload: ActivityGroupPayload) {
    return this.service.create(payload);
  }

  // --- GET BY ID ---
  @ApiOperation({ summary: 'Get activity group by id' })
  @Get('/:id')
  @Serialize(ActivityGroupResponse)
  getById(@Param() { id }: IdParam) {
    return this.service.getById(id);
  }

  // --- UPDATE BY ID ---
  @ApiOperation({ summary: 'Update activity group by id' })
  @Patch('/:id')
  @Serialize(ActivityGroupResponse)
  update(@Param() { id }: IdParam, @Body() payload: ActivityGroupPayload) {
    return this.service.update(id, payload);
  }

  // --- GET ALL ---
  @ApiOperation({ summary: 'Get list of activity groups (paginated)' })
  @Get('/')
  @SerializeList(ActivityGroupResponse)
  list(@Query() pagination: PaginationQuery) {
    return this.service.list(pagination);
  }

  // --- DELETE BY ID ---
  @ApiOperation({ summary: 'Delete activity group by id' })
  @ApiResponse({
    status: 200,
    description: 'Activity group successfully deleted',
  })
  @Delete('/:id')
  deleteById(@Param() { id }: IdParam) {
    return this.service.deleteById(id);
  }
}
