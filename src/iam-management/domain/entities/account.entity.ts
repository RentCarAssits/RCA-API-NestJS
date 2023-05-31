import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  username: string;

  @Column('text')
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @OneToOne(() => User, (user) => user.account)
  user: User;

  @Column('simple-array')
  roles: string[];

  //
}

//AÑADIR REALACIONES PARA LOS DEMÁS BOUNDED CONTEXT
