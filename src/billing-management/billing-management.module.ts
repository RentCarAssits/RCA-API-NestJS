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
import { PaymentAggregate } from './domain/aggregates/payment';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

export const CommandHandlers = [CreateAccountPayableHandler];

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      AccountPayableAggregate,
      PaymentPayableAggregate,
      PaymentAggregate,
    ]),
    CqrsModule,
  ],
  controllers: [AccountPayableController, PaymentPayableController],
  providers: [
    AccountPayableApplicationService,
    PaymentPayableApplicationService,
    ...CommandHandlers,
    CommandBus,
    QueryBus,
  ],
  exports: [TypeOrmModule],
})
export class BillingManagementModule {}