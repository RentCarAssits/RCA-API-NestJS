import { AggregateRoot } from '@nestjs/cqrs';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VehicleId } from '../values/vehicle-id.value';
import { VehicleName } from '../values/vehicle-name.value';
import { Brand } from '../values/brand.value';
import { VehicleIntegrity } from '../values/vehicle-integrity.value';
import { VehicleState } from '../enums/vehicle-state.enum';
import { Model } from '../values/model.value';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.entity';
import { VehicleRegistered } from '../events/vehicle-registered.event';
import { User } from '../../../iam-management/domain/entities/user.entity';
import { VehicleUpdated } from '../events/vehicle-updated.event';

@Entity('vehicles')
export class Vehicle extends AggregateRoot {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  private id: VehicleId;

  @ApiProperty()
  @Column(() => VehicleName, { prefix: false })
  private readonly name: VehicleName;

  @ApiProperty()
  @Column(() => Brand, { prefix: false })
  public brand: Brand;

  @ApiProperty()
  @Column(() => Model, { prefix: false })
  private readonly model: Model;

  @ApiProperty()
  @Column(() => VehicleIntegrity, { prefix: false })
  private readonly integrity: VehicleIntegrity;

  @Column({ type: 'enum', enum: VehicleState, default: VehicleState.AVAILABLE })
  private readonly state: VehicleState;

  @ApiProperty()
  @Column({ nullable: false, type: 'date' })
  private readonly year: Date;

  @Column()
  private readonly image: string;

  @Column()
  private readonly stars: number;

  @Column()
  private readonly price: number;

  @Column()
  private readonly currency: string;

  @Column()
  private readonly timeUnit: string;

  /*@ApiProperty()
  @Column({ name: 'owner_id' })
  ownerId: number;*/

  @ApiProperty()
  @OneToMany(() => Category, (category) => category.vehicle, {
    cascade: true,
    eager: true,
  })
  categories?: Category[];

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.vehicles)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  public constructor(
    name: VehicleName,
    brand: Brand,
    model: Model,
    integrity: VehicleIntegrity,
    year: Date,
    state: number,
    image: string,
    stars: number,
    price: number,
    currency: string,
    timeUnit: string,
  ) {
    super();
    this.name = name;
    this.brand = brand;
    this.integrity = integrity;
    this.state = state;
    this.year = year;
    this.model = model;
    this.image = image;
    this.stars = stars;
    this.price = price;
    this.currency = currency;
    this.timeUnit = timeUnit;
  }

  public register() {
    const event = new VehicleRegistered(
      this.id.getValue(),
      this.name.getValue(),
      this.brand.getValue(),
      this.model.getValue(),
      this.integrity.getValue(),
      this.state,
      this.year,
    );
    this.apply(event);
  }

  public updated() {
    const event = new VehicleUpdated(
      this.id.getValue(),
      this.name.getValue(),
      this.brand.getValue(),
      this.model.getValue(),
      this.integrity.getValue(),
      this.state,
      this.year,
      this.price,
      this.currency,
      this.timeUnit,
    );
    this.apply(event);
  }

  public getId(): VehicleId {
    return this.id;
  }

  public getName(): VehicleName {
    return this.name;
  }

  public getBrand(): Brand {
    return this.brand;
  }

  public getYear(): Date {
    return this.year;
  }

  public getModel(): Model {
    return this.model;
  }

  public getIntegrity(): VehicleIntegrity {
    return this.integrity;
  }

  public changeId(id: VehicleId) {
    this.id = id;
  }

  public getState(): VehicleState {
    return this.state;
  }

  public getImage(): string {
    return this.image;
  }

  public getStars(): number {
    return this.stars;
  }

  public getPrice(): number {
    return this.price;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public getTimeUnit(): string {
    return this.timeUnit;
  }

  public getCategories(): Category[] {
    return this.categories;
  }
}
