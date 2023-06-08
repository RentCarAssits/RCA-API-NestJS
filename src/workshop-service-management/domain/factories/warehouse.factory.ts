import { Warehouse } from '../entities/warehouse.entity';
import { Address } from '../value-objects/address.value';
import { WarehouseId } from '../value-objects/warehouse-id.value';

export class WarehouseFactory {
  public static createFrom(name: string, addres: Address) {
    return new Warehouse(WarehouseId.of(0), name, addres);
  }
  public static withId(id: WarehouseId, name: string, addres: Address) {
    return new Warehouse(id, name, addres);
  }
}
