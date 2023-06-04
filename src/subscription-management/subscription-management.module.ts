import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './domain/entity/plan.entity';
import { RegisterPlanHanlder } from './application/handlers/commands/register-plan.handler';
import { PlanApplicationService } from './application/service/plan-application.service';
import { GetAllPlanQuerys } from './application/queries/get-all-plan.query';
import { getPlanByIdQuery } from './application/queries/get-plan-id.queries';
import { RegisterPlanValidator } from './application/validators/register-plan-validator';
import { PlanController } from './api/plans/plans.controllers';
import {
  GetAllPlanHandler,
  GetPlanByIdHandler,
} from './application/handlers/queries/plan-queries.handler';
import { PlanRegisteredHandler } from './application/handlers/events/plan-registered.event';

export const CommandHandlersPlan = [RegisterPlanHanlder];
export const eventHandlerPlan = [PlanRegisteredHandler];
export const QueryHandler = [GetAllPlanHandler, GetPlanByIdHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Plan]), CqrsModule],
  controllers: [PlanController],
  providers: [
    //Plans
    PlanApplicationService,
    GetAllPlanQuerys,
    getPlanByIdQuery,
    RegisterPlanValidator,
    ...CommandHandlersPlan,
    ...eventHandlerPlan,
    ...QueryHandler,
  ],
})
export class SubscriptionManagementModule {}
