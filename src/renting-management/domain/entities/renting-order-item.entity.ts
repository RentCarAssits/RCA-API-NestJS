import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { RentingOrderItemId } from '../values/renting-order-id.value';
import { Money } from '../values/money.value';
import { Period } from '../values/period.value';
import { TimeUnit } from '../enums/TimeUnit';
import { RentingOrderItemCreated } from '../events/renting-order-item-created.event';
import { VehicleIdFk } from '../values/vehicle-id-fk.value';

@Entity('RentingOrderItem')
export class RentingOrderItem extends AggregateRoot {
  @PrimaryColumn('bigint', { name: 'id' })
  private id: RentingOrderItemId;

  @Column((type) => VehicleIdFk, { prefix: false })
  private readonly vehicleId: VehicleIdFk;

  @Column((type) => Money, { prefix: false })
  private readonly rentingPrice: Money;

  @Column((type) => Period, { prefix: false })
  private readonly rentingPeriod: Period;

  @Column({
    type: 'enum',
    enum: TimeUnit,
    default: TimeUnit.DAYS,
    nullable: false,
  })
  private readonly rentingUnit: TimeUnit;

  public constructor(
    rentingPrice: Money,
    rentingPeriod: Period,
    vehicleId: VehicleIdFk,
    rentingUnit: TimeUnit,
  ) {
    super();
    this.rentingPrice = rentingPrice;
    this.vehicleId = vehicleId;
    this.rentingPeriod = rentingPeriod;
    this.rentingUnit = rentingUnit;
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
    );
    this.apply(event);
  }

  public obtainRentingPrice(): Money {
    return this.rentingPrice;
  }

  public obtainRentingPeriod(): Period {
    return this.rentingPeriod;
  }
  public obtainRentingOrderItemId(): RentingOrderItemId {
    return this.id;
  }
  public obtainRentingUnit(): TimeUnit {
    return this.rentingUnit;
  }
}
