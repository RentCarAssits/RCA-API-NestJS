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
import { Account } from 'src/iam-management/domain/entities/account.entity';

@Entity('Subscriptions')
export class Subscription extends AggregateRoot {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  private id: SubscriptionId;

  // acounts id
  @ApiProperty()
  @ManyToOne(()=> Account)
  @JoinColumn({name:'id'})
  accountId: number;
  

  //planes
  @ApiProperty()
  @ManyToOne(()=>Plan)
  @JoinColumn({name:'id'})
  public plan:number;

  @ApiProperty()
  @Column()
  private readonly unitPrice: number;

  @ApiProperty()
  @Column(()=> SubscriptionFrequency, { prefix: false })
  private readonly frequency: SubscriptionFrequency;

  @ApiProperty()
  @Column(() => Period, { prefix: false })
  private readonly period: Period;

  public constructor(accountId: number,
    planId:number,
    UnitPrice: number,
    Frequency: SubscriptionFrequency,
    Period: Period,
  ) {
    super();
    this.accountId = accountId;
    this.plan = planId;
    this.unitPrice = UnitPrice;
    this.frequency = Frequency;
    this.period = Period;
  }

  
  public register(){
      const event = new SubscriptionRegistered(
        this.id.getValue(),
        this.accountId,
        this.plan,
        this.unitPrice,
        this.frequency.getValue(),
        this.period.getStartDate(),
        this.period.getEndDate(),
      )
  }
  
    
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

  public getAccount(): number {
    return this.accountId;
  }

  public changeId(id: SubscriptionId) {
    this.id = id;
  }

}
