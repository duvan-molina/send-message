import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firtsName: string;

  @Column()
  lastName: string;

  @CreateDateColumn({ type: 'timestamp' })
  creation_date: string;
}
