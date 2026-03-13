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
  TimeLogType,
} from './dtos/TimeLogsPayload.dto';
import { IdParam } from 'src/lib/dtos/IdParam.dto';
import { TimeLogsQuery } from './dtos/TimeLogsQuery.dto';

const HARDCODED_TIME_LOGS: TimeLogsResponse[] = [
  {
    id: 1,
    type: TimeLogType.WORK_ACTIVITY,
    activity_id: 1,
    sub_activity_id: 1,
    user_id: 1,
    time: 8,
    date: '2026-03-04',
  },

  {
    id: 2,
    type: TimeLogType.PAID_VACATION,
    activity_id: null,
    sub_activity_id: null,
    user_id: 2,
    time: 8,
    date: '2026-03-05',
  },

  {
    id: 3,
    type: TimeLogType.WORK_ACTIVITY,
    activity_id: 3,
    sub_activity_id: null,
    user_id: 1,
    time: 8,
    date: '2026-03-06',
  },
];

@Controller('time-logs')
export class TimeLogsController {
  @Get('/')
  @SerializeList(TimeLogsResponse)
  getTimeLogs(@Query() query: TimeLogsQuery) {
    let results = HARDCODED_TIME_LOGS;

    if (query.user_id) {
      results = results.filter((log) => log.user_id === query.user_id);
    }

    if (query.start_date) {
      results = results.filter((log) => log.date >= query.start_date!);
    }

    if (query.end_date) {
      results = results.filter((log) => log.date <= query.end_date!);
    }

    return {
      next: null,
      previous: null,
      count: results.length,
      results,
    };
  }

  @Get('/:id')
  @Serialize(TimeLogsResponse)
  getById(@Param() { id }: IdParam) {
    return HARDCODED_TIME_LOGS.find((log) => log.id === Number(id));
  }

  @Post('/')
  @Serialize(TimeLogsResponse)
  create(@Body() payload: TimeLogsPayload) {
    return HARDCODED_TIME_LOGS;
  }

  @Patch('/:id')
  @Serialize(TimeLogsResponse)
  update(@Param() { id }: IdParam, @Body() payload: TimeLogsUpdatePayload) {
    return HARDCODED_TIME_LOGS;
  }

  @Delete('/:id')
  delete(@Param() { id }: IdParam) {}
}
