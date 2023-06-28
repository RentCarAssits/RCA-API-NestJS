import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ServiceItemOrderId } from '../value-objects/service-item-order-id.value';
import { Price } from '../value-objects/price.value';
import { InventoryTransaction } from './inventory-transaction.entity';

@Entity('service_item_order')
export class ServiceItemOrder {
  @PrimaryGeneratedColumn()
  private id: ServiceItemOrderId;

  @Column('varchar', { name: 'service_name' })
  private serviceName: string;

  @Column((type) => Price, { prefix: false })
  private price: Price;

  @Column('bigint', { name: 'resoruces' })
  private resources: number;

  @OneToMany(
    () => InventoryTransaction,
    (inventoryTransaction) => inventoryTransaction.getServiceItemOrder,
  )
  private inventoryTransactions: InventoryTransaction[];

  public constructor(
    serviceName: string,
    price: Price,
    inventoryTransactions: InventoryTransaction[],
  ) {
    this.serviceName = serviceName;
    this.price = price;
    this.inventoryTransactions = inventoryTransactions;
  }

  public getId(): ServiceItemOrderId {
    return this.id;
  }

  public getServiceName(): string {
    return this.serviceName;
  }

  public getPrice(): Price {
    return this.price;
  }

  public getInventoryTransactions(): InventoryTransaction[] {
    return this.inventoryTransactions;
  }
}
