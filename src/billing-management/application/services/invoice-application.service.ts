import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { RegisterInvoiceRequest } from "../requests/register-invoice.request";
import { Result } from "typescript-result";
import { AppNotification } from "src/shared/application/app.notification";
import { RegisterInvoiceResponse } from "../reponses/register-invoice.response";
import { CreateInvoice } from "../commands/register-invoice.command";

@Injectable()
export class InvoiceApplicationService{
    constructor(
        private commandBus: CommandBus
    ){}

    async register(registerInvoiceRequest:RegisterInvoiceRequest): Promise<Result<AppNotification,RegisterInvoiceResponse>>{
        const { date, payerId, payerAddress, serviceId, totalPrice } = registerInvoiceRequest;

        const createInvoice: CreateInvoice = new CreateInvoice(
            registerInvoiceRequest.date,
            registerInvoiceRequest.payerId,
            registerInvoiceRequest.payerAddress,
            registerInvoiceRequest.serviceId,
            registerInvoiceRequest.totalPrice
        );
        const invoiceId: number = await this.commandBus.execute(createInvoice);
        const registerInvoiceResponse: RegisterInvoiceResponse = new RegisterInvoiceResponse(
            invoiceId,
            createInvoice.date,
            createInvoice.payerId,
            createInvoice.payerAddress,
            createInvoice.serviceId,
            createInvoice.totalPrice
        );

        return Result.ok(registerInvoiceResponse);
        
    }
}