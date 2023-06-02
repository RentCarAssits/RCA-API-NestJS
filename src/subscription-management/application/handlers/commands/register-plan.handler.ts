import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { RegisterPlans } from "../../commands/register-plan.command";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Plan } from "src/subscription-management/domain/entity/plan.entity";
import { Repository } from "typeorm";
import { Result } from "typescript-result";
import { AppNotification } from "src/shared/application/app.notification";
import { PlanName } from "src/subscription-management/domain/values/plan-name.value";
import { PlanFactory } from "src/subscription-management/domain/factories/plan.factory";
import { PlanId } from "src/subscription-management/domain/values/plan-id.value";

@CommandHandler(RegisterPlans)
export class RegisterPlanHanlder implements ICommandHandler<RegisterPlans>{
    constructor(@InjectRepository(Plan) private PlanRepository: Repository<Plan>, private publisher: EventPublisher) {}
    private plan = Plan;
    async execute(command: RegisterPlans) {
        let _PlanId = 0;
        const PlanNameResult: Result<AppNotification,PlanName> = 
            PlanName.create(command.PlanName);
        if (PlanNameResult.isFailure()) return _PlanId;
        const PlanBenefitsResult: string = command.Benefits;

        const PlanEntity: Plan = PlanFactory.createFrom(
            PlanNameResult.value,
            PlanBenefitsResult
        );

        const planId = 12;
            
        // is not used because is not acepted by create repository function.
        const Aux = {
            PlanName: PlanNameResult.value,
            Benefits: PlanBenefitsResult
        };

        const PlanAux = this.PlanRepository.create(new Plan(PlanNameResult.value,PlanBenefitsResult));
        let PlanSave = await this.PlanRepository.save(PlanAux);
        if(PlanSave == null){
            return _PlanId;
        }
        console.log('Plan',PlanSave);

        _PlanId = Number(PlanSave.getId());
        console.log('PlanId',planId);
        PlanSave.changeId(PlanId.of(_PlanId));
        PlanSave = this.publisher.mergeObjectContext(PlanSave);
        PlanSave.register();
        PlanSave.commit();
        return PlanId;
    }
}