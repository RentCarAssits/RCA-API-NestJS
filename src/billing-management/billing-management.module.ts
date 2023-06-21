import { Module } from '@nestjs/common';
import { AccountPayableController } from './api/account-payable.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AccountPayable } from './domain/entities/account-payable.entity';
import { AccountPayableRegisteredHandler } from './application/handlers/events/account-payable-registered.handler';
import { CreateAccountPayableHandler } from './application/handlers/commands/create-account-payable.handler';
import { AccountPayableService } from './application/services/account-payable.service';
import { RegisterAccountPayableValidator } from './application/validators/register-account-payable.validator';

export const CommandHandlers=[CreateAccountPayableHandler];
export const EventHandlers=[AccountPayableRegisteredHandler];

@Module({
    imports:[
        ConfigModule,
        TypeOrmModule.forFeature([AccountPayable]),
        CqrsModule,
        BillingManagementModule
    ],
    controllers:[
        AccountPayableController
    ],

    providers:[
        AccountPayableService,
        RegisterAccountPayableValidator,
        ...CommandHandlers,
        ...EventHandlers
    ]
})
export class BillingManagementModule {}