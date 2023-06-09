import { Warehouse } from '../entities/warehouse.entity';
import { Address } from '../value-objects/address.value';

export class WarehouseFactory {
  public static createFrom(name: string, addres: Address) {
    return new Warehouse(name, addres);
  }
  public static withId(name: string, addres: Address) {
    return new Warehouse(name, addres);
  }
}
