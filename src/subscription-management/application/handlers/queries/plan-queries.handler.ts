import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllPlanQuerys } from "../../queries/get-all-plan.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Plan } from "src/subscription-management/domain/entity/plan.entity";
import { Connection, Repository } from "typeorm";
import { PlanDto } from "../../dtos/PlanDto";
import { getSubscriptionByIdQuery } from "../../queries/get-subscription-id.query";
import { getPlanByIdQuery } from "../../queries/get-plan-id.queries";

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
          SELECT vehicles.*, GROUP_CONCAT(categories.category) as categories
          FROM vehicles
          LEFT JOIN categories ON vehicles.id = categories.vehicleId
          WHERE vehicles.id = ?
          GROUP BY vehicles.id
      `;
      
      const result = await manager.query(sql,[query.PlanId]);

      if(result==0){
        return null;
        console.log('Not result in repository now. sorry');
      }

      const plan = result[0];

      const planDto = new PlanDto();
      planDto.PlanName = plan.PlanName;
      planDto.Benefits = plan.Benefits;

      return planDto;
    }
}