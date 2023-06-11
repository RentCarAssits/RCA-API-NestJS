import { RequestItem } from '../entities/request-item.entity';
import { Price } from '../value-objects/price.value';
import { RequestItemId } from '../value-objects/request-item-id.value';

export class RequestItemFactory {
  public static createFrom(quantityRequestItem: number, price: Price) {
    return new RequestItem(RequestItemId.of(0), quantityRequestItem, price);
  }
  public static withId(
    id: RequestItemId,
    quantityRequestItem: number,
    price: Price,
  ) {
    return new RequestItem(id, quantityRequestItem, price);
  }
}
