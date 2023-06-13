import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryOperation } from './domain/entities/inventory-operation.entity';
import { InventoryTransaction } from './domain/entities/inventory-transaction.entity';
import { Inventory } from './domain/entities/inventory.entity';
import { Product } from './domain/entities/product.entity';
import { Proposal } from './domain/entities/proposal.entity';
import { RequestItem } from './domain/entities/request-item.entity';
import { ServiceItemOrder } from './domain/entities/service-item-order-entity';
import { Warehouse } from './domain/entities/warehouse.entity';
import { Workshop } from './domain/entities/workshop.entity';
import { ProposalController } from './api/proposal.controller';
import { ProposalService } from './application/services/proposal.service';
import { CreateProposalHandler } from './application/handlers/commands/create-proposal.handler';
import { CreateProposalValidator } from './application/validators/create-proposal.validator';
import { CqrsModule } from '@nestjs/cqrs';
import { Diagnostic } from './domain/entities/diagnostic.entity';
import { ProposalCreatedHandler } from './application/handlers/events/proposal-created.handler';
import { WarehouseCreatedHandler } from './application/handlers/events/warehouse-created.handler';
import { InventoryCreatedHandler } from './application/handlers/events/inventory-created.handler';
import { InventoryController } from './api/inventory.controller';
import { WarehouseController } from './api/warehouse.controller';
import { WarehouseService } from './application/services/warehouse.service';
import { CreateWarehouseValidator } from './application/validators/create-warehouse.validator';
import { InventoryService } from './application/services/inventory.service';
import { CreateInventoryValidator } from './application/validators/create-inventory.validator';
import { CreateWarehouseHandler } from './application/handlers/commands/create-warehouse.handler';
import { CreateInventoryHandler } from './application/handlers/commands/create-inventory.handler';
import { ServiceItem } from './domain/entities/service-item.entity';
import { ServiceRequest } from './domain/entities/service-request.entity';
import {
  GetAllInventoryHandler,
  GetInventoryByIdHandler,
} from './application/handlers/queries/inventory.query';

export const CommandHandlers = [
  CreateProposalHandler,
  CreateWarehouseHandler,
  CreateInventoryHandler,
];
export const EventHandlers = [
  ProposalCreatedHandler,
  WarehouseCreatedHandler,
  InventoryCreatedHandler,
];
export const QueryHandlers = [GetAllInventoryHandler, GetInventoryByIdHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryOperation,
      InventoryTransaction,
      Inventory,
      Product,
      Proposal,
      RequestItem,
      ServiceItem,
      ServiceItemOrder,
      Warehouse,
      Workshop,
      Diagnostic,
      ServiceRequest,
    ]),
    CqrsModule,
  ],
  controllers: [ProposalController, WarehouseController, InventoryController],
  providers: [
    ProposalService,
    CreateProposalValidator,
    WarehouseService,
    CreateWarehouseValidator,
    InventoryService,
    CreateInventoryValidator,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class WorkshopServiceManagementModule {}
