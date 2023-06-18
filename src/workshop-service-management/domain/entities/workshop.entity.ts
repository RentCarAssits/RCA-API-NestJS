import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { WorkshopId } from '../value-objects/workshop-id.value';
import { type } from 'os';
import { Address } from '../value-objects/address.value';
import { OwnerIdFK } from '../value-objects/owner-id-fk.value';
import { CreateWorkshopEvent } from '../events/create-workshop.event';
import { AggregateRoot } from '@nestjs/cqrs';
import { ServiceRequest } from './service-request.entity';

@Entity('workshop')
export class Workshop extends AggregateRoot {
  @PrimaryGeneratedColumn()
  private id: WorkshopId;

  @Column('varchar', { name: 'name' })
  private name: string;

  @Column((type) => Address, { prefix: false })
  private address: Address;

  @Column((type) => OwnerIdFK, { prefix: false })
  private owner: OwnerIdFK;

  @OneToMany(() => ServiceRequest, (serviceRequest) => serviceRequest)
  private serviceRequests: ServiceRequest[];

  public constructor(name: string, address: Address) {
    super();
    this.name = name;
    this.address = address;
  }

  public create() {
    const event = new CreateWorkshopEvent(
      this.id.getValue(),
      this.name,
      this.address.getCountry(),
      this.address.getDitrict(),
      this.address.getAddressDetail(),
    );
    this.apply(event);
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

  public getOwner(): OwnerIdFK {
    return this.owner;
  }

  public changeId(id: WorkshopId) {
    this.id = id;
  }

  public getServiceRequests(): ServiceRequest[] {
    return this.serviceRequests;
  }
}
