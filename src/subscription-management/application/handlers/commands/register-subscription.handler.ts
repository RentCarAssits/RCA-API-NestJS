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
        private publisher: EventPublisher
    ){}

    private subscription = Subscription;
    
    async execute(command: RegisterSubscription){
        const planCommand = command.PlanId;
        let subscriptionId=0;
        
        const account_id: number = Number(command.AccountId); //nuevo
        const plan_id: number = Number(command.PlanId); // nuevo
        const discount: number = Number(command.discount);

        let subscriptionUnitPrice: number = Number(command.UnitPrice);
        subscriptionUnitPrice = subscriptionUnitPrice - (subscriptionUnitPrice * (discount*0.01));


        const SubscriptionFrequencyResult: Result<AppNotification,SubscriptionFrequency> =
        SubscriptionFrequency.create(command.Frequency);
        if(SubscriptionFrequencyResult.isFailure()){return subscriptionId;}
        
        const currentDate = new Date();
        let nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth()); // aqui esta la logica debo colocar la frecuencia
        
        // ACA ENTRA LA FUNCION DE TIPO MENSUAL TRIMESTRAL SEMESTRAL
        if(SubscriptionFrequencyResult.value.getValue() === "MENSUAL"){
            nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
        } else if(SubscriptionFrequencyResult.value.getValue() === "SEMESTRAL"){
            nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 6);
        }else if(SubscriptionFrequencyResult.value.getValue() === "ANUAL"){
            nextMonthDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth());
        }else{
            nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth());
        }

        const period = Period.from(currentDate,nextMonthDate);
        
        const subscriptionEntity:Subscription = SubscriptionFactory.createFrom(
            account_id,
            plan_id,
            subscriptionUnitPrice,
            SubscriptionFrequencyResult.value,
            period,
            discount,
        )
         
        const aux = {
            unitPrice: subscriptionUnitPrice,
            plan: planCommand,
            frequency: SubscriptionFrequencyResult.value,
            period:period,
        };
        
        const subscriptionAux = this.SubscriptionRepository.create(
            new Subscription(account_id,plan_id,subscriptionUnitPrice,SubscriptionFrequencyResult.value,period,discount)
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