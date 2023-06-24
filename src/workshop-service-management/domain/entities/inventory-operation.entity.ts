import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
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
import { Inventory } from './inventory.entity';

@Entity('inventory_operation')
export class InventoryOperation {
  @PrimaryGeneratedColumn()
  private id: InventoryOperationId;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  private product: Product;

  @Column('bigint', { name: 'quantityInventoryOperation' })
  private quantity: number;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @ManyToOne(
    (type) => Inventory,
    (Inventory) => Inventory.getInventoryOperation,
  )
  @JoinColumn()
  private inventory: Inventory;

  @ManyToOne(
    () => InventoryTransaction,
    (InventoryTransaction) => InventoryTransaction.getInventoryOperations,
  )
  @JoinColumn({ name: 'inventory_transaction_id' })
  private inventoryTransaction: InventoryTransaction;

  public constructor(
    product: Product,
    quantity: number,
    price: Price,
    inventory: Inventory,
    inventoryTransaction: InventoryTransaction,
  ) {
    this.product = product;
    this.quantity = quantity;
    this.price = price;
    this.inventory = inventory;
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

  public getInventory(): Inventory {
    return this.inventory;
  }

  public getInventoryTransaction(): InventoryTransaction {
    return this.inventoryTransaction;
  }
}
