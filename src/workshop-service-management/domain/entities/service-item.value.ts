import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ServiceItemOrderId } from '../value-objects/service-item-order-id.value';
import { Price } from '../value-objects/price.value';
import { InventoryTransaction } from './inventory-transaction.entity';
import { ServiceItemId } from '../value-objects/service-item-id.value';
import { RequestItem } from './request-item.entity';

@Entity('ServiceItem')
export class ServiceItem {
  @PrimaryColumn('bigint', { name: 'id' })
  private id: ServiceItemId;

  @Column('varchar', { name: 'serviceName' })
  private serviceName: string;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @OneToMany(() => RequestItem, (RequestItem) => RequestItem)
  private requestItems: RequestItem[];

  public constructor(
    serviceName: string,
    price: Price,
    requestItems: RequestItem[],
  ) {
    this.serviceName = serviceName;
    this.price = price;
    this.requestItems = requestItems;
  }

  public getId(): ServiceItemId {
    return this.id;
  }

  public getServiceName(): string {
    return this.serviceName;
  }

  public getPrice(): Price {
    return this.price;
  }

  public getRequestItems(): RequestItem[] {
    return this.requestItems;
  }
}