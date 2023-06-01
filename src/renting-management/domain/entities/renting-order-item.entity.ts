import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { RentingOrderItemId } from '../values/renting-order-id.value';
import { Money } from '../values/money.value';
import { Period } from '../values/period.value';
import { TimeUnit } from '../enums/TimeUnit';
import { RentingOrderItemCreated } from '../events/renting-order-item-created.event';
import { VehicleIdFk } from '../values/vehicle-id-fk.value';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleId } from '../values/vehicle-id.value';
import { VehicleIntegrity } from '../values/vehicle-integrity.value';

@Entity('RentingOrderItem')
export class RentingOrderItem extends AggregateRoot {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  public id: RentingOrderItemId;
  @ApiProperty()
  @Column((type) => VehicleIdFk, { prefix: false })
  public vehicleId: VehicleIdFk;
  @ApiProperty()
  @Column((type) => Money, { prefix: false })
  public rentingPrice: Money;
  @ApiProperty()
  @Column((type) => Period, { prefix: false })
  public rentingPeriod: Period;
  @ApiProperty()
  @Column({ default: false })
  accepted: boolean;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: TimeUnit,
    default: TimeUnit.DAYS,
    nullable: false,
  })
  public rentingUnit: TimeUnit;

  public constructor(
    rentingPrice: Money,
    rentingPeriod: Period,
    vehicleId: VehicleIdFk,
    rentingUnit: TimeUnit,
    accepted: boolean,
  ) {
    super();
    this.rentingPrice = rentingPrice;
    this.vehicleId = vehicleId;
    this.rentingPeriod = rentingPeriod;
    this.rentingUnit = rentingUnit;
    this.accepted = accepted;
  }

  public create() {
    const event = new RentingOrderItemCreated(
      this.id.getValue(),
      this.rentingPrice.getAmount(),
      this.rentingPrice.getCurrency(),
      this.rentingPeriod.getStartDate(),
      this.rentingPeriod.getEndDate(),
      this.vehicleId.getValue(),
      this.rentingUnit,
      this.accepted,
    );
    this.apply(event);
  }

  public obtainRentingPrice(): Money {
    return this.rentingPrice;
  }

  public changeId(id: RentingOrderItemId) {
    this.id = id;
  }

  public obtainRentingPeriod(): Period {
    return this.rentingPeriod;
  }

  public getId(): RentingOrderItemId {
    return this.id;
  }

  public obtainRentingUnit(): TimeUnit {
    return this.rentingUnit;
  }
}
