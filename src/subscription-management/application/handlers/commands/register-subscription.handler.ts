import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { RegisterSubscription } from "../../commands/register-subscription";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from "src/subscription-management/domain/entity/Subscription.entity";
import { Repository } from "typeorm";
import { Plan } from "../../dtos/PlanDto";
import { Result } from "typescript-result";
import { SubscriptionFrequency } from "src/subscription-management/domain/values/subscription-frequency.value";
import { AppNotification } from "src/shared/application/app.notification";
import { SubscriptionFactory } from "src/subscription-management/domain/factories/subscriptio.factory";
import { Account } from "src/subscription-management/domain/entity/account.entity";
import { Period } from "src/subscription-management/domain/values/period.value";

@CommandHandler(RegisterSubscription)
export class RegisterSubscriptionHandler implements ICommandHandler<RegisterSubscription>{
    constructor(
        @InjectRepository(Subscription)
        private SubscriptionRepository: Repository<Subscription>, 
        //private PlanRepository: Repository<Plan>,
        private publisher: EventPublisher
    ){}

    private subscription = Subscription;
    
    async execute(command: RegisterSubscription){
        const accounts = command.AccountId;
        const plan = command.PlanId;
        let subscriptionId = 0;

        const SubscriptionFrequencyResult: Result<AppNotification, SubscriptionFrequency> =
        SubscriptionFrequency.create(command.Frequency);
        if (SubscriptionFrequencyResult.isFailure()) return subscriptionId;
        
        const SubscriptionPlanIDResult = command.PlanId
        const SubscriptionUnitPriceResult = command.UnitPrice
        
        const SubcriptionPeriod: Result<AppNotification, Period> =
            Period.create(command.Period,command.Period2);
        if(SubcriptionPeriod.isFailure()) return subscriptionId;

        const SubscriptionEntity: Subscription = SubscriptionFactory.createFrom(
            SubscriptionUnitPriceResult,
            SubscriptionFrequencyResult.value,
            SubcriptionPeriod.value,
        )
    }



}



//factory handler