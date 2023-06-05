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
import { GetAllPlanHandler,GetPlanByIdHandler,} from './application/handlers/queries/plan-queries.handler';
import { PlanRegisteredHandler } from './application/handlers/events/plan-registered.event';
import { SubscriptionController } from './api/subscriptions/subscription.controller';
import { subscriptionApplicationService } from './application/service/subscription-application.service';
import { getAllSubscriptionQuery } from './application/queries/get-all-subscription.query';
import { getSubscriptionByIdQuery } from './application/queries/get-subscription-id.query';
import { RegisterSubscriptionValidator } from './application/validators/register-subscription.validator';
import { RegisterSubscription } from './application/commands/register-subscription';
import { SubscriptionRegisteredHanlder } from './application/handlers/events/Subscription-registered.event';
import { GetAllSubscriptionHandler, GetSubscriptionByIdHanlder } from './application/handlers/queries/subscriptions-queries.handler';
import { Subscription } from './domain/entity/Subscription.entity';

export const CommandHandlersPlan = [RegisterPlanHanlder];
export const eventHandlerPlan = [PlanRegisteredHandler];
export const QueryHandlerPlan = [GetAllPlanHandler, GetPlanByIdHandler];

export const CommandHandlersSubscription = [RegisterSubscription];
export const eventHandlerSubscription = [SubscriptionRegisteredHanlder];
export const QueryHandlerSubscription = [GetAllSubscriptionHandler,GetSubscriptionByIdHanlder];

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan, Subscription]), 
    CqrsModule
  ],
  controllers: [PlanController, SubscriptionController],
  providers: [
    //Subscriptions
    subscriptionApplicationService,
    getAllSubscriptionQuery,
    getSubscriptionByIdQuery,
    RegisterSubscriptionValidator,
    //Plans
    PlanApplicationService,
    GetAllPlanQuerys,
    getPlanByIdQuery,
    //plansHandler
    RegisterPlanValidator,
    ...CommandHandlersPlan,
    ...eventHandlerPlan,
    ...QueryHandlerPlan,
    //subscriptionHandler
    ...CommandHandlersSubscription,
    ...eventHandlerSubscription,
    ...QueryHandlerSubscription,
  ],
})
export class SubscriptionManagementModule {}
