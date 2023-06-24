import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { ProductId } from '../value-objects/product-id.value';
import { Price } from '../value-objects/price.value';
import { Inventory } from './inventory.entity';
import { AggregateRoot } from '@nestjs/cqrs';
import { CreateProductEvent } from '../events/create-product.event';

@Entity('product')
export class Product extends AggregateRoot {
  @PrimaryGeneratedColumn()
  private id: ProductId;

  @Column('varchar', { name: 'name' })
  private productName: string;

  @Column('bigint', { name: 'quantity_product' })
  private quantityProduct: number;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @ManyToOne(() => Inventory, (inventory) => inventory.getProducts)
  @JoinColumn({ name: 'inventory_id' })
  private inventory: Inventory;

  public constructor(
    productName: string,
    quantityProduct: number,
    price: Price,
  ) {
    super();
    this.productName = productName;
    this.quantityProduct = quantityProduct;
    this.price = price;
  }

  public create() {
    const event = new CreateProductEvent(
      this.id.getValue(),
      this.productName,
      this.quantityProduct,
      this.price.getAmount(),
      this.price.getCurrency(),
    );
    this.apply(event);
  }

  public getId(): ProductId {
    return this.id;
  }

  public getName(): string {
    return this.productName;
  }

  public getQuantityProduct(): number {
    return this.quantityProduct;
  }

  public getInventory(): Inventory {
    return this.inventory;
  }

  public getPrice(): Price {
    return this.price;
  }

  public changeId(id: ProductId) {
    this.id = id;
  }
}
