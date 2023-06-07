import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './domain/entities/vehicle.entity';
import { Category } from './domain/entities/category.entity';
import { VehiclesController } from './api/vehicles/vehicles.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { VehiclesApplicationService } from './application/services/vehicles-application.service';
import {
  GetAllVehiclesByByOwnerHandler,
  GetAllVehiclesByStarsHandler,
  GetAllVehiclesByYearHandler,
  GetAllVehiclesHandler,
  GetVehicleByIdHandler,
} from './application/handlers/queries/vehicles-queries.handler';
import { RegisterVehicleValidator } from './application/validators/register-vehicle.validator';
import { RegisterVehicleHandler } from './application/handlers/commands/register-vehicle.handler';
import { ProductRegisteredHandler } from './application/handlers/events/vehicle-registered.handler';
import { IamManagementModule } from 'src/iam-management/iam-management.module';
import { UpdateVehicleHandler } from './application/handlers/commands/update-vehicle.handler';
import { VehicleUpdatedHandler } from './application/handlers/events/vehicle-updated.handler';
import { UpdateVehicleValidator } from './application/validators/update-vehicle.validator';

export const CommandHandlers = [RegisterVehicleHandler, UpdateVehicleHandler];
export const EventHandlers = [ProductRegisteredHandler, VehicleUpdatedHandler];
export const QueryHandlers = [
  GetAllVehiclesHandler,
  GetVehicleByIdHandler,
  GetAllVehiclesByStarsHandler,
  GetAllVehiclesByYearHandler,
  GetAllVehiclesByByOwnerHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Vehicle]),
    CqrsModule,
    IamManagementModule,
  ],
  controllers: [VehiclesController],
  providers: [
    VehiclesApplicationService,
    GetAllVehiclesHandler,
    GetVehicleByIdHandler,
    RegisterVehicleValidator,
    UpdateVehicleValidator,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class RentingManagementModule {}
