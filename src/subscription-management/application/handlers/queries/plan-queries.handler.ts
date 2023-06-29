import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllPlanQuerys } from "../../queries/get-all-plan.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Plan } from "src/subscription-management/domain/entity/plan.entity";
import { Connection, Repository } from "typeorm";
import { PlanDto } from "../../dtos/PlanDto";
import { getSubscriptionByIdQuery } from "../../queries/get-subscription-id.query";
import { getPlanByIdQuery } from "../../queries/get-plan-id.queries";
import { getCurrentPlanQuery } from "../../queries/get-current-plan.query";
import { CurrentPlanDto } from "../../dtos/CurrentPlanDto";

@QueryHandler(GetAllPlanQuerys)
export class GetAllPlanHandler implements IQueryHandler<GetAllPlanQuerys>{
    constructor(@InjectRepository(Plan) private readonly PlanRepository
    :Repository<Plan>){

    }
    async execute(query: GetAllPlanQuerys): Promise<PlanDto[]> {
        const plans = await this.PlanRepository.find();
        console.log(
            '🚀 ~ file: vehicles-queries.handler.ts:18 ~ GetAllVehiclesHandler ~ execute ~ vehicles:',
            plans['result'],
          );
          const planDtos: PlanDto[] = plans.map((plans) => {
            const planDto = new PlanDto();
            planDto.PlanName = plans.getPlanName().getValue(),
            planDto.Benefits = plans.getBenefits();
            planDto.Price = plans.getPirce();
            return planDto;
          });
          return planDtos;
        }
      }


@QueryHandler(getPlanByIdQuery)
export class GetPlanByIdHandler implements IQueryHandler<getPlanByIdQuery>{
    constructor(
        @InjectRepository(Plan)
        private readonly PlanRepository: Repository<Plan>,
        private readonly connection: Connection,
      ) {}

      async execute(query: getPlanByIdQuery){
          const manager = this.connection.manager;
          const sql = `
          SELECT *
          FROM plans as P
          WHERE P.id = ?`;
      
      const result = await manager.query(sql,[query.PlanId]);

      console.log("result: ", result);  // result si almacena las variables

      if(result.length==0){
        console.log('Not result in repository now. sorry');
        return null;
      }

      const plan = result[0];
      
      console.log("PLAN: ",plan); // plan si almacena las variables 

      const planDto = new PlanDto();
      planDto.PlanName = plan.name;
      planDto.Benefits = plan.Benefits;
      return planDto;
    }
}




@QueryHandler(getCurrentPlanQuery)
export class getCurrentPlanHandler implements IQueryHandler<getCurrentPlanQuery>{
  constructor(@InjectRepository(Plan) private readonly PlanRepository: Repository<Plan>,
              private readonly connection: Connection,){}

  async execute(query: getCurrentPlanQuery): Promise<any> {
    const manager = this.connection.manager;
          const sql = `
          select MAX(S.startDate) as 'startDate' ,S.endDate,P.name, P.Benefits
          from Subscriptions as S
          Inner Join accounts as A on A.id = S.accountId
          Inner Join users as U on U.accountId = A.id
          Inner Join plans as P on P.id = S.planId
          where A.id = ?
          group by S.endDate,P.name, P.Benefits`;
      
      const result = await manager.query(sql,[query.id]);
      console.log("result: ", query.id);  // result si almacena las variables

      if(result.length == 0){
        console.log('Not result in repository now. sorry');
        return null;
      }

      const currentPlan = result[0];
      
      console.log("PLAN: ",currentPlan); 
      
      const currentPlanDto = new CurrentPlanDto();
      currentPlanDto.name = currentPlan.name;
      currentPlanDto.Benefits = currentPlan.Benefits;
      currentPlanDto.startDate = currentPlan.startDate;
      currentPlanDto.endDate = currentPlan.endDate;
      
      return currentPlanDto;
  }
}