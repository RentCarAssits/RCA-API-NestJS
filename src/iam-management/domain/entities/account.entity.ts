import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Subscription } from "src/subscription-management/domain/entity/Subscription.entity";

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text')
  name: string;

  @OneToOne(() => User, (user) => user.account)
  @JoinColumn()
  user: User;

  // subscription Bondex
  @OneToMany(() => Subscription, (Subscription) => Subscription.account, {
    onDelete: 'CASCADE',
    eager: true,
  })
  subscriptions: Subscription[];

  public getId(): number {
    return this.id;
  }

}
