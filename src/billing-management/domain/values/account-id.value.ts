import { PrimaryColumn } from "typeorm";
export class AccountId{
    @PrimaryColumn('bigint',{name:'id'})
    protected readonly value: number;

    protected constructor(value: number) {
        this.value=Number(value);
    }

    public static create(value: number): AccountId {
        return new AccountId(value);
    }

    public getValue():number{
        return this.value;
    }



}