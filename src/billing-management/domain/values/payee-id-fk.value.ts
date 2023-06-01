import { Account } from "src/iam-management/domain/entities/account.entity";
import { Column } from "typeorm";
export class PayeeIdFk{
    @Column('bigint',{name:'payee_id'})
    protected readonly value: Account["id"];

    protected constructor(value: Account["id"]) {
        this.value=value;
    }

    public static create(value: Account["id"]):PayeeIdFk{
        return new PayeeIdFk(value);
    }

    public getValue(): Account["id"]{
        return this.value;
    }
}