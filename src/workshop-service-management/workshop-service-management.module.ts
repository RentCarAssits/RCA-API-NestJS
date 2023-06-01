import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryOperation } from './domain/entities/inventory-operation.entity';
import { InventoryTransaction } from './domain/entities/inventory-transaction.entity';
import { Inventory } from './domain/entities/inventory.entity';
import { Product } from './domain/entities/product.entity';
import { Proposal } from './domain/entities/proposal.entity';
import { RequestItem } from './domain/entities/request-item.entity';
import { ServiceItemOrder } from './domain/entities/service-item-order-entity';
import { ServiceItem } from './domain/entities/service-item';
import { Warehouse } from './domain/entities/warehouse.entity';
import { Workshop } from './domain/entities/workshop.entity';
import { ProposalController } from './api/proposal.controller';
import { ProposalService } from './application/services/proposal.service';
import { CreateProposalHandler } from './application/handlers/commands/create-proposal.handler';
import { CreateProposalValidator } from './application/validators/create-proposal.validator';
import { CqrsModule } from '@nestjs/cqrs';

export const CommandHandlers = [CreateProposalHandler];
export const EventHandlers = [];
export const QueryHandlers = [];

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([
      InventoryOperation,
      InventoryTransaction,
      Inventory,
      Product,
      Proposal,
      RequestItem,
      ServiceItemOrder,
      ServiceItem,
      Warehouse,
      Workshop,
    ]),
    CqrsModule,
  ],
  controllers: [ProposalController],
  providers: [
    ProposalService,
    CreateProposalValidator,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class WorkshopServiceManagementModule {}
