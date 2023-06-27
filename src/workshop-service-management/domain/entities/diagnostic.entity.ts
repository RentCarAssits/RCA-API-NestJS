import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AggregateRoot } from '@nestjs/cqrs';
import { DiagnosticId } from '../value-objects/diagnostic-id.value';
import { User } from 'src/iam-management/domain/entities/user.entity';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';
import { CreateDiagnosticEvent } from '../events/create-diagnostic.event';
import { ApiProperty } from '@nestjs/swagger';
import { OwnerId } from '../value-objects/owner-id.value';
import { VehicleId } from '../value-objects/vehicle-id.value';
import { MechanicId } from '../value-objects/mechanic-id.value';

@Entity('diagnostic')
export class Diagnostic extends AggregateRoot {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  private id: DiagnosticId;

  @ApiProperty()
  @Column((type) => OwnerId, { prefix: false })
  private owner: OwnerId;

  @ApiProperty()
  @Column((type) => VehicleId, { prefix: false })
  private vehicle: VehicleId;

  @ApiProperty()
  @Column('varchar', { name: 'diagnostic_description' })
  private diagnosticDescription: string;

  @ApiProperty()
  @Column((type) => MechanicId, { prefix: false })
  private mechanic: MechanicId;

  public constructor(diagnosticDescription: string) {
    super();
    this.diagnosticDescription = diagnosticDescription;
  }

  public create() {
    const event = new CreateDiagnosticEvent(
      this.id.getValue(),
      this.diagnosticDescription,
    );
    this.apply(event);
  }

  public getId(): DiagnosticId {
    return this.id;
  }

  public getOwner(): OwnerId {
    return this.owner;
  }

  public getVehicle(): VehicleId {
    return this.vehicle;
  }

  public getDiagnosticDescription(): string {
    return this.diagnosticDescription;
  }

  public getMechanic(): MechanicId {
    return this.mechanic;
  }

  public changeId(id: DiagnosticId) {
    this.id = id;
  }
}
