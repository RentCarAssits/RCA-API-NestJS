import { Module } from '@nestjs/common';
import { AccountPayableController } from './api/account-payable.controller';
import { CreateAccountPayable } from './application/commands/register-accountPayable.command';
import { CreateAccountPayableHandler } from './application/handlers/register-accountPayable.handlre';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountPayableApplicationService } from './application/services/accountPayable-application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentPayableAggregate } from './domain/aggregates/payment-payable';
import { AccountPayableAggregate } from './domain/aggregates/account-payable';

export const CommandHandlers=[CreateAccountPayableHandler];

@Module({
    imports:[
        TypeOrmModule.forFeature([PaymentPayableAggregate,AccountPayableAggregate]),
        CqrsModule,
        BillingManagementModule
    ],
    controllers:[
        AccountPayableController
    ],
    providers:[
        AccountPayableApplicationService, 
        ...CommandHandlers
    ]
})
export class BillingManagementModule {}
