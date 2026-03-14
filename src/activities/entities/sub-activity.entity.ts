import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { Activity } from './activity.entity';

@Entity({ name: 'sub_activities' })
@Unique(['name', 'activity'])
export class SubActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ManyToOne(() => Activity, { nullable: false })
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @RelationId((a: SubActivity) => a.activity)
  activity_id: number;
}
