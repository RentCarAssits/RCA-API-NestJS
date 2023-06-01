import { Injectable } from "@nestjs/common";
import { Plan } from "src/subscription-management/domain/entity/plan.entity";
import { Repository } from "typeorm";
import { RegisterPlanRequest } from "../request/register-plan.request";
import { AppNotification } from "src/shared/application/app.notification";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class RegisterPlanValidator{
    constructor(
        @InjectRepository(Plan) private planRepository: Repository<Plan>,
    ){}

    public async validate(
        RegisterPlanRequest: RegisterPlanRequest,
    ): Promise<AppNotification>{
        const notification: AppNotification = new AppNotification();
        const planName: string = RegisterPlanRequest.PlanName.trim();
        const planBenefits:string = RegisterPlanRequest.Benefits.trim();
        if (planBenefits.length <= 0) {
            notification.addError('Plan benefits is required', null);
        }
        if (planName.length <= 0) {
            notification.addError('Plan name is required', null);
        }
        if (notification.hasErrors()) {
            return notification;
        }

        return notification;
    }
}