import { AggregateRoot } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscriptionId } from '../values/subscription-id.value';
import { Period } from '../values/period.value';
import { Plan } from './plan.entity';
import { SubscriptionFrequency } from '../values/subscription-frequency.value';
import { SubscriptionRegistered } from '../events/subscription-registered.event';

@Entity('Subscriptions')
export class Subscription extends AggregateRoot {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  private id: SubscriptionId;

  /*
  @ApiProperty()
  @ManyToOne(()=> Account, (account)=> account.subscriptions,{
      onDelete:'CASCADE',
  })
  account: Account;
  */

  //planes
  @ManyToOne(()=>Plan, plan=>plan.subscriptions)
  public plan:Plan;

  @ApiProperty()
  @Column()
  private readonly unitPrice: number;

  @ApiProperty()
  @Column(()=> SubscriptionFrequency, { prefix: false })
  private readonly frequency: SubscriptionFrequency;

  @ApiProperty()
  @Column(() => Period, { prefix: false })
  private readonly period: Period;

  public constructor(
    UnitPrice: number,
    Frequency: SubscriptionFrequency,
    Period: Period,
  ) {
    super();
    this.unitPrice = UnitPrice;
    this.frequency = Frequency;
    this.period = Period;
  }

  
  public register(){
      const event = new SubscriptionRegistered(
        this.id.getValue(),
        this.unitPrice,
        this.frequency.getValue(),
        this.period.getStartDate(),
        this.period.getEndDate(),
      )
  }
  
  /*
  public getAccount(): Account {
      return this.account;
  }
  */
  
  public getId(): SubscriptionId {
    return this.id;
  }

  public getUnitPrice(): number {
    return this.unitPrice;
  }

  public getFrequency(): SubscriptionFrequency {
    return this.frequency;
  }

  public getPeriod(): Period {
    return this.period;
  }

  public changeId(id: SubscriptionId) {
    this.id = id;
  }

}
