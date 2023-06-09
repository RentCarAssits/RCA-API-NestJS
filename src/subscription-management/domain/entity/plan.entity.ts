import { AggregateRoot } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlanId } from '../values/plan-id.value';
import { PlanName } from '../values/plan-name.value';
import { PlanRegistered } from '../events/plan-registered.event';
import { Subscription } from './Subscription.entity';

@Entity('plans')
export class Plan extends AggregateRoot {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  private id: PlanId;

  @ApiProperty()
  @Column(() => PlanName, { prefix: false })
  private readonly PlanName: PlanName;

  @ApiProperty()
  @Column()
  private readonly Benefits: string;
  
  @ApiProperty()
  @Column()
  private readonly Price: number;
  
  //Subscripcion relations
  @OneToMany(()=> Subscription, subscription => subscription.plan)
  public subscriptions: Subscription[];

  public constructor(PlanName: PlanName, benefits: string, price:number) {
    super();
    this.PlanName = PlanName;
    this.Benefits = benefits;
    this.Price = price;
  }

  public register() {
    const event = new PlanRegistered(
      this.id.getValue(),
      this.PlanName.getValue(),
      this.Benefits,
      this.Price,
    );
  }

  public getId(): PlanId {
    return this.id;
  }

  public getPlanName(): PlanName {
    return this.PlanName;
  }

  public getBenefits() {
    return this.Benefits;
  }

  public getPirce() {
    return this.Price;
  }

  public changeId(id: PlanId) {
    this.id = id;
  }
}
