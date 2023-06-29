import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { RegisterPaymentRequest } from "../requests/register-payment.request";
import { RegisterPaymentResponse } from "../reponses/register-payment.response";
import { AppNotification } from "src/shared/application/app.notification";
import { Result } from "typescript-result";
import { CreatePayment } from "../commands/register-payement.command";

@Injectable()
export class PaymentApplicationService {
    constructor(
        private commandBus: CommandBus
    ){}

  async register(registerPaymentRequest: RegisterPaymentRequest): Promise<Result<AppNotification, RegisterPaymentResponse>> {
    const { payerId, paymentMethod, paymentDay } = registerPaymentRequest;

    const createPayment: CreatePayment = new CreatePayment(
      registerPaymentRequest.payerId,
      registerPaymentRequest.paymentMethod,
      registerPaymentRequest.paymentDay
    );      
    const paymentId: number= await this.commandBus.execute(createPayment);
    const registerPaymentResponse: RegisterPaymentResponse = new RegisterPaymentResponse(
      paymentId,
      createPayment.payerId,
      createPayment.paymentMethod,
      createPayment.paymentDay
    );

    return Result.ok(registerPaymentResponse);
  }
}
