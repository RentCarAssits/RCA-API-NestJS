import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentingOrderItem } from './domain/entities/renting-order-item.entity';
import { RentingOrderItemsController } from './api/renting-order-items.controller';
import { CreateRentingOrderItemHandler } from './application/handlers/commands/create-renting-order-item.handler';
import { RentingOrderItemCreatedHandler } from './application/handlers/events/renting-order-item-created.handler';

import { GetAllRentingOrderItemsHandler } from './application/handlers/queries/get-all-renting-order-items.handler';
import { RentingOrderItemService } from './application/services/renting-order-item.service';
import { CreateRentingOrderItemValidator } from './application/validators/create-renting-order-item.validator';

export const CommandHandlers = [CreateRentingOrderItemHandler];
export const EventHandlers = [RentingOrderItemCreatedHandler];
export const QueryHandlers = [GetAllRentingOrderItemsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([RentingOrderItem])],
  controllers: [RentingOrderItemsController],
  providers: [
    RentingOrderItemService,
    CreateRentingOrderItemValidator,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class RentingManagementModule {}
