export class AccountPayableId{
    protected readonly value: number;

    protected constructor(value: number) {
        this.value=Number(value);
    }

    public static create(value: number): AccountPayableId {
        return new AccountPayableId(value);
    }

    public getValue():number{
        return this.value;
    }
}