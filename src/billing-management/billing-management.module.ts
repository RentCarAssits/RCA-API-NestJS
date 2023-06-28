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

export const CommandHandlers = [CreateAccountPayableHandler, CreatePaymentPayableHandler, CreatePaymentHandler];
export const QueryHandlers = [GetAccountPayableByIdHandler,AccountPayablesQueriesHandler];
@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([PaymentPayableAggregate, AccountPayableAggregate, PaymentAggregate]),
        CqrsModule,
        BillingManagementModule
    ],
    controllers: [
        AccountPayableController, PaymentPayableController, PaymentController
    ],
    providers: [
        AccountPayableApplicationService, PaymentPayableApplicationService, PaymentApplicationService,
        ...CommandHandlers,
        ...QueryHandlers
    ]
})
export class BillingManagementModule { }
