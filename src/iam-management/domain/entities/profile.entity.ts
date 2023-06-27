import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  fullName: string;

  @Column('text')
  address: string;

  @Column('text')
  phone: string;

  @Column('text')
  dni: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}
