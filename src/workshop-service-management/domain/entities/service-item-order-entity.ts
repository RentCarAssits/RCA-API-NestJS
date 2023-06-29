import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ServiceItemOrderId } from '../value-objects/service-item-order-id.value';
import { Price } from '../value-objects/price.value';
import { InventoryTransaction } from './inventory-transaction.entity';
import { ServiceOrder } from './service-order.entity';
import { AggregateRoot } from '@nestjs/cqrs';
import { CreateServiceItemOrderEvent } from '../events/create-service-item-order.event';

@Entity('service_item_order')
export class ServiceItemOrder extends AggregateRoot {
  @PrimaryGeneratedColumn()
  private id: ServiceItemOrderId;

  @Column('varchar', { name: 'service_name' })
  private serviceName: string;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @Column('bigint', { name: 'resoruces' })
  private resources: number;

  @OneToMany(
    () => InventoryTransaction,
    (inventoryTransaction) => inventoryTransaction.getServiceItemOrder,
  )
  private inventoryTransactions: InventoryTransaction[];

  @ManyToOne(
    () => ServiceOrder,
    (ServiceOrder) => ServiceOrder.getServiceItemOrders,
  )
  @JoinColumn({ name: 'service_order_id' })
  private serviceOrder: ServiceOrder;

  public constructor(serviceName: string, price: Price, resources: number) {
    super();
    this.serviceName = serviceName;
    this.price = price;
    this.resources = resources;
  }
  public create() {
    const event = new CreateServiceItemOrderEvent(
      this.id.getValue(),
      this.serviceName,
      this.price.getAmount(),
      this.price.getCurrency(),
      this.resources,
    );
    this.apply(event);
  }
  public getId(): ServiceItemOrderId {
    return this.id;
  }

  public getServiceName(): string {
    return this.serviceName;
  }

  public getResources(): number {
    return this.resources;
  }

  public getPrice(): Price {
    return this.price;
  }

  public getInventoryTransactions(): InventoryTransaction[] {
    return this.inventoryTransactions;
  }

  public getServiceOrder(): ServiceOrder {
    return this.serviceOrder;
  }

  public changeId(id: ServiceItemOrderId) {
    this.id = id;
  }
}
