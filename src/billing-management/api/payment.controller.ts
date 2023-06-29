import { Body, Controller, Post, Res } from "@nestjs/common";
import { PaymentApplicationService } from "../application/services/payment-application.service";
import { QueryBus } from "@nestjs/cqrs";
import { RegisterPaymentRequest } from "../application/requests/register-payment.request";
import { Result } from "typescript-result";
import { AppNotification } from "src/shared/application/app.notification";
import { RegisterPaymentResponse } from "../application/reponses/register-payment.response";
import { ApiController } from "src/shared/api/api.controller";

@Controller('Payment')
export class PaymentController {
    constructor(
        private readonly paymentApplicationService: PaymentApplicationService,
        private readonly queryBus: QueryBus
    ) { }

    @Post('register')
    async register(
        @Body() registerPaymentRequest: RegisterPaymentRequest,
        @Res({ passthrough: true }) response
    ): Promise<object> {
        try {
            const result: Result<AppNotification, RegisterPaymentResponse> =
                await this.paymentApplicationService.register(registerPaymentRequest);
            if (result.isSuccess()) {
                return ApiController.created(response, result.value);
            }
            return ApiController.error(response, result.error.getErrors());
        } catch (error) {
            return ApiController.serverError(response, error);
        }
    }
}