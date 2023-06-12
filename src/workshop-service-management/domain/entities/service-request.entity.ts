import { AggregateRoot } from '@nestjs/cqrs';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceRequestId } from '../value-objects/service-request-id.value';
import { WorkshopIdFK } from '../value-objects/workshop-id-fk.value';
import { VehicleIdFK } from '../value-objects/vehicle-id-fk.value';
import { OwnerIdFK } from '../value-objects/owner-id-fk.value';
import { ServiceRequestCreated } from '../events/service-request-created.event';

export class ServiceRequest extends AggregateRoot {
  @PrimaryGeneratedColumn()
  private id: ServiceRequestId;

  @Column('varchar', { name: 'description_problems' })
  private descriptionProblems: string;

  @Column(() => WorkshopIdFK, { prefix: false })
  private workshopId: WorkshopIdFK;

  @Column(() => VehicleIdFK, { prefix: false })
  private vehicleId: VehicleIdFK;

  @Column(() => OwnerIdFK, { prefix: false })
  private ownerId: OwnerIdFK;

  public constructor(
    descriptionProblems: string,
    workshopId: WorkshopIdFK,
    vehicleId: VehicleIdFK,
    ownerId: OwnerIdFK,
  ) {
    super();
    this.descriptionProblems = descriptionProblems;
    this.workshopId = workshopId;
    this.vehicleId = vehicleId;
    this.ownerId = ownerId;
  }

  public create() {
    const event = new ServiceRequestCreated(
      this.id.getValue(),
      this.descriptionProblems,
      this.workshopId.getValue(),
      this.ownerId.getValue(),
      this.vehicleId.getValue(),
    );
  }

  public getId(): ServiceRequestId {
    return this.id;
  }

  public getDescriptionProblem(): string {
    return this.descriptionProblems;
  }

  public getWorkshopId(): WorkshopIdFK {
    return this.workshopId;
  }

  public getVehicleId(): VehicleIdFK {
    return this.vehicleId;
  }

  public getOwnerId(): OwnerIdFK {
    return this.ownerId;
  }

  public changeId(id: ServiceRequestId) {
    this.id = id;
  }
}
