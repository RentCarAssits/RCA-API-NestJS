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
import { GetAllRentingOrderItemsHandler } from './application/handlers/queries/get-all-renting-order-items.handler';
import { RentingOrderItemsController } from './api/rentingOrderItem/renting-order-items.controller';
import { RentingOrderItem } from './domain/entities/renting-order-item.entity';
import { RentingOrderItemService } from './application/services/renting-order-item.service';
import { CreateRentingOrderItemValidator } from './application/validators/create-renting-order-item.validator';

export const CommandHandlers = [
  RegisterVehicleHandler,
  CreateRentingOrderItemHandler,
];
export const EventHandlers = [
  ProductRegisteredHandler,
  RentingOrderItemCreatedHandler,
];
export const QueryHandlers = [
  GetAllVehiclesHandler,
  GetVehicleByIdHandler,
  GetAllRentingOrderItemsHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Vehicle, RentingOrderItem]),
    CqrsModule,
  ],
  controllers: [VehiclesController, RentingOrderItemsController],
  providers: [
    VehiclesApplicationService,
    GetAllVehiclesHandler,
    GetVehicleByIdHandler,
    RegisterVehicleValidator,
    RentingOrderItemService,
    GetAllRentingOrderItemsHandler,
    CreateRentingOrderItemValidator,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class RentingManagementModule {}
