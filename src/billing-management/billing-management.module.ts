import { Module } from '@nestjs/common';
import { AccountPayableController } from './api/account-payable.controller';
import { CreateAccountPayable } from './application/commands/register-accountPayable.command';
import { CreateAccountPayableHandler } from './application/handlers/register-accountPayable.handlre';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountPayableApplicationService } from './application/services/accountPayable-application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentPayableAggregate } from './domain/aggregates/payment-payable';
import { AccountPayableAggregate } from './domain/aggregates/account-payable';
import { PaymentPayableController } from './api/payment-payable.controller';
import { PaymentPayableApplicationService } from './application/services/paymentPayable-application.service';
import { ConfigModule } from '@nestjs/config';
import { CreatePaymentPayableHandler } from './application/handlers/register-paymentPayable.handler';
import { PaymentAggregate } from './domain/aggregates/payment';
import { CreatePaymentHandler } from './application/handlers/register-payment.handler';
import { PaymentController } from './api/payment.controller';
import { PaymentApplicationService } from './application/services/payment-application.service';
import { AccountPayablesQueriesHandler, GetAccountPayableByIdHandler } from './application/handlers/queries/account-payable-queries.handler';
import { AccountPayableAggregateDeleteHandler } from './application/handlers/delete-accountPayable.handler';
import { InvoiceController } from './api/invoice.controller';
import { CreateInvoiceHandler } from './application/handlers/register-invoice.handler';
import { invoice } from './domain/entities/invoice.entity';
import { InvoiceApplicationService } from './application/services/invoice-application.service';

export const CommandHandlers = [CreateAccountPayableHandler, CreatePaymentPayableHandler, CreatePaymentHandler, AccountPayableAggregateDeleteHandler, CreateInvoiceHandler];
export const QueryHandlers = [GetAccountPayableByIdHandler, AccountPayablesQueriesHandler];
@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([PaymentPayableAggregate, AccountPayableAggregate, PaymentAggregate,invoice]),
        CqrsModule,
        BillingManagementModule
    ],
    controllers: [
        AccountPayableController, PaymentPayableController, PaymentController, InvoiceController
    ],
    providers: [
        AccountPayableApplicationService, PaymentPayableApplicationService, PaymentApplicationService,InvoiceApplicationService,
        ...CommandHandlers,
        ...QueryHandlers
    ]
})
export class BillingManagementModule { }
