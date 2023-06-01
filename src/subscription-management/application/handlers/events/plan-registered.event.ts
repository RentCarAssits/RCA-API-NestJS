import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlanRegistered } from "src/subscription-management/domain/events/plan-registered.event";

@EventsHandler(PlanRegistered)
export class PlanRegisteredHandler implements IEventHandler<PlanRegistered>{
    constructor(){}
    handle(event: PlanRegistered) {
        console.log('handle logic for PlanRegistered event');
        console.log(event);
    }
}