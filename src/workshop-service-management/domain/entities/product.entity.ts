import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ProductId } from '../value-objects/product-id.value';
import { Price } from '../value-objects/price.value';
import { InventoryId } from '../value-objects/inventory-id.value';
import { type } from 'os';

@Entity('Product')
export class Product {
  @PrimaryColumn('bigint', { name: 'id' })
  private id: ProductId;

  @Column('varchar', { name: 'name' })
  private productName: string;

  @Column('bigint', { name: 'quantity' })
  private quantity: number;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @Column((type) => InventoryId, { prefix: false })
  private inventoryId: InventoryId;

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

  public getInventoryId(): InventoryId {
    return this.inventoryId;
  }

  public getPrice(): Price {
    return this.price;
  }
}
