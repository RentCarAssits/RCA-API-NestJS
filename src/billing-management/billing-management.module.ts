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

export const CommandHandlers=[CreateAccountPayableHandler,CreatePaymentPayableHandler];

@Module({
    imports:[
        ConfigModule,
        TypeOrmModule.forFeature([PaymentPayableAggregate,AccountPayableAggregate]),
        CqrsModule,
        BillingManagementModule
    ],
    controllers:[
        AccountPayableController, PaymentPayableController
    ],
    providers:[
        AccountPayableApplicationService,PaymentPayableApplicationService,
        ...CommandHandlers
    ]
})
export class BillingManagementModule {}
