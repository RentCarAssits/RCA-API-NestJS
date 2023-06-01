import { Subscription } from "../entity/Subscription.entity";

import { Plan } from "../entity/plan.entity";
import { Period } from "../values/period.value";
import { SubscriptionFrequency } from "../values/subscription-frequency.value";
import { SubscriptionId } from "../values/subscription-id.value";

export class SubscriptionFactory{
    public static createFrom(
    
        UnitPrice:number,
        Frequency: SubscriptionFrequency,
        Period: Period,
    ): Subscription{
        return new Subscription(UnitPrice,Frequency,Period);
    }


    /*
    public static withId(
        Id:SubscriptionId,
        Account:Account,
        Plan:Plan,
        UnitPrice:number,
        Frequency: SubscriptionFrequency,
        Period: Period,
    ):Subscription{
        const subscription: Subscription = new Subscription(
            Id,
            Account,
            Plan,
            UnitPrice,
            Frequency,
            Period,
        );
        return subscription;
    }
  */
 
}