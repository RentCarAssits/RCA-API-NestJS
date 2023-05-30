import { Column, Entity, PrimaryColumn } from 'typeorm';
import { InventoryId } from '../value-objects/inventory-id.value';
import { Address } from '../value-objects/address.value';

@Entity('Inventory')
export class Inventory {
  @PrimaryColumn('bigint', { name: 'id' })
  private id: InventoryId;

  @Column('varchar', { name: 'name' })
  private description: string;

  @Column((type) => Address, { prefix: false })
  private address: Address;

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
}
