import { AccountPayable } from "../entities/account-payable.entity";
import { PayeeIdFk } from "../values/payee-id-fk.value";
import { PayerIdFk } from "../values/payer-id-fk.value";
import { Price } from "../values/price.value";


export class AccountPayableFactory {
  public static createFrom(
    payerId: PayerIdFk,
    payeeId: PayeeIdFk,
    totalPrice: Price,
    expirationDate: Date,
  ): AccountPayable {
    return new AccountPayable(
      payerId,
      payeeId,
      totalPrice,
      expirationDate
    );
  }
}