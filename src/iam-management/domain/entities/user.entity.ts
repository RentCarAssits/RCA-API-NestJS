import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  fullName: string;

  @Column('text')
  address: string;

  @Column('text')
  email: string;

  @Column('text')
  phone: string;

  @Column('text')
  dni: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @OneToOne(() => Account, (cuenta) => cuenta.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  account: Account;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
