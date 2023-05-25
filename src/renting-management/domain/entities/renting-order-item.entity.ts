import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { RentingOrderId } from '../values/renting-order-id.value';
import { Money } from '../values/money.value';
import { Period } from '../values/period.value';
import { TimeUnit } from '../enums/TimeUnit';

@Entity('RentingOrderItem')
export class RentingOrderItem extends AggregateRoot {
  @PrimaryColumn('bigint', { name: 'id' })
  private id: RentingOrderId;

  /*@Column((type) => VehicleId, { prefix: false })
  private readonly vehicleId: VehicleId;*/

  @Column((type) => Money, { prefix: false })
  private readonly rentingPrice: Money;

  @Column((type) => Period, { prefix: false })
  private readonly rentingPeriod: Period;

  @Column({
    type: 'enum',
    enum: TimeUnit,
    default: TimeUnit.DAYS,
  })
  private readonly rentingUnit: TimeUnit;

  public constructor(
    rentingPrice: Money,
    rentingPeriod: Period,
    rentingUnit: TimeUnit,
  ) {
    super();
    this.rentingPrice = rentingPrice;
    this.rentingPeriod = rentingPeriod;
    this.rentingUnit = rentingUnit;
  }

  get obtainRentingPrice(): Money {
    return this.rentingPrice;
  }

  public obtainRentingPeriod(): Period {
    return this.rentingPeriod;
  }

  public obtainRentingUnit(): TimeUnit {
    return this.rentingUnit;
  }
}
