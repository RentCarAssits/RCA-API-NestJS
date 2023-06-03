import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @OneToOne(() => User, (user) => user.account)
  @JoinColumn()
  user: User;
}
