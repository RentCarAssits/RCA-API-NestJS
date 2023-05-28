import { Money } from '../values/money.value';
import { Period } from '../values/period.value';
import { VehicleIdFk } from '../values/vehicle-id-fk.value';
import { TimeUnit } from '../enums/TimeUnit';
import { CreateRentingOrderItem } from '../../application/commands/create-renting-order-item.command';
import { RentingOrderItem } from '../entities/renting-order-item.entity';

export class RentingOrderItemFactory {
  public static createFrom(
    rentingPrice: Money,
    rentingPeriod: Period,
    vehicleId: VehicleIdFk,
    rentingUnit: TimeUnit,
  ): RentingOrderItem {
    return new RentingOrderItem(
      rentingPrice,
      rentingPeriod,
      vehicleId,
      rentingUnit,
    );
  }
}
