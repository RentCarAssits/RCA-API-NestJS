import { Account } from "src/iam-management/domain/entities/account.entity";
import { Subscription } from "../entity/Subscription.entity";

import { Plan } from "../entity/plan.entity";
import { Period } from "../values/period.value";
import { SubscriptionFrequency } from "../values/subscription-frequency.value";
import { SubscriptionId } from "../values/subscription-id.value";

export class SubscriptionFactory{
    public static createFrom(
        accountId:number,
        Plan:number,
        UnitPrice:number,
        Frequency: SubscriptionFrequency,
        Period: Period,
        Discount: number,
    ): Subscription{
        return new Subscription(accountId,Plan,UnitPrice,Frequency,Period,Discount);
    }

    public static withId(
        id:SubscriptionId,
        accountId:number,
        plan:number,
        unitPrice:number,
        frequency: SubscriptionFrequency,
        period: Period,
        Discount: number,
    ):Subscription{
        const subscription: Subscription = new Subscription(
            accountId,
            plan,
            unitPrice,
            frequency,
            period,
            Discount,
        );
        subscription.changeId(id);
        return subscription;
    }
  
 
}