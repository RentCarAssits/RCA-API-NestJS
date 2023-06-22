import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { RegisterPaymentPayableRequest } from "../requests/register-paymenyPayable.request";
import { AppNotification } from 'src/shared/application/app.notification';
import { Result } from 'typescript-result';
import { RegisterPaymentPayableResponse } from "../reponses/register-paymentPayable.response";
import { CreatePaymentPayable } from "../commands/register-paymentPayable.command";


@Injectable()
export class PaymentPayableApplicationService {
    constructor(
        private commandBus: CommandBus
    ) { }

    async register(registerPaymentPayableRequest: RegisterPaymentPayableRequest): Promise<Result<AppNotification, RegisterPaymentPayableResponse>> {
        const { paymentId, accountPayableId, amount } = registerPaymentPayableRequest;
        const createPaymentPayable: CreatePaymentPayable = new CreatePaymentPayable(
            registerPaymentPayableRequest.paymentId,
            registerPaymentPayableRequest.accountPayableId,
            registerPaymentPayableRequest.amount,
        );
        const paymentPayableId: number = await this.commandBus.execute(createPaymentPayable);
        
        const registerPaymentPayableResponse: RegisterPaymentPayableResponse = new RegisterPaymentPayableResponse(
            paymentPayableId,
            paymentId,
            accountPayableId,
            amount);
        return Result.ok(registerPaymentPayableResponse);
    }
}