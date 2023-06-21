import { PaymentPayableAggregate } from "../aggregates/payment-payable";
import { AccountPaybleIdFk } from "../values/account-payable-id-fk.value";
import { Amount } from "../values/amount.value";
import { PaymentIdFk } from "../values/payment-id-fk.value";

export class PaymentPayableFactory {
    public static createFrom(
        paymentId: PaymentIdFk,
        accountPayableId: AccountPaybleIdFk,
        amountValue: Amount
    ): PaymentPayableAggregate {
        return new PaymentPayableAggregate(paymentId, accountPayableId, amountValue)
    }
}