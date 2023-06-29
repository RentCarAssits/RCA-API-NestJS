import { AggregateRoot } from '@nestjs/cqrs';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceRequestId } from '../value-objects/service-request-id.value';
import { ServiceRequestCreated } from '../events/service-request-created.event';
import { Workshop } from './workshop.entity';
import { VehicleId } from '../value-objects/vehicle-id.value';
import { OwnerId } from '../value-objects/owner-id.value';
import { WorkshopId } from '../value-objects/workshop-id.value';
import { WorkshopIdFK } from '../value-objects/workshop-id-fk.value';

@Entity('service_request')
export class ServiceRequest extends AggregateRoot {
  @PrimaryGeneratedColumn()
  private id: ServiceRequestId;

  @Column('varchar', { name: 'description_problems' })
  private descriptionProblems: string;

  @Column((type) => WorkshopIdFK, { prefix: false })
  private workshopId: WorkshopIdFK;

  @Column((type) => VehicleId, { prefix: false })
  private vehicle: VehicleId;

  @Column((type) => OwnerId, { prefix: false })
  private owner: OwnerId;

  @Column('varchar', { name: 'vehicle_name' })
  private vehicleName: string;

  @Column('varchar', { name: 'vehicle_year' })
  private year: string;

  @Column('varchar', { name: 'vehicle_integrity' })
  private vehicleIntegrity: string;

  public constructor(descriptionProblems: string) {
    super();
    this.descriptionProblems = descriptionProblems;
  }

  public create() {
    const event = new ServiceRequestCreated(
      this.id.getValue(),
      this.descriptionProblems,
    );
  }

  public getId(): ServiceRequestId {
    return this.id;
  }

  public getDescriptionProblem(): string {
    return this.descriptionProblems;
  }

  public getWorkshop(): WorkshopIdFK {
    return this.workshopId;
  }

  public getVehicle(): VehicleId {
    return this.vehicle;
  }

  public getOwner(): OwnerId {
    return this.owner;
  }

  public changeId(id: ServiceRequestId) {
    this.id = id;
  }

  public geteVehicleName(): string {
    return this.vehicleName;
  }

  public getYear(): string {
    return this.year;
  }

  public getVehicleIntegrity(): string {
    return this.vehicleIntegrity;
  }
}
