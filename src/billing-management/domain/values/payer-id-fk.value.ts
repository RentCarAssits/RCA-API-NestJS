import { Account } from 'src/iam-management/domain/entities/account.entity';
import { Column }  from  'typeorm';
export class PayerIdFk{
    @Column('bigint',{name:'payer_id'})
    protected readonly value: Account["id"];

    protected constructor(value: Account["id"]) {
        this.value=value;
    }

    public static create(value: Account["id"]):PayerIdFk{
        return new PayerIdFk(value);
    }

    public getValue(): Account["id"]{
        return this.value;
    }
}