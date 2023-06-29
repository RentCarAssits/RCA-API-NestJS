import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProposalId } from '../value-objects/proposal-id.value';
import { Price } from '../value-objects/price.value';
import { ServiceItem } from './service-item.entity';
import { Period } from '../value-objects/period.value';
import { AggregateRoot } from '@nestjs/cqrs';
import { CreateProposalEvent } from '../events/create-proposal.event';
import { ServiceOrderId } from '../value-objects/service-order-id.value';
import { ServiceItemOrder } from './service-item-order-entity';
import { CreateServiceOrderEvent } from '../events/create-service-order.event';

@Entity('service_order')
export class ServiceOrder extends AggregateRoot {
  @PrimaryGeneratedColumn()
  private id: ServiceOrderId;

  @Column('int', { name: 'human_resources' })
  private humanResources: number;

  @Column(() => Price, { prefix: false })
  private price: Price;

  @Column(() => Period, { prefix: false })
  private currentPeriod: Period;

  @OneToMany(
    () => ServiceItemOrder,
    (ServiceItemOrder) => ServiceItemOrder.getServiceOrder,
  )
  private serviceItemOrders: ServiceItemOrder[];

  public constructor(
    humanResources: number,
    price: Price,

    currentPeriod: Period,
  ) {
    super();
    this.humanResources = humanResources;
    this.price = price;

    this.currentPeriod = currentPeriod;
  }

  public create() {
    const event = new CreateServiceOrderEvent(
      this.id.getValue(),
      this.humanResources,
      this.price.getAmount(),
      this.price.getCurrency(),

      this.currentPeriod.getStart(),
      this.currentPeriod.getEnd(),
    );
    this.apply(event);
  }

  public getId(): ServiceOrderId {
    return this.id;
  }

  public getHumanResources(): number {
    return this.humanResources;
  }

  public getPrice(): Price {
    return this.price;
  }

  public getPlannedPeriod(): Period {
    return this.currentPeriod;
  }

  public changeId(id: ServiceOrderId) {
    this.id = id;
  }
  public getServiceItemOrders(): ServiceItemOrder[] {
    return this.serviceItemOrders;
  }
}
