import { AggregateRoot } from '@nestjs/cqrs';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RentingOrderItemId } from '../values/renting-order-id.value';
import { Money } from '../values/money.value';
import { Period } from '../values/period.value';
import { TimeUnit } from '../enums/TimeUnit';
import { RentingOrderItemCreated } from '../events/renting-order-item-created.event';
import { VehicleIdFk } from '../values/vehicle-id-fk.value';
import { ApiProperty } from '@nestjs/swagger';
import { RentingOrderItemState } from '../enums/renting-order-item-state.enum';
import { User } from '../../../iam-management/domain/entities/user.entity';

@Entity('renting_order_item')
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
  @Column({
    type: 'enum',
    enum: RentingOrderItemState,
    default: RentingOrderItemState.OnRequest,
    nullable: false,
  })
  state: RentingOrderItemState;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: TimeUnit,
    default: TimeUnit.DAYS,
    nullable: false,
  })
  public rentingUnit: TimeUnit;
  @ApiProperty()
  @ManyToOne(() => User, (user) => user.vehicles)
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  public constructor(
    rentingPrice: Money,
    rentingPeriod: Period,
    vehicleId: VehicleIdFk,
    rentingUnit: TimeUnit,
    state: RentingOrderItemState,
  ) {
    super();
    this.rentingPrice = rentingPrice;
    this.vehicleId = vehicleId;
    this.rentingPeriod = rentingPeriod;
    this.rentingUnit = rentingUnit;
    this.state = state;
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
      this.state,
    );
    this.apply(event);
  }

  public updated() {
    const event = new RentingOrderItemCreated(
      this.id.getValue(),
      this.rentingPrice.getAmount(),
      this.rentingPrice.getCurrency(),
      this.rentingPeriod.getStartDate(),
      this.rentingPeriod.getEndDate(),
      this.vehicleId.getValue(),
      this.rentingUnit,
      this.state,
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
