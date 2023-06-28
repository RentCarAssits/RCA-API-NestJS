import { AccountPayableAggregate } from "../aggregates/account-payable";
import { PaymentStatus } from "../enums/payment-status.enum";
import { PayeeIdFk } from "../values/payee-id-fk.value";
import { PayerIdFk } from "../values/payer-id-fk.value";
import { Price } from "../values/price.value";


export class AccountPayableFactory {
    public static createFrom(
      payerId: PayerIdFk,
      payeeId: PayeeIdFk,
      TotalPrice: Price,
      state: number,
      expirationDay: Date): AccountPayableAggregate {
      return new AccountPayableAggregate(
        payerId, 
        payeeId, 
        TotalPrice,
        state, 
        expirationDay);
    }
}