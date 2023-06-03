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

@Entity('Inventory')
export class Inventory {
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

  public constructor(description: string, address: Address) {
    this.description = description;
    this.address = address;
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
}