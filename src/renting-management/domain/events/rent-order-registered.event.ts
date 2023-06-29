import { RentOrderState } from '../enums/rent-order-state.enum';
import { RentingOrderItemId } from '../values/renting-order-id.value';

export class RentOrderRegistered {
  constructor(
    public readonly id: number,
    public readonly state: RentOrderState,
    public readonly renter_id: number,
    public readonly items: RentingOrderItemId[],
  ) {}
}
