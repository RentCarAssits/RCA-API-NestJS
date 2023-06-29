import { Workshop } from '../entities/workshop.entity';
import { Address } from '../value-objects/address.value';

export class WorkshopFactory {
  public static createFrom(name: string, addres: Address) {
    return new Workshop(name, addres);
  }
  public static withId(name: string, addres: Address) {
    return new Workshop(name, addres);
  }
}
