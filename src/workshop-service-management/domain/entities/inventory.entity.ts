import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { InventoryId } from '../value-objects/inventory-id.value';
import { Address } from '../value-objects/address.value';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';
import { InventoryOperation } from './inventory-operation.entity';
import { AggregateRoot } from '@nestjs/cqrs';
import { CreateInventoryEvent } from '../events/create-inventory.event';

@Entity('Inventory')
export class Inventory extends AggregateRoot {
  @PrimaryColumn('bigint', { name: 'id' })
  private id: InventoryId;

  @Column('varchar', { name: 'name' })
  private description: string;

  @Column((type) => Address, { prefix: false })
  private address: Address;

  @OneToMany(() => Product, (product) => product.getInventory)
  private products: Product[];

  @ManyToOne(() => Warehouse, (Warehouse) => Warehouse.getInventories)
  @JoinColumn({ name: 'warehouse_id' })
  private warehouse: Warehouse;

  @OneToMany(
    () => InventoryOperation,
    (InventoryOperation) => InventoryOperation.getInventory,
  )
  private inventoryOperation: InventoryOperation[];

  public constructor(id: InventoryId, description: string, address: Address) {
    super();
    this.id = id;
    this.description = description;
    this.address = address;
  }

  public create() {
    const event = new CreateInventoryEvent(
      this.id.getValue(),
      this.description,
      this.address.getCountry(),
      this.address.getDitrict(),
      this.address.getAddressDetail(),
    );
    this.apply(event);
  }

  public getId(): InventoryId {
    return this.id;
  }

  public getDescription(): string {
    return this.description;
  }

  public getAddress(): Address {
    return this.address;
  }

  public getProducts(): Product[] {
    return this.products;
  }

  public getWarehouse(): Warehouse {
    return this.warehouse;
  }
  public getInventoryOperation(): InventoryOperation[] {
    return this.inventoryOperation;
  }

  public changeId(id: InventoryId) {
    this.id = id;
  }
}
