import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'first_name', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 255, name: 'last_name', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  username: string;
}
