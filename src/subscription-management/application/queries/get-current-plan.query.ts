import { User } from "src/iam-management/domain/entities/user.entity";

export class getCurrentPlanQuery{
    public constructor(public readonly id: number){}
}