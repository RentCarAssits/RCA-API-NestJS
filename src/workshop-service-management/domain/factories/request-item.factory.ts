import { RequestItem } from '../entities/request-item.entity';
import { Price } from '../value-objects/price.value';

export class RequestItemFactory {
  public static createFrom(quantityRequestItem: number, price: Price) {
    return new RequestItem(quantityRequestItem, price);
  }
  public static withId(quantityRequestItem: number, price: Price) {
    return new RequestItem(quantityRequestItem, price);
  }
}
