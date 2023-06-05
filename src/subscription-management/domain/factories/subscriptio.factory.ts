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

    public static withId(
        id:SubscriptionId,
        plan:Plan,
        unitPrice:number,
        frequency: SubscriptionFrequency,
        period: Period,
    ):Subscription{
        const subscription: Subscription = new Subscription(
            unitPrice,
            frequency,
            period,
        );
        subscription.changeId(id);
        return subscription;
    }
  
 
}