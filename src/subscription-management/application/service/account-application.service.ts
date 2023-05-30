import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { RegisterSubscriptionValidator } from "../validators/register-subscription.validator";
import { Connection } from "typeorm";
import { RegisterSubscriptionRequest } from "../request/register-subscription.request";
import { Result } from "typescript-result";
import { AppNotification } from "src/shared/application/app.notification";
import { RegisterSubscription } from "../commands/register-subscription";
import { RegisterSubscriptionResponse } from "../response/register-subscription.response";

@Injectable()
export class AccountApplicationService{
    constructor(private connection: Connection,
                private commandBus: CommandBus,
                private RegisterSubscriptionValidator: RegisterSubscriptionValidator,)
    {console.log('this.connection.isConnected: ', this.connection.isConnected);}
/*
    async register(
        RegisterSubscriptionRequest: RegisterSubscriptionRequest,
    ): Promise<Result<AppNotification,RegisterSubscriptionResponse>>{
        const Notification: AppNotification = await this.RegisterSubscriptionValidator.validate(RegisterSubscriptionRequest);
        if(Notification.hasErrors()){return Result.error(Notification);}
        
        const registerSubscription: RegisterSubscription = new RegisterSubscription(
            RegisterSubscriptionRequest.AccountId,
            RegisterSubscriptionRequest.PlanId,
            RegisterSubscriptionRequest.UnitPrice,
            RegisterSubscriptionRequest.Frequency,
            RegisterSubscriptionRequest.PeriodId,
        );

        const SubscriptionId: number = await this.commandBus.execute(RegisterSubscription);
        const registerSubscriptionResponse: RegisterSubscriptionResponse = 
            new RegisterSubscriptionResponse(
                SubscriptionId,
                registerSubscription.AccountId,
                registerSubscription.PlanId,
                registerSubscription.UnitPrice,
                registerSubscription.Frequency,
                registerSubscription.Period,
            );
        return Result.ok(registerSubscriptionResponse);
    }
    */

}


/*
     

*/