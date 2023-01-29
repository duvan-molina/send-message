import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class PhoneNumber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phoneNumber: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @CreateDateColumn({ type: 'timestamp' })
  creation_date: string;
}
