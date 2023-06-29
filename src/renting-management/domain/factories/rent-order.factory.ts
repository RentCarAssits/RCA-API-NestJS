import { User } from 'src/iam-management/domain/entities/user.entity';
import { RentOrderState } from '../enums/rent-order-state.enum';
import { RentOrder } from '../entities/rent-order.entity';
import { RentOrderId } from '../values/rent-order-id.value';
import { RentingOrderItemId } from '../values/renting-order-id.value';
import { RentingOrderItem } from '../entities/renting-order-item.entity';

export class RentOrderFactory {
  public static createFrom(
    state: number,
    renter: User,
    items: RentingOrderItem[],
  ): RentOrder {
    const stateOrder = this.State(state);
    return new RentOrder(stateOrder, renter, items);
  }

  public static withId(
    rentOrderId: RentOrderId,
    state: number,
    renter: User,
    items: RentingOrderItem[],
  ): RentOrder {
    const stateOrder = this.State(state);
    const rentOrder: RentOrder = new RentOrder(
      stateOrder,
      renter,
      items,
    );
    rentOrder.changeId(rentOrderId);
    return rentOrder;
  }

  public static State(type: number) {
    switch (type) {
      case 0:
        return RentOrderState.IN_PROGRESS;
      case 1:
        return RentOrderState.COMPLETED;
      default:
        throw new Error(`Invalid number: ${type}`);
    }
  }
}
