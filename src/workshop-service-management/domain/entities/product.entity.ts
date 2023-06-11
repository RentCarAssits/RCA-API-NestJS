import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { ProductId } from '../value-objects/product-id.value';
import { Price } from '../value-objects/price.value';
import { InventoryId } from '../value-objects/inventory-id.value';
import { type } from 'os';
import { Inventory } from './inventory.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  private id: ProductId;

  @Column('varchar', { name: 'name' })
  private productName: string;

  @Column('bigint', { name: 'quantity_product' })
  private quantity: number;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @ManyToOne(() => Inventory, (inventory) => inventory.getProducts)
  @JoinColumn({ name: 'inventory_id' })
  private inventory: Inventory;

  public constructor(productName: string, quantity: number, price: Price) {
    this.productName = productName;
    this.quantity = quantity;
    this.price = price;
  }

  public getId(): ProductId {
    return this.id;
  }

  public getName(): string {
    return this.productName;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getInventory(): Inventory {
    return this.inventory;
  }

  public getPrice(): Price {
    return this.price;
  }
}
