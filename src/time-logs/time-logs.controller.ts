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
import {
  TimeLogsPaginatedResponse,
  TimeLogsResponse,
} from './dtos/TimeLogsResponse.dto';
import { Serialize, SerializeList } from 'src/lib/interceptors';
import {
  TimeLogsPayload,
  TimeLogsUpdatePayload,
} from './dtos/TimeLogsPayload.dto';
import { IdParam } from 'src/lib/dtos/IdParam.dto';
import { TimeLogsQuery } from './dtos/TimeLogsQuery.dto';
import { TimeLogsService } from './time-logs.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Time-logs')
@Controller('time-logs')
export class TimeLogsController {
  constructor(private service: TimeLogsService) {}

  // --- GET ALL TIMELOGS ---
  @ApiOperation({ summary: 'Get list of timelogs (paginated)' })
  @ApiResponse({ status: 200, type: TimeLogsPaginatedResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/')
  @SerializeList(TimeLogsResponse)
  getTimeLogs(@Query() query: TimeLogsQuery) {
    return this.service.list(query);
  }

  // --- GET TIMELOG BY ID ---
  @ApiOperation({ summary: 'Get timelog by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: TimeLogsResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Timelog not found' })
  @Get('/:id')
  @Serialize(TimeLogsResponse)
  getById(@Param() { id }: IdParam) {
    return this.service.getTimeLogById(id);
  }

  // --- CREATE TIMELOG ---
  @ApiOperation({ summary: 'Create timelog' })
  @ApiResponse({ status: 201, type: TimeLogsResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post('/')
  @Serialize(TimeLogsResponse)
  create(@Body() payload: TimeLogsPayload) {
    return this.service.createTimeLog(payload);
  }

  // --- UPDATE TIMELOG BY ID ---
  @ApiOperation({ summary: 'Update timelog by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: TimeLogsResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Timelog not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Patch('/:id')
  @Serialize(TimeLogsResponse)
  update(@Param() { id }: IdParam, @Body() payload: TimeLogsUpdatePayload) {
    return this.service.updateTimeLog(id, payload);
  }

  // --- DELETE TIMELOG BY ID ---
  @ApiOperation({ summary: 'Delete timelog by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Timelog successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Timelog not found' })
  @Delete('/:id')
  delete(@Param() { id }: IdParam) {
    return this.service.deleteTimelog(id);
  }
}
