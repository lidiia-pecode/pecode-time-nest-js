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
import { TimeLogsResponse } from './dtos/TimeLogsResponse.dto';
import { Serialize, SerializeList } from 'src/lib/interceptors';
import {
  TimeLogsPayload,
  TimeLogsUpdatePayload,
} from './dtos/TimeLogsPayload.dto';
import { IdParam } from 'src/lib/dtos/IdParam.dto';
import { TimeLogsQuery } from './dtos/TimeLogsQuery.dto';
import { TimeLogsService } from './time-logs.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Time-logs')
@Controller('time-logs')
export class TimeLogsController {
  constructor(private service: TimeLogsService) {}

  // --- GET ALL TIMELOGS ---
  @ApiOperation({ summary: 'Get list of timelogs (paginated)' })
  @Get('/')
  @SerializeList(TimeLogsResponse)
  getTimeLogs(@Query() query: TimeLogsQuery) {
    return this.service.list(query);
  }

  // --- GET TIMELOG BY ID ---
  @ApiOperation({ summary: 'Get timelog by id' })
  @Get('/:id')
  @Serialize(TimeLogsResponse)
  getById(@Param() { id }: IdParam) {
    return this.service.getTimeLogById(id);
  }

  // --- CREATE TIMELOG ---
  @ApiOperation({ summary: 'Create timelog' })
  @Post('/')
  @Serialize(TimeLogsResponse, { status: 201 })
  create(@Body() payload: TimeLogsPayload) {
    return this.service.createTimeLog(payload);
  }

  // --- UPDATE TIMELOG BY ID ---
  @ApiOperation({ summary: 'Update timelog by id' })
  @Patch('/:id')
  @Serialize(TimeLogsResponse)
  update(@Param() { id }: IdParam, @Body() payload: TimeLogsUpdatePayload) {
    return this.service.updateTimeLog(id, payload);
  }

  // --- DELETE TIMELOG BY ID ---
  @ApiOperation({ summary: 'Delete timelog by id' })
  @ApiResponse({
    status: 200,
    description: 'Timelog successfully deleted',
  })
  @Delete('/:id')
  delete(@Param() { id }: IdParam) {
    return this.service.deleteTimelog(id);
  }
}
