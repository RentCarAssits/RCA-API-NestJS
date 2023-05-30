import { Column, Entity, PrimaryColumn } from 'typeorm';
import { InventoryOperationId } from '../value-objects/inventory-operation-id.value';
import { ProductId } from '../value-objects/product-id.value';
import { Price } from '../value-objects/price.value';
import { InventoryId } from '../value-objects/inventory-id.value';

@Entity('InventoryOperation')
export class InventoryOperation {
  @PrimaryColumn('bigint', { name: 'id' })
  private id: InventoryOperationId;

  @Column((type) => ProductId, { prefix: false })
  private productId: ProductId;

  @Column('bigint', { name: 'name' })
  private quantity: number;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @Column((type) => InventoryId, { prefix: false })
  private inventoryId: InventoryId;

  public constructor(
    productId: ProductId,
    quantity: number,
    price: Price,
    inventoryId: InventoryId,
  ) {
    this.productId = productId;
    this.quantity = quantity;
    this.price = price;
    this.inventoryId = inventoryId;
  }

  public getId(): InventoryOperationId {
    return this.id;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getPrice(): Price {
    return this.price;
  }

  public getInventoryId(): InventoryId {
    return this.inventoryId;
  }
}
