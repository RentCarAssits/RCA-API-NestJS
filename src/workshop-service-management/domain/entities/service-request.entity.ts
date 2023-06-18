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
import { User } from 'src/iam-management/domain/entities/user.entity';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';
import { VehicleIdFK } from '../value-objects/vehicle-id-fk.value';

@Entity('service_request')
export class ServiceRequest extends AggregateRoot {
  @PrimaryGeneratedColumn()
  private id: ServiceRequestId;

  @Column('varchar', { name: 'description_problems' })
  private descriptionProblems: string;

  @ManyToOne(() => Workshop, (Workshop) => Workshop.getServiceRequests)
  @JoinColumn({ name: 'workshop_id' })
  private workshop: Workshop;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  private vehicle: Vehicle;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  private owner: User;

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

  public getWorkshop(): Workshop {
    return this.workshop;
  }

  public getVehicle(): Vehicle {
    return this.vehicle;
  }

  public getOwner(): User {
    return this.owner;
  }

  public changeId(id: ServiceRequestId) {
    this.id = id;
  }
}
