import { Plan } from "../entity/plan.entity";
import { PlanId } from "../values/plan-id.value";
import { PlanName } from "../values/plan-name.value";

export class PlanFactory{
    public static createFrom(
        PlanName:PlanName,
        Benefits:string,
    ):Plan{
        return new Plan(PlanName,Benefits)
    }

    public static withId(
        PlanId:PlanId,
        PlanName:PlanName,
        Benefits:string,
    ):Plan{
        const plan: Plan = new Plan(
            PlanName,
            Benefits,
        );
        plan.changeId(PlanId);
        return plan;
    };

}