import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { WorkshopId } from '../value-objects/workshop-id.value';
import { type } from 'os';
import { Address } from '../value-objects/address.value';
import { WarehouseId } from '../value-objects/warehouse-id.value';
import { Inventory } from './inventory.entity';
import { CreateWarehouseEvent } from '../events/create-warehouse.event';
import { AggregateRoot } from '@nestjs/cqrs';

@Entity('warehouse')
export class Warehouse extends AggregateRoot {
  @PrimaryGeneratedColumn()
  private id: WarehouseId;

  @Column('varchar', { name: 'name' })
  private name: string;

  @Column((type) => Address, { prefix: false })
  private address: Address;

  @OneToMany(() => Inventory, (Inventory) => Inventory.getWarehouse)
  private inventories: Inventory[];

  public constructor(name: string, address: Address) {
    super();
    this.name = name;
    this.address = address;
  }

  public create() {
    const event = new CreateWarehouseEvent(
      this.id.getValue(),
      this.name,
      this.address.getCountry(),
      this.address.getDitrict(),
      this.address.getAddressDetail(),
    );
    this.apply(event);
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

  public changeId(id: WarehouseId) {
    this.id = id;
  }
}
