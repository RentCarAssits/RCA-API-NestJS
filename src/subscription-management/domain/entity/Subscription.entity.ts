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
  @ManyToOne(()=> Account,(account)=>account.subscriptions)
  account: number;
  

  //planes
  @ApiProperty()
  @ManyToOne(()=>Plan,(plan)=> plan.subscriptions)
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

  @ApiProperty()
  @Column()
  private readonly Subscriptiondiscount: number;

  public constructor(accountId: number,
    planId:number,
    UnitPrice: number,
    Frequency: SubscriptionFrequency,
    Period: Period,
    Discount: number,
  ) {
    super();
    this.account = accountId;
    this.plan = planId;
    this.unitPrice = UnitPrice;
    this.frequency = Frequency;
    this.period = Period;
    this.Subscriptiondiscount = Discount;
  }

  
  public register(){
      const event = new SubscriptionRegistered(
        this.id.getValue(),
        this.account,
        this.plan,
        this.unitPrice,
        this.frequency.getValue(),
        this.period.getStartDate(),
        this.period.getEndDate(),
        this.Subscriptiondiscount,
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
  public getDiscount(): number{
    return this.Subscriptiondiscount;
  }
  public getAccount(): number {
    return this.account;
  }

  public changeId(id: SubscriptionId) {
    this.id = id;
  }

}
