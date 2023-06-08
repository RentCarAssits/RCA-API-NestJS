import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { WorkshopId } from '../value-objects/workshop-id.value';
import { type } from 'os';
import { Address } from '../value-objects/address.value';
import { WarehouseId } from '../value-objects/warehouse-id.value';
import { Inventory } from './inventory.entity';

@Entity('Warehouse')
export class Warehouse {
  @PrimaryColumn('bigint', { name: 'id' })
  private id: WarehouseId;

  @Column('varchar', { name: 'name' })
  private name: string;

  @Column((type) => Address, { prefix: false })
  private address: Address;

  @OneToMany(() => Inventory, (Inventory) => Inventory.getWarehouse)
  private inventories: Inventory[];

  public constructor(name: string, address: Address) {
    this.name = name;
    this.address = address;
  }

  public getId(): WarehouseId {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getAdress(): Address {
    return this.address;
  }

  public getInventories(): Inventory[] {
    return this.inventories;
  }
}
