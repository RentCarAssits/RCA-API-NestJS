import { Column, Entity, PrimaryColumn } from 'typeorm';
import { WorkshopId } from '../value-objects/workshop-id.value';
import { type } from 'os';
import { Address } from '../value-objects/address.value';
import { AggregateRoot } from '@nestjs/cqrs';

@Entity('Workshop')
export class Workshop {
  @PrimaryColumn('bigint', { name: 'id' })
  private id: WorkshopId;

  @Column('varchar', { name: 'name' })
  private name: string;

  @Column((type) => Address, { prefix: false })
  private address: Address;

  public constructor(name: string, address: Address) {
    this.name = name;
    this.address = address;
  }

  public getId(): WorkshopId {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): Address {
    return this.address;
  }
}
