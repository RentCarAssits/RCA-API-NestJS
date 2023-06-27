import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllInvoiceQuery } from "../../queries/get-all-invoice-query";
import { InjectRepository } from "@nestjs/typeorm";
import { invoice } from "src/billing-management/domain/entities/invoice.entity";
import { Repository } from "typeorm";
import { InvoiceDto } from "../../dtos/invoice.dto";

@QueryHandler(GetAllInvoiceQuery)
export class InvoiceQueriesHandler
    implements IQueryHandler<GetAllInvoiceQuery> {

    constructor(
        @InjectRepository(invoice)
        private readonly invoiceRepository: Repository<invoice>
    ) { }
    async execute(
        query: GetAllInvoiceQuery
    ): Promise<InvoiceDto[]> {
        const ormInvoices = await this.invoiceRepository.find();
        console.log(
            '🚀 ~ file: invoice-queries.handler.ts:18 ~ GetAllInvoicesHandler ~ execute ~ invoices:',
            ormInvoices['result'],
        );
        const invoices: InvoiceDto[] = ormInvoices.map(
            (ormInvoices) => {
                const invoiceDto = new InvoiceDto();
                invoiceDto.id = Number(ormInvoices.getId());
                invoiceDto.date = ormInvoices.getDate();
                invoiceDto.totalPrice = ormInvoices.getTotalPrice();
                invoiceDto.payerId = Number(ormInvoices.getPayerId());
                invoiceDto.serviceId = Number(ormInvoices.getServiceId());
                return invoiceDto;
            },
        );
        return invoices;
    }
}