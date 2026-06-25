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
  ActivityPayload,
  ActivityResponse,
  ActivityUpdatePayload,
} from './dtos';
import { PaginationQuery, IdParam } from 'src/lib/dtos';
import { ActivitiesService } from './services';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private service: ActivitiesService) {}

  // --- POST ---
  @ApiOperation({ summary: 'Create activity' })
  @Post('/')
  @Serialize(ActivityResponse, { status: 201 })
  create(@Body() payload: ActivityPayload) {
    return this.service.create(payload);
  }

  // --- GET BY ID ---
  @ApiOperation({ summary: 'Get activity by id' })
  @Get('/:id')
  @Serialize(ActivityResponse)
  getById(@Param() { id }: IdParam) {
    return this.service.getById(id);
  }

  // --- UPDATE BY ID ---
  @ApiOperation({ summary: 'Update activity by id' })
  @Patch('/:id')
  @Serialize(ActivityResponse)
  update(@Param() { id }: IdParam, @Body() payload: ActivityUpdatePayload) {
    return this.service.update(id, payload);
  }

  // --- GET ALL ---
  @ApiOperation({ summary: 'Get list of activities (paginated)' })
  @Get('/')
  @SerializeList(ActivityResponse)
  list(@Query() pagination: PaginationQuery) {
    return this.service.list(pagination);
  }

  // --- DELETE BY ID ---
  @ApiOperation({ summary: 'Delete activity by id' })
  @ApiResponse({
    status: 200,
    description: 'Activity successfully deleted',
  })
  @Delete('/:id')
  deleteById(@Param() { id }: IdParam) {
    return this.service.deleteById(id);
  }
}
