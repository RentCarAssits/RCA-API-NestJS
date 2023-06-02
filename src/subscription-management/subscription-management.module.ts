import { Module } from "@nestjs/common";
import { RegisterSubscriptionHandler } from "./application/handlers/commands/register-subscription.handler";
import { Subscription } from "./domain/entity/Subscription.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { IamManagementModule } from "src/iam-management/iam-management.module";
import { SubscriptionController } from "./api/subscriptions/subscription.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { subscriptionApplicationService } from "./application/service/subscription-application.service";
import { getAllSubscriptionQuery } from "./application/queries/get-all-subscription.query";
import { getSubscriptionByIdQuery } from "./application/queries/get-subscription-id.query";
import { RegisterSubscriptionValidator } from "./application/validators/register-subscription.validator";
import { Plan } from "./domain/entity/plan.entity";
import { RegisterPlanHanlder } from "./application/handlers/commands/register-plan.handler";
import { PlanApplicationService } from "./application/service/plan-application.service";
import { GetAllPlanQuerys } from "./application/queries/get-all-plan.query";
import { getPlanByIdQuery } from "./application/queries/get-plan-id.queries";
import { RegisterPlanValidator } from "./application/validators/register-plan-validator";


export const CommandHandlers = [RegisterSubscriptionHandler];
//export const EventHanlders = [RegisterSubscriptionHandler];

export const CommandHandlersPlan = [RegisterPlanHanlder];
//export const EventHandlersPlan = [Resi]

@Module({
    imports:[
        TypeOrmModule.forFeature([Subscription,Plan]),
        CqrsModule,
        IamManagementModule,
    ],
    controllers:[SubscriptionController],
    providers:[
        //Subscriptions
        subscriptionApplicationService,
        getAllSubscriptionQuery,
        getSubscriptionByIdQuery,
        RegisterSubscriptionValidator,

        //Plans
        PlanApplicationService,
        GetAllPlanQuerys,
        getPlanByIdQuery,
        RegisterPlanValidator,

        //Subscription
        ...CommandHandlers,
        //Plans
        ...CommandHandlersPlan
    ]
    

})
export class SubscriptionManagementModule{}
