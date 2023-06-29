import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { InvoiceApplicationService } from "../application/services/invoice-application.service";
import { RegisterInvoiceRequest } from "../application/requests/register-invoice.request";
import { Result } from "typescript-result";
import { AppNotification } from "src/shared/application/app.notification";
import { RegisterInvoiceResponse } from "../application/reponses/register-invoice.response";
import { ApiController } from "src/shared/api/api.controller";
import { GetAllInvoiceQuery } from "../application/queries/get-all-invoice-query";

@Controller('invoice')
export class InvoiceController {
    constructor(
        private readonly invoiceService: InvoiceApplicationService,
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus
    ) { }

    @Post()
    async register(
        @Body() registerInvoiceRequest: RegisterInvoiceRequest,
        @Res({ passthrough: true }) response
    ): Promise<object> {
        try {
            const result: Result<AppNotification, RegisterInvoiceResponse> =
                await this.invoiceService.register(registerInvoiceRequest);
            if (result.isSuccess()) {
                return ApiController.created(response, result.value);
            }
            return ApiController.error(response, result.error.getErrors());
        } catch (error) {
            return ApiController.serverError(response, error);
        }
    }

    @Get()
    async getAll(@Res({ passthrough: true }) response): Promise<object> {
        try {
            const invoices = await this.queryBus.execute(
                new GetAllInvoiceQuery()
            );
            return ApiController.ok(response, invoices);
        } catch (error) {
            return ApiController.serverError(response, error);
        }
    }
}