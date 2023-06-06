import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './domain/entities/vehicle.entity';
import { Category } from './domain/entities/category.entity';
import { VehiclesController } from './api/vehicles/vehicles.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { VehiclesApplicationService } from './application/services/vehicles-application.service';
import {
  GetAllVehiclesHandler,
  GetVehicleByIdHandler,
} from './application/handlers/queries/vehicles-queries.handler';
import { RegisterVehicleValidator } from './application/validators/register-vehicle.validator';
import { RegisterVehicleHandler } from './application/handlers/commands/register-vehicle.handler';
import { ProductRegisteredHandler } from './application/handlers/events/vehicle-registered.handler';
import { CreateRentingOrderItemHandler } from './application/handlers/commands/create-renting-order-item.handler';
import { RentingOrderItemCreatedHandler } from './application/handlers/events/renting-order-item-created.handler';
import {
  RentingOrderItemsQueriesHandler,
  GetRentingOrderItemByIdHandler,
  GetRentingOrderItemByVehiclesIdHandler,
  GetAllRentingItemsByRenterIdHandler,
} from './application/handlers/queries/renting-order-items-queries.handler';
import { RentingOrderItemsController } from './api/rentingOrderItem/renting-order-items.controller';
import { RentingOrderItem } from './domain/entities/renting-order-item.entity';
import { RentingOrderItemService } from './application/services/renting-order-item.service';
import { CreateRentingOrderItemValidator } from './application/validators/create-renting-order-item.validator';
import { IamManagementModule } from 'src/iam-management/iam-management.module';
import { UpdateRentingOrderItemValidator } from './application/validators/update-renting-order-item.validator';
import { UpdateRentingOrderItemCommand } from './application/commands/update-renting-order-item.command';
import { UpdateRentingOrderItemHandler } from './application/handlers/commands/update-renting-order-item.handler';
import { UpdateVehicleHandler } from './application/handlers/commands/update-vehicle.handler';
import { VehicleUpdatedHandler } from './application/handlers/events/vehicle-updated.handler';
import { UpdateVehicleValidator } from './application/validators/update-vehicle.validator';
import { GetAllRentingItemsByRenterIdQuery } from './application/queries/get-all-renting-items-by-renter-id.query';

export const CommandHandlers = [
  RegisterVehicleHandler,
  CreateRentingOrderItemHandler,
  UpdateRentingOrderItemCommand,
  UpdateVehicleHandler,
];
export const EventHandlers = [
  ProductRegisteredHandler,
  RentingOrderItemCreatedHandler,
  UpdateRentingOrderItemHandler,
  VehicleUpdatedHandler,
];
export const QueryHandlers = [
  GetAllVehiclesHandler,
  GetVehicleByIdHandler,
  RentingOrderItemsQueriesHandler,
  GetRentingOrderItemByIdHandler,
  GetRentingOrderItemByVehiclesIdHandler,
  GetAllRentingItemsByRenterIdHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Vehicle, RentingOrderItem]),
    CqrsModule,
    IamManagementModule,
  ],
  controllers: [VehiclesController, RentingOrderItemsController],
  providers: [
    VehiclesApplicationService,
    RegisterVehicleValidator,
    RentingOrderItemService,
    CreateRentingOrderItemValidator,
    UpdateRentingOrderItemValidator,
    UpdateVehicleValidator,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class RentingManagementModule {}
