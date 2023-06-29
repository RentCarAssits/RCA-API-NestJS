import { ServiceOrder } from '../entities/service-order.entity';
import { Period } from '../value-objects/period.value';
import { Price } from '../value-objects/price.value';

export class ServiceOrderFactory {
  public static createFrom(
    humanResources: number,
    price: Price,
    period: Period,
  ) {
    return new ServiceOrder(humanResources, price, period);
  }
  public static withId(humanResources: number, price: Price, period: Period) {
    return new ServiceOrder(humanResources, price, period);
  }
}
