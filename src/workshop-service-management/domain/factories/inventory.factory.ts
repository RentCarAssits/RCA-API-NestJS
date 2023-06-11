import { Inventory } from '../entities/inventory.entity';
import { Address } from '../value-objects/address.value';
import { InventoryId } from '../value-objects/inventory-id.value';

export class InventoryFactory {
  public static createFrom(description: string, addres: Address) {
    return new Inventory(description, addres);
  }
  public static withId(description: string, addres: Address) {
    return new Inventory(description, addres);
  }
}
