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

@Controller('time-logs')
export class TimeLogsController {
  constructor(private service: TimeLogsService) {}

  @Get('/')
  @SerializeList(TimeLogsResponse)
  getTimeLogs(@Query() query: TimeLogsQuery) {
    return this.service.list(query);
  }

  @Get('/:id')
  @Serialize(TimeLogsResponse)
  getById(@Param() { id }: IdParam) {
    return this.service.getTimeLogById(id);
  }

  @Post('/')
  @Serialize(TimeLogsResponse)
  create(@Body() payload: TimeLogsPayload) {
    return this.service.createTimeLog(payload);
  }

  @Patch('/:id')
  @Serialize(TimeLogsResponse)
  update(@Param() { id }: IdParam, @Body() payload: TimeLogsUpdatePayload) {
    return this.service.updateTimeLog(id, payload);
  }

  @Delete('/:id')
  delete(@Param() { id }: IdParam) {
    return this.service.deleteTimelog(id);
  }
}
