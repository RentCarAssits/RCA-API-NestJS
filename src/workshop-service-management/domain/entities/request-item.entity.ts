import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Price } from '../value-objects/price.value';
import { InventoryTransaction } from './inventory-transaction.entity';
import { Product } from './product.entity';
import { RequestItemId } from '../value-objects/request-item-id.value';
import { ServiceItem } from './service-item.entity';
import { CreateRequestItemEvent } from '../events/create-request-item-event';
import { AggregateRoot } from '@nestjs/cqrs';

@Entity('request_item')
export class RequestItem extends AggregateRoot {
  @PrimaryGeneratedColumn()
  private id: RequestItemId;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  private product: Product;

  @Column('bigint', { name: 'quantity_request_item' })
  private quantityRequestItem: number;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @ManyToOne(() => ServiceItem, (ServiceItem) => ServiceItem.getRequestItems)
  @JoinColumn({ name: 'service_item_id' })
  private serviceItem: ServiceItem;

  public constructor(
    id: RequestItemId,
    quantityRequestItem: number,
    price: Price,
  ) {
    super();
    this.id = id;
    this.quantityRequestItem = quantityRequestItem;
    this.price = price;
  }
  public create() {
    const event = new CreateRequestItemEvent(
      this.id.getValue(),
      this.quantityRequestItem,
      this.price.getQuantity(),
      this.price.getCurrency(),
    );
    this.apply(event);
  }

  public getId(): RequestItemId {
    return this.id;
  }

  public getQuantityRequestItem(): number {
    return this.quantityRequestItem;
  }

  public getPrice(): Price {
    return this.price;
  }

  public getServiceItem(): ServiceItem {
    return this.serviceItem;
  }
  public getProduct(): Product {
    return this.product;
  }
}
