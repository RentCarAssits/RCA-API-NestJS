import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { RegisterSubscription } from "../../commands/register-subscription";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from "src/subscription-management/domain/entity/Subscription.entity";
import { Repository } from "typeorm";
import { Result } from "typescript-result";
import { SubscriptionFrequency } from "src/subscription-management/domain/values/subscription-frequency.value";
import { AppNotification } from "src/shared/application/app.notification";
import { SubscriptionFactory } from "src/subscription-management/domain/factories/subscriptio.factory";
import { Period } from "src/subscription-management/domain/values/period.value";
import { SubscriptionId } from "src/subscription-management/domain/values/subscription-id.value";

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
        const planCommand = command.planId;
        let subscriptionId=0;
        
        const subscriptionUnitPrice: number = Number(command.unitPrice);

        const SubscriptionFrequencyResult: Result<AppNotification,SubscriptionFrequency> =
        SubscriptionFrequency.create(command.frequency);
        if(SubscriptionFrequencyResult.isFailure()){return subscriptionId;}

        const currentDate = new Date();
        const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
        
        const period = Period.from(currentDate,nextMonthDate);
        
        const subscriptionEntity:Subscription = SubscriptionFactory.createFrom(
            subscriptionUnitPrice,
            SubscriptionFrequencyResult.value,
            period
        )
        
       
         
        const aux = {
            unitPrice: subscriptionUnitPrice,
            plan: planCommand,
            frequency: SubscriptionFrequencyResult.value,
            period:period,
        };
        
        const subscriptionAux = this.SubscriptionRepository.create(
            new Subscription(subscriptionUnitPrice,SubscriptionFrequencyResult.value,period)
        );
        
        let subscription = await this.SubscriptionRepository.save(subscriptionAux);
        if(subscription == null){return subscriptionId;}
        console.log('Subscription: ', subscription);
        
        subscriptionId = Number(subscription.getId());
        console.log('SubscriptionId',subscriptionId);
        subscription.changeId(SubscriptionId.of(subscriptionId));
        subscription = this.publisher.mergeObjectContext(subscription);
        subscription.register();
        subscription.commit();

        return subscriptionId;
    }

}

//factory handler