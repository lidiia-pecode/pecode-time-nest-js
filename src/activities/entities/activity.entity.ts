import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { ActivityGroup } from './activity-group.entity';

@Entity({ name: 'activities' })
@Unique(['name', 'group'])
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ManyToOne(() => ActivityGroup, { nullable: false })
  @JoinColumn({ name: 'group_id' })
  group: ActivityGroup;

  @RelationId((a: Activity) => a.group)
  group_id: number;
}
