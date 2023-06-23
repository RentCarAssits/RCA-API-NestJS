import { AccountPayableAggregate } from "../aggregates/account-payable";
import { PaymentStatus } from "../enums/payment-status.enum";
import { ServiceType } from "../enums/service-type.enum";
import { PayeeIdFk } from "../values/payee-id-fk.value";
import { PayerIdFk } from "../values/payer-id-fk.value";
import { Price } from "../values/price.value";


export class AccountPayableFactory {
    public static createFrom(
      payerId: PayerIdFk,
      payeeId: PayeeIdFk,
      idService:number,
      TotalPrice: Price,
      state: PaymentStatus,
      expirationDay: Date,
      currency:string,tipoService:ServiceType): AccountPayableAggregate {
      return new AccountPayableAggregate(
        payerId, 
        payeeId, 
        idService,
        TotalPrice,
        state, 
        expirationDay, currency,tipoService);
    }
}