import { Product } from '../entities/product.entity';
import { Price } from '../value-objects/price.value';

export class ProdcutFactory {
  public static createFrom(
    productName: string,
    quantityProduct: number,
    price: Price,
  ) {
    return new Product(productName, quantityProduct, price);
  }
  public static withId(
    productName: string,
    humanResources: number,
    price: Price,
  ) {
    return new Product(productName, humanResources, price);
  }
}
