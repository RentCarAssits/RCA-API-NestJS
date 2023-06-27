import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkshopId } from '../value-objects/workshop-id.value';
import { Address } from '../value-objects/address.value';
import { CreateWorkshopEvent } from '../events/create-workshop.event';
import { AggregateRoot } from '@nestjs/cqrs';
import { ServiceRequest } from './service-request.entity';
import { MechanicId } from '../value-objects/mechanic-id.value';

@Entity('workshop')
export class Workshop extends AggregateRoot {
  @PrimaryGeneratedColumn()
  private id: WorkshopId;

  @Column('varchar', { name: 'name' })
  private name: string;

  @Column((type) => Address, { prefix: false })
  private address: Address;

  @Column((type) => MechanicId, { prefix: false })
  private mechanic: MechanicId;

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

  public getMechanic(): MechanicId {
    return this.mechanic;
  }

  public getAddress(): Address {
    return this.address;
  }

  public changeId(id: WorkshopId) {
    this.id = id;
  }

  public getServiceRequests(): ServiceRequest[] {
    return this.serviceRequests;
  }
}
