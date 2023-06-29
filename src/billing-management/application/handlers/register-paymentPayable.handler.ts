import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePaymentPayable } from "../commands/register-paymentPayable.command";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentPayableAggregate } from "src/billing-management/domain/aggregates/payment-payable";
import { Repository } from "typeorm";
import { PaymentIdFk } from "src/billing-management/domain/values/payment-id-fk.value";
import { AccountPaybleIdFk } from "src/billing-management/domain/values/account-payable-id-fk.value";
import { Amount } from "src/billing-management/domain/values/amount.value";
import { PaymentPayableFactory } from "src/billing-management/domain/factories/payment-payable.factory";

@CommandHandler(CreatePaymentPayable)
export class CreatePaymentPayableHandler
    implements ICommandHandler<CreatePaymentPayable> {
    constructor(
        @InjectRepository(PaymentPayableAggregate)
        private paymentPayableRepository: Repository<PaymentPayableAggregate>) { }

    async execute(command: CreatePaymentPayable) {
        const paymentId: PaymentIdFk = PaymentIdFk.create(command.paymentId);
        const accountPayableId: AccountPaybleIdFk = AccountPaybleIdFk.create(command.accountPayableId);
        const amount: Amount = Amount.create(command.amount);
        const paymentPayable: PaymentPayableAggregate = PaymentPayableFactory.createFrom(
            paymentId,
            accountPayableId,
            amount
        );
        let payment = await this.paymentPayableRepository.save(paymentPayable);
        payment.commit();    
    }
}
