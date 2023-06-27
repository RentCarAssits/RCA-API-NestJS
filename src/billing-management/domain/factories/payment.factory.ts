import { PaymentAggregate } from "../aggregates/payment";
import { PaymentMethod } from "../enums/payment-method.enum";
import { PayerIdFk } from "../values/payer-id-fk.value";

export class PaymentFactory {
    public static createFrom(
        payerId: PayerIdFk,
        paymentMethod: PaymentMethod,
        paymentDay: Date): PaymentAggregate {
        return new PaymentAggregate(payerId, paymentMethod, paymentDay);
    }
}