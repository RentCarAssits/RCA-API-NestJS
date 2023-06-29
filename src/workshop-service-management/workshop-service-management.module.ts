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
import { CreateServiceRequestHandler } from './application/handlers/commands/create-service-request.handler';
import { ServiceRequestCreatedHandler } from './application/handlers/events/service-request-created.handler';
import { ServiceRequestController } from './api/service-request.controller';
import { CreateServiceRequestValidator } from './application/validators/create-service-request.validator';
import { ServiceRequestService } from './application/services/service-request.service';
import { IamManagementModule } from 'src/iam-management/iam-management.module';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';
import { WorkshopController } from './api/workshop.controller';
import { CreateWorkshopHandler } from './application/handlers/commands/create-workshop.handler';
import { WorkshopCreatedHandler } from './application/handlers/events/workshop-created-handler';
import { WorkshopService } from './application/services/workshop.service';
import { CreateWorkshopValidator } from './application/validators/create-workshop.validator';
import { CreateDiagnostictHandler } from './application/handlers/commands/create-diagnostic.handler';
import { DiagnosticCreatedHandler } from './application/handlers/events/diagnostic-created.handler';
import { DiagnosticController } from './api/diagnostic.controller';
import { DiagnosticService } from './application/services/diagnostic.service';
import { CreateDiagnosticValidator } from './application/validators/create-diagnostic.validator';
import { ProductController } from './api/product.controller';
import { ProductService } from './application/services/product.service';
import { CreateProductValidator } from './application/validators/create-product.validator';
import { CreateProductHandler } from './application/handlers/commands/create-product.handler';
import { ProductCreatedHandler } from './application/handlers/events/product-created.handler';
import { CreateRequestItemHandler } from './application/handlers/commands/create-request-item.handler';
import { RequestItemCreatedHandler } from './application/handlers/events/request-item-created.handler';
import { RequestItemController } from './api/request-item.controller';
import { RequestItemService } from './application/services/request-item.service';
import { CreateRequestItemValidator } from './application/validators/create-request-item.validator';
import { ServiceItemService } from './application/services/service-item.service';
import { CreateServicetItemValidator } from './application/validators/create-service-item.validator';
import { ServiceItemController } from './api/service-item.controller';
import { CreateServiceItemHandler } from './application/handlers/commands/create-service-item.handler';
import { ServiceItemCreatedHandler } from './application/handlers/events/service-item-reated.handler';
import { ChatController } from './api/chat/chat.controller';
import { MessageFacade } from './infrastructure/openIA/messageFacade.service';
import { OpenAIService } from './application/service/openAI-chatbot.service';
import { ServiceOrder } from './domain/entities/service-order.entity';
import { CreateServiceItemOrderCommand } from './application/commands/create-service-item-order.command';
import { CreateServiceOrderCommand } from './application/commands/create-service-order.command';
import { CreateServiceOrderHandler } from './application/handlers/commands/create-service-order.handlet';
import { CreateServiceItemOrderHandler } from './application/handlers/commands/create-service-item-order.handler';

export const CommandHandlers = [
  CreateProposalHandler,
  CreateWarehouseHandler,
  CreateInventoryHandler,
  CreateServiceRequestHandler,
  CreateWorkshopHandler,
  CreateDiagnostictHandler,
  CreateProductHandler,
  CreateRequestItemHandler,
  CreateServiceItemHandler,
  CreateServiceOrderHandler,
  CreateServiceItemOrderHandler,
];
export const EventHandlers = [
  ProposalCreatedHandler,
  WarehouseCreatedHandler,
  InventoryCreatedHandler,
  ServiceRequestCreatedHandler,
  WorkshopCreatedHandler,
  DiagnosticCreatedHandler,
  ProductCreatedHandler,
  RequestItemCreatedHandler,
  ServiceItemCreatedHandler,
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
      Vehicle,
      ServiceOrder,
    ]),
    CqrsModule,
    IamManagementModule,
  ],
  controllers: [
    ProposalController,
    WarehouseController,
    InventoryController,
    ServiceRequestController,
    WorkshopController,
    DiagnosticController,
    ProductController,
    RequestItemController,
    ServiceItemController,
    ChatController,
  ],
  providers: [
    ProposalService,
    CreateProposalValidator,
    WarehouseService,
    CreateWarehouseValidator,
    InventoryService,
    CreateInventoryValidator,
    ServiceRequestService,
    CreateServiceRequestValidator,
    WorkshopService,
    CreateWorkshopValidator,
    DiagnosticService,
    CreateDiagnosticValidator,
    ProductService,
    CreateProductValidator,
    RequestItemService,
    CreateRequestItemValidator,
    ServiceItemService,
    CreateServicetItemValidator,
    MessageFacade,
    OpenAIService,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class WorkshopServiceManagementModule {}
