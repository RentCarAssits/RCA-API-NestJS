import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Price } from '../value-objects/price.value';
import { InventoryTransaction } from './inventory-transaction.entity';
import { Product } from './product.entity';
import { RequestItemId } from '../value-objects/request-item-id.value';
import { ServiceItem } from './service-item.value';

@Entity('RequestItem')
export class RequestItem {
  @PrimaryColumn('bigint', { name: 'id' })
  private id: RequestItemId;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  private product: Product;

  @Column('bigint', { name: 'quantity' })
  private quantity: number;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @ManyToOne(() => ServiceItem, (ServiceItem) => ServiceItem.getRequestItems())
  @JoinColumn({ name: 'serviceItem_id' })
  private serviceItem: ServiceItem;

  public constructor(
    product: Product,
    quantity: number,
    price: Price,
    serviceItem: ServiceItem,
  ) {
    this.product = product;
    this.quantity = quantity;
    this.price = price;
    this.serviceItem = serviceItem;
  }

  public getId(): RequestItemId {
    return this.id;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getPrice(): Price {
    return this.price;
  }

  public getServiceItem(): ServiceItem {
    return this.serviceItem;
  }
}
