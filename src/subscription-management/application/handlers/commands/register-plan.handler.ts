import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RegisterPlans } from '../../commands/register-plan.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from 'src/subscription-management/domain/entity/plan.entity';
import { Repository } from 'typeorm';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';
import { PlanName } from 'src/subscription-management/domain/values/plan-name.value';
import { PlanFactory } from 'src/subscription-management/domain/factories/plan.factory';
import { PlanId } from 'src/subscription-management/domain/values/plan-id.value';

@CommandHandler(RegisterPlans)
export class RegisterPlanHanlder implements ICommandHandler<RegisterPlans> {
  constructor(
    @InjectRepository(Plan) private PlanRepository: Repository<Plan>,
    private publisher: EventPublisher,
  ) {}

  async execute(command: RegisterPlans) {
    console.log('comand: ', command);
    let planId = 0;
    const PlanNameResult: Result<AppNotification, PlanName> = PlanName.create(
      command.PlanName,
    );

    if (PlanNameResult.isFailure()) return planId;

    console.log('PlanNameResult:', PlanNameResult.value.getValue());

    const PlanBenefitsResult: string = command.Benefits;

    const PlanEntity: Plan = PlanFactory.createFrom(
      PlanNameResult.value,
      PlanBenefitsResult,
    );

    const aux = {
      PlanName: PlanNameResult.value.getValue(),
      PlanBenefits: PlanBenefitsResult,
    };

    const PlanAux = this.PlanRepository.create(
      new Plan(PlanNameResult.value, PlanBenefitsResult),
    );
    let PlanSave = await this.PlanRepository.save(PlanEntity);
    if (PlanSave == null) {
      return planId;
    }
    console.log('Plan', PlanSave);

    planId = Number(PlanSave.getId());
    console.log('PlanId', planId);
    PlanSave.changeId(PlanId.of(planId));
    PlanSave = this.publisher.mergeObjectContext(PlanSave);
    PlanSave.register();
    PlanSave.commit();
    return PlanId;
  }
}
