import { Money } from '../values/money.value';
import { Period } from '../values/period.value';
import { VehicleIdFk } from '../values/vehicle-id-fk.value';
import { TimeUnit } from '../enums/TimeUnit';
import { RentingOrderItem } from '../entities/renting-order-item.entity';
import { RentingOrderItemState } from '../enums/renting-order-item-state.enum';

export class RentingOrderItemFactory {
  public static createFrom(
    rentingPrice: Money,
    rentingPeriod: Period,
    vehicleId: VehicleIdFk,
    rentingUnit: TimeUnit,
    state: RentingOrderItemState,
  ): RentingOrderItem {
    return new RentingOrderItem(
      rentingPrice,
      rentingPeriod,
      vehicleId,
      rentingUnit,
      state,
    );
  }
}
