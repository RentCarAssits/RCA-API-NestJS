import { RequestItem } from '../entities/request-item.entity';
import { ServiceItemOrder } from '../entities/service-item-order-entity';
import { ServiceItem } from '../entities/service-item.entity';
import { Price } from '../value-objects/price.value';

export class ServiceItemOrderFactory {
  public static createFrom(
    serviceName: string,
    price: Price,
    resources: number,
  ) {
    return new ServiceItemOrder(serviceName, price, resources);
  }
}
