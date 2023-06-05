import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from "src/subscription-management/domain/entity/Subscription.entity";
import { Repository } from "typeorm";
import { RegisterSubscriptionRequest } from "../request/register-subscription.request";
import { AppNotification } from "src/shared/application/app.notification";

@Injectable()
export class RegisterSubscriptionValidator{
    constructor(
        @InjectRepository(Subscription) private subscriptionRepository: Repository<Subscription>
        ){}

    public async validate(RegisterSubscriptionRequest: RegisterSubscriptionRequest): Promise<AppNotification>{
        const notification: AppNotification = new AppNotification();
        
        const unitPrice:number = RegisterSubscriptionRequest.UnitPrice;
        if( unitPrice < 0 ){
            notification.addError('UnitPrice is required and must be a valid price', null);
        }

        const startDate: Date = RegisterSubscriptionRequest.startDate;
        if(startDate===null){
            notification.addError('StartDate is required and must be a valid date', null);
        }
        
        const endDate:Date = RegisterSubscriptionRequest.endDate;
        if(endDate===null){
            notification.addError('EndDate is required and must be a valid date', null);
        }

        const Frequency:string = RegisterSubscriptionRequest.Frequency;
        if(Frequency.length <= 0){notification.addError('Frequency is required', null);}
    
        if (notification.hasErrors()) {return notification;}

        /*const Subscription: Subscription = await 
        this.subscriptionRepository.createQueryBuilder().where('Frequency =: Frequency',{Frequency}).getOne();
        if(Subscription!=null){
            notification.addError('Subscription Frequency is taken', null);
        }*/
        return notification;
    }
}