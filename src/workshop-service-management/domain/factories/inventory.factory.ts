import { Inventory } from '../entities/inventory.entity';
import { Address } from '../value-objects/address.value';
import { InventoryId } from '../value-objects/inventory-id.value';

export class InventoryFactory {
  public static createFrom(description: string, addres: Address) {
    return new Inventory(InventoryId.of(0), description, addres);
  }
  public static withId(id: InventoryId, description: string, addres: Address) {
    return new Inventory(id, description, addres);
  }
}
