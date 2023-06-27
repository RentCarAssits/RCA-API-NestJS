import { Body, Controller, Post, Res } from "@nestjs/common";
import { PaymentPayableApplicationService } from "../application/services/paymentPayable-application.service";
import { QueryBus } from "@nestjs/cqrs";
import { RegisterPaymentPayableRequest } from "../application/requests/register-paymenyPayable.request";
import { AppNotification } from "src/shared/application/app.notification";
import { RegisterPaymentPayableResponse } from "../application/reponses/register-paymentPayable.response";
import { ApiController } from 'src/shared/api/api.controller';
import { Result } from 'typescript-result';


@Controller('paymentPayable')
export class PaymentPayableController {
    constructor(
        private readonly paymentPayableService: PaymentPayableApplicationService,
        private readonly queryBus: QueryBus
    ) { }

    @Post('register')
    async register(
        @Body() registerPaymentPayableRequest: RegisterPaymentPayableRequest,
        @Res({ passthrough: true }) response
    ): Promise<object> {
        try {
            const result:Result<AppNotification, RegisterPaymentPayableResponse> = await this.paymentPayableService.register(registerPaymentPayableRequest);
            if (result.isSuccess()) {
                return ApiController.created(response, result.value);
            }
            return ApiController.error(response, result.error.getErrors());

        } catch (error) {
            return ApiController.serverError(response, error);
        }
    }
}