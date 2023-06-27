import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateInvoice } from "../commands/register-invoice.command";
import { InjectRepository } from "@nestjs/typeorm";
import { invoice } from "src/billing-management/domain/entities/invoice.entity";
import { Repository } from "typeorm";
import { InvoiceFactory } from "src/billing-management/domain/factories/invoice.factory";

@CommandHandler(CreateInvoice)
export class CreateInvoiceHandler
    implements ICommandHandler<CreateInvoice>{
    constructor(
        @InjectRepository(invoice)
        private invoiceRepository: Repository<invoice>
    ) { }

    async execute(command: CreateInvoice) {
        const date: Date = command.date;
        const payerId: number = command.payerId;
        const payerAddress: string = command.payerAddress;
        const serviceId: number = command.serviceId;
        const totalPrice: number = command.totalPrice;
        const invoice: invoice = InvoiceFactory.createFrom(
            date,
            payerId,
            payerAddress,
            serviceId,
            totalPrice
        );
        let Invoice = await this.invoiceRepository.save(invoice);
        Invoice.commit();
        return invoice.getId();
    }
}