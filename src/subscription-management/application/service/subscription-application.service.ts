import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Connection } from "typeorm";
import { RegisterSubscriptionValidator } from "../validators/register-subscription.validator";
import { RegisterSubscriptionRequest } from "../request/register-subscription.request";
import { Result } from "typescript-result";
import { AppNotification } from "src/shared/application/app.notification";

import { RegisterSubscription } from "../commands/register-subscription";
import { RegisterSubscriptionResponse } from "../response/register-subscription.response";

@Injectable()
export class subscriptionApplicationService{
  constructor(private connection: Connection,private commandBus: CommandBus,
    private registerSubscriptionValidator: RegisterSubscriptionValidator,
  ) { console.log('this.connection.isConnected: ', this.connection.isConnected);}

  async register(RegisterSubscriptionRequest: RegisterSubscriptionRequest,): 
    Promise<Result<AppNotification,RegisterSubscriptionResponse>>{
    
      const notification: AppNotification = await this.registerSubscriptionValidator.validate(RegisterSubscriptionRequest);
      if(notification.hasErrors()){return Result.error(notification);} 
      
      const registerSubscription: RegisterSubscription = new RegisterSubscription(
      //RegisterSubscriptionRequest.AccountId,
      RegisterSubscriptionRequest.PlanId,
      RegisterSubscriptionRequest.UnitPrice,
      RegisterSubscriptionRequest.Frequency,
      RegisterSubscriptionRequest.startDate,
      RegisterSubscriptionRequest.endDate,   
      );      
    
    const subscriptionId: number = await this.commandBus.execute(registerSubscription);     
      const registerSubscriptionResponse: RegisterSubscriptionResponse =
      new RegisterSubscriptionResponse(
        subscriptionId,
        registerSubscription.planId,
      //registerSubscription.AccountId,
        registerSubscription.unitPrice,
        registerSubscription.frequency,
        registerSubscription.startDate,
        registerSubscription.endDate,
        );
      return Result.ok(registerSubscriptionResponse);
    }
}
