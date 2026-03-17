import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { TimeLogType } from '../dtos/TimeLogsPayload.dto';
import { User } from 'src/users/entities/user.entity';
import { Activity, SubActivity } from 'src/activities/entities';

@Entity({ name: 'time_logs' })
@Check(
  `"type" != 'WORK_ACTIVITY' OR "activity_id" IS NOT NULL OR "sub_activity_id" IS NOT NULL`,
)
export class TimeLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TimeLogType, nullable: false })
  type: TimeLogType;

  @ManyToOne(() => Activity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'activity_id' })
  @Index('idx_time_logs_activity')
  activity: Activity | null;

  @RelationId((t: TimeLog) => t.activity)
  activity_id: number | null;

  @ManyToOne(() => SubActivity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sub_activity_id' })
  @Index('idx_time_logs_sub_activity')
  subActivity: SubActivity | null;

  @RelationId((t: TimeLog) => t.subActivity)
  sub_activity_id: number | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  @Index('idx_time_logs_user')
  user: User;

  @RelationId((t: TimeLog) => t.user)
  user_id: number;

  @Column({ type: 'int', nullable: false })
  @Check(`"time" > 0 AND "time" <= 24`)
  time: number;

  @Column({ type: 'date', nullable: false })
  date: string;
}
