import {
  Entity,
  OneToMany,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InventoryTransactionId } from '../value-objects/inventory-transaction-id.value';
import { InventoryOperation } from './inventory-operation.entity';
import { ServiceItemOrder } from './service-item-order-entity';

@Entity('InventoryTransaction')
export class InventoryTransaction {
  @PrimaryColumn('bigint', { name: 'id' })
  private id: InventoryTransactionId;

  @OneToMany(
    (type) => InventoryOperation,
    (invetoryOperation) => invetoryOperation.getInventoryTransaction,
  )
  private inventoryOperations: InventoryOperation[];

  @ManyToOne(
    () => ServiceItemOrder,
    (ServiceItemOrder) => ServiceItemOrder.getInventoryTransactions,
  )
  @JoinColumn({ name: 'serviceItemOrder_id' })
  private serviceITemOrder: ServiceItemOrder;

  public constructor(
    inventoryOperations: InventoryOperation[],
    serviceITemOrder: ServiceItemOrder,
  ) {
    this.inventoryOperations = inventoryOperations;
    this.serviceITemOrder = serviceITemOrder;
  }

  public getId(): InventoryTransactionId {
    return this.id;
  }

  public getInventoryOperations(): InventoryOperation[] {
    return this.inventoryOperations;
  }

  public getServiceItemOrder(): ServiceItemOrder {
    return this.serviceITemOrder;
  }
}