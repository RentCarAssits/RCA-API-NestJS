import { AggregateRoot } from '@nestjs/cqrs';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../iam-management/domain/entities/user.entity';
import { RentOrderId } from '../values/rent-order-id.value';
import { RentingOrderItem } from './renting-order-item.entity';
import { RentOrderState } from '../enums/rent-order-state.enum';
import { RentOrderRegistered } from '../events/rent-order-registered.event';
import { RentingOrderItemId } from '../values/renting-order-id.value';

@Entity('rent_orders')
export class RentOrder extends AggregateRoot {
  @PrimaryGeneratedColumn()
  private id: RentOrderId;

  @Column({
    type: 'enum',
    enum: RentOrderState,
    default: RentOrderState.IN_PROGRESS,
  })
  private readonly state: RentOrderState;

  @ManyToOne(() => User, (user) => user.rentedItems)
  @JoinColumn({ name: 'renter_id' })
  renter: User;

  @OneToMany(() => RentingOrderItem, (item) => item.rentOrder)
  rentingOrderItems: RentingOrderItem[];

  public constructor(
    state: RentOrderState,
    renter: User,
    items: RentingOrderItem[],
  ) {
    super();
    this.state = state;
    this.renter = renter;
    this.rentingOrderItems = items;
  }

  public register() {
    const itemIds = this.rentingOrderItems.map((item) => item.id);
    const event = new RentOrderRegistered(
      this.id.getValue(),
      this.state,
      this.renter.id,
      itemIds,
    );
    this.apply(event);
  }

  getId(): RentOrderId {
    return this.id;
  }

  getState(): RentOrderState {
    return this.state;
  }

  getRentedBy(): number {
    return this.renter.id;
  }

  getItems(): RentingOrderItem[] {
    return this.rentingOrderItems;
  }

  public changeId(id: RentOrderId) {
    this.id = id;
  }
}
