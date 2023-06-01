import { Inject } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Connection } from 'typeorm';
import { RegisterPlanValidator } from "../validators/register-plan-validator";
/*
@Injectable()
export class PlanApplicationService{
    constructor(private connection: Connection,
    private commandBus:CommandBus,
    private RegisterPlanValidator: RegisterPlanValidator)
    {console.log('this.connection.isConnected: ', this.connection.isConnected);}

    async register()
}*/