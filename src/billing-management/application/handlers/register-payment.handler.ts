import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePayment } from "../commands/register-payement.command";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentAggregate } from "src/billing-management/domain/aggregates/payment";
import { Repository } from "typeorm";
import { PayerIdFk } from "src/billing-management/domain/values/payer-id-fk.value";
import { PaymentMethod } from "src/billing-management/domain/enums/payment-method.enum";
import { PaymentFactory } from "src/billing-management/domain/factories/payment.factory";

@CommandHandler(CreatePayment)
export class CreatePaymentHandler implements ICommandHandler<CreatePayment> {
    constructor(
        @InjectRepository(PaymentAggregate)
        private paymentRepository: Repository<PaymentAggregate>
    ) { }

    async execute(command: CreatePayment) {
        let state: PaymentMethod | undefined;

        switch (command.paymentMethod) {
            case 'CASH':
                state = PaymentMethod.CASH;
                break;
            case 'CREDIT_CARD':
                state = PaymentMethod.CREDIT_CARD;
                break;
            case 'DEBIT_CARD':
                state = PaymentMethod.DEBIT_CARD;
                break;
            default:
                state = PaymentMethod.OTHER;
                break;
        }
        console.log(command);
        const paymentMethod: PaymentMethod = state;
        const payerId: PayerIdFk = PayerIdFk.create(command.payerId);
        const paymentDay = new Date();
        const payment: PaymentAggregate = PaymentFactory.createFrom(
            payerId, 
            paymentMethod, 
            paymentDay);
        let paymentCreated = await this.paymentRepository.save(payment);
        paymentCreated.commit();
        return paymentCreated.getId();
    }
}