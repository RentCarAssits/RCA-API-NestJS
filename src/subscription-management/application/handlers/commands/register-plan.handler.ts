import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegisterPlans } from "../../commands/register-plan.command";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Plan } from "src/subscription-management/domain/entity/plan.entity";
import { Repository } from "typeorm";
import { Result } from "typescript-result";
import { AppNotification } from "src/shared/application/app.notification";
import { PlanName } from "src/subscription-management/domain/values/plan-name.value";
import { PlanFactory } from "src/subscription-management/domain/factories/plan.factory";

@CommandHandler(RegisterPlans)
export class RegisterPlanHanlder implements ICommandHandler<RegisterPlans>{
    constructor(@InjectRepository(Plan) private PlanRepository: Repository<Plan>) {

    }

    private plan = Plan;

    async execute(command: RegisterPlans) {
        let PlanId = 0;
        const PlanNameResult: Result<AppNotification,PlanName> = 
            PlanName.create(command.PlanName);
        if (PlanNameResult.isFailure()) return PlanId;
        const PlanBenefits: string = command.Benefits;

        const PlanEntity: Plan = PlanFactory.createFrom(
            PlanNameResult.value,
            PlanBenefits
        );
    }
}