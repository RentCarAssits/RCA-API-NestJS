import { Column } from 'typeorm';

export class AccountPaybleIdFk {
    @Column('int', { name: 'account_payable_id' })
    private readonly value: number;

    protected constructor(value: number) {
        this.value = Number(value);
    }

    public static create(value: number): AccountPaybleIdFk {
        return new AccountPaybleIdFk(value);
    }

    public getValue(): number {
        return Number(this.value);
    }
}