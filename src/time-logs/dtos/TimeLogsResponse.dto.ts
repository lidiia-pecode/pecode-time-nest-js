import { Expose } from 'class-transformer';
import { TimeLogType } from './TimeLogsPayload.dto';

export class TimeLogsResponse {
  @Expose()
  id: number;

  @Expose()
  type: TimeLogType;

  @Expose()
  activity_id?: number;

  @Expose()
  sub_activity_id?: number;

  @Expose()
  user_id: number;

  @Expose()
  time: number;

  @Expose()
  date: Date;
}
