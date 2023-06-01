import { AccountPayableAggregate } from "../aggregates/account-payable";
import { PayeeIdFk } from "../values/payee-id-fk.value";
import { PayerIdFk } from "../values/payer-id-fk.value";
import { Price } from "../values/price.value";


export class AccountPayableFactory {
    public static createFrom(
      payerId: PayerIdFk,
      payeeId: PayeeIdFk,
      TotalPrice: Price,
      expirationDay: Date): AccountPayableAggregate {
      return new AccountPayableAggregate(
        payerId, 
        payeeId, 
        TotalPrice, 
        expirationDay);
    }
}