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


export const CommandHandlers = [RegisterSubscriptionHandler];
export const EventHanlders = [RegisterSubscriptionHandler];

@Module({
    imports:[
        TypeOrmModule.forFeature([Subscription]),
        CqrsModule,
        IamManagementModule,
    ],
    controllers:[SubscriptionController],
    providers:[
        subscriptionApplicationService,
        getAllSubscriptionQuery,
        getSubscriptionByIdQuery,
        RegisterSubscriptionValidator,
        ...CommandHandlers,
    ]
    

})
export class SubscriptionManagementModule{}
