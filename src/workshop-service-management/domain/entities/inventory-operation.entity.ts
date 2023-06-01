import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { InventoryOperationId } from '../value-objects/inventory-operation-id.value';
import { ProductId } from '../value-objects/product-id.value';
import { Price } from '../value-objects/price.value';
import { InventoryId } from '../value-objects/inventory-id.value';
import { InventoryTransactionId } from '../value-objects/inventory-transaction-id.value';
import { InventoryTransaction } from './inventory-transaction.entity';
import { Product } from './product.entity';

@Entity('InventoryOperation')
export class InventoryOperation {
  @PrimaryColumn('bigint', { name: 'id' })
  private id: InventoryOperationId;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  private product: Product;

  @Column('bigint', { name: 'quantity' })
  private quantity: number;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @Column((type) => InventoryId, { prefix: false })
  private inventoryId: InventoryId;

  @ManyToOne(
    () => InventoryTransaction,
    (InventoryTransaction) => InventoryTransaction.getInventoryOperations(),
  )
  @JoinColumn({ name: 'inventoryTransaction_id' })
  private inventoryTransaction: InventoryTransaction;

  public constructor(
    product: Product,
    quantity: number,
    price: Price,
    inventoryId: InventoryId,
    inventoryTransaction: InventoryTransaction,
  ) {
    this.product = product;
    this.quantity = quantity;
    this.price = price;
    this.inventoryId = inventoryId;
    this.inventoryTransaction = inventoryTransaction;
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

  public getInventoryTransaction(): InventoryTransaction {
    return this.inventoryTransaction;
  }
}
