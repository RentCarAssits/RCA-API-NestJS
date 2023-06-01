import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { getAllSubscriptionQuery } from "../../queries/get-all-subscription.query";
import { Subscription } from "src/subscription-management/domain/entity/Subscription.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { SubscriptionDto } from "../../dtos/SubscriptionDto";
import { getSubscriptionByIdQuery } from "../../queries/get-subscription-id.query";

@QueryHandler(getAllSubscriptionQuery)
export class GetAllSubscriptionHandler implements IQueryHandler<getAllSubscriptionQuery>{
    constructor(@InjectRepository(Subscription) private readonly vehicleRepository: Repository<Subscription>,) {}

    async execute(query: getAllSubscriptionQuery): Promise<any> {
        const subscriptions = await this.vehicleRepository.find({
            relations: {
              Account: true,
            },
          });
          console.log(
            '🚀 ~ file: vehicles-queries.handler.ts:18 ~ GetAllVehiclesHandler ~ execute ~ vehicles:',
            subscriptions['result'],
          );
          /*  
          const subscriptionDtos: SubscriptionDto[] = subscriptions.map((subscription) => {
            const subscriptionDto = new SubscriptionDto();
            subscriptionDto.PlanId = subscription.getPlan().getId().getValue();
            subscriptionDto.AccountId = subscription.getAccount().getAccountId().getValue();
            subscriptionDto.UnitPrice = subscription.getUnitPrice();
            subscriptionDto.Frequency = subscription.getFrequency().getValue();
            subscriptionDto.Period = subscription.getPeriod().getStartDate();
            return subscriptionDto;
          });
        return subscriptionDtos;
        */
    }
}

@QueryHandler(getSubscriptionByIdQuery)
export class GetSubscriptionByIdHanlder implements IQueryHandler<getSubscriptionByIdQuery>{
    constructor(
        @InjectRepository(Subscription)
        private readonly vehicleRepository: Repository<Subscription>,
        private readonly connection: Connection,
    ) {}

    async execute(query: getSubscriptionByIdQuery){
        const manager = this.connection.manager;
        const sql=`SELECT *
          FROM Subscriptions
          WHERE vehicles.id = ?`;
        const result = await manager.query(sql, [query.SubscriptionId]);

        if(result.length === 0){
            return null;
        }
        const subscription = result[0];

        const subscriptionDto = new SubscriptionDto();
        
        subscriptionDto.AccountId = subscription.AccountId;
        subscriptionDto.PlanId = subscription.PlanId;
        subscriptionDto.Period = subscription.Period;
        subscriptionDto.UnitPrice = subscription.UnitPrice;
        subscriptionDto.Frequency = subscription.Frequency;

        return subscriptionDto;
    }
    

}