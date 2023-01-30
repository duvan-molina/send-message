import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'single' })
  chatType: string;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @CreateDateColumn({ type: 'timestamp' })
  creation_date: string;
}
