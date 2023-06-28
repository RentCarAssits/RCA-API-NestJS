import { RequestItem } from '../entities/request-item.entity';
import { ServiceItem } from '../entities/service-item.entity';
import { Price } from '../value-objects/price.value';

export class ServiceItemFactory {
  public static createFrom(
    serviceName: string,
    price: Price,
    resources: number,
  ) {
    return new ServiceItem(serviceName, price, resources);
  }
}
