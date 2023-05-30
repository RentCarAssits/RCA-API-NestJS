import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { RegisterSubscription } from "../../commands/register-subscription";
import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from "src/subscription-management/domain/entity/Subscription.entity";
import { Repository } from "typeorm";
import { Plan } from "../../dtos/PlanDto";
import { Result } from "typescript-result";
import { AppNotification } from "src/shared/application/app.notification";
import { Period } from "src/subscription-management/domain/values/period.value";

@CommandHandler(RegisterSubscription)
export class RegisterSubscriptionHandler implements ICommandHandler<RegisterSubscription>{
    constructor(
        @InjectRepository(Subscription)
        private SubscriptionRepository: Repository<Subscription>, 
        private PlanRepository: Repository<Plan>,private publisher: EventPublisher
    ){}

    private subscription = Subscription;
    
    async execute(command: RegisterSubscription): Promise<any> {
        const subscriptions = command.PlanId;
        let subscriptionId = 0;

        const subscriptionPeriodResult: Result<AppNotification,Period> = Period.create(
            command.Period,
        )
        if (subscriptionPeriodResult.isFailure()) return subscriptionId;
    }



}