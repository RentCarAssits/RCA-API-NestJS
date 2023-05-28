import { Column } from "typeorm";
export class PayeeId{
    @Column('bigint',{name:'payee_id'})
    protected readonly value: number;

    protected constructor(value: number) {
        this.value=Number(value);
    }

    public static create(value: number): PayeeId {
        return new PayeeId(value);
    }

    public getValue():number{
        return this.value;
    }



}