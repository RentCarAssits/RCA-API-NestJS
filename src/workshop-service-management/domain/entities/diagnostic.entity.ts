import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProposalId } from '../value-objects/proposal-id.value';
import { Price } from '../value-objects/price.value';
import { ServiceItem } from './service-item';
import { Period } from '../value-objects/period.value';
import { AggregateRoot } from '@nestjs/cqrs';
import { CreateProposalCommand } from 'src/workshop-service-management/application/commands/create-proposal.command';
import { CreateProposalEvent } from '../events/create-proposal.event';
import { DiagnosticId } from '../value-objects/diagnostic-id.value';
import { User } from 'src/iam-management/domain/entities/user.entity';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';
import { CreateDiagnosticEvent } from '../events/create-diagnostic.event';

@Entity('diagnostic')
export class Diagnostic extends AggregateRoot {
  @PrimaryGeneratedColumn()
  private id: DiagnosticId;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  private owner: User;

  @OneToOne(() => Vehicle)
  @JoinColumn({ name: 'vechicle_id' })
  private vehicle: Vehicle;

  @Column('varchar', { name: 'diagnostic_description' })
  private diagnosticDescription: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'mechanic_id' })
  private mechanic: User;

  public constructor(
    id: DiagnosticId,
    owner: User,
    vehicle: Vehicle,
    diagnosticDescription: string,
    mechanic: User,
  ) {
    super();
    this.id = id;
    this.owner = owner;
    this.vehicle = vehicle;
    this.diagnosticDescription = diagnosticDescription;
    this.mechanic = mechanic;
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

  public getOwner(): User {
    return this.owner;
  }

  public getVehicle(): Vehicle {
    return this.vehicle;
  }

  public getDiagnosticDescription(): string {
    return this.diagnosticDescription;
  }

  public getMechanic(): User {
    return this.mechanic;
  }

  public changeId(id: DiagnosticId) {
    this.id = id;
  }
}
