import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Connection } from 'typeorm';
import { RegisterPlanValidator } from '../validators/register-plan-validator';
import { Result } from 'typescript-result';
import { RegisterPlanRequest } from '../request/register-plan.request';
import { AppNotification } from 'src/shared/application/app.notification';
import { RegisterPlanResponse } from '../response/register-plan.response';
import { RegisterPlans } from '../commands/register-plan.command';

@Injectable()
export class PlanApplicationService {
  constructor(
    private connection: Connection,
    private commandBus: CommandBus,
    private RegisterPlanValidator: RegisterPlanValidator,
  ) {
    console.log('this.connection.isConnected: ', this.connection.isConnected);
  }

  async register(
    registerPlanRequest: RegisterPlanRequest,
  ): Promise<Result<AppNotification, RegisterPlanRequest>> {
    const notification: AppNotification =
      await this.RegisterPlanValidator.validate(registerPlanRequest);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    const registerPlan: RegisterPlans = new RegisterPlans(
      registerPlanRequest.PlanName,
      registerPlanRequest.Benefits,
    );

    const PlanId: number = await this.commandBus.execute(registerPlan);
    const registerPlanResponse: RegisterPlanResponse = new RegisterPlanResponse(
      PlanId,
      registerPlan.PlanName,
      registerPlan.Benefits,
    );
    return Result.ok(registerPlanResponse);
  }
}
