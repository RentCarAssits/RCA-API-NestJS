import { Column } from "typeorm";
export class PayeeIdFk {
    @Column('int', { name: 'payee_id' })
    protected readonly value: number;

    protected constructor(value: number) {
        this.value = Number(value);
    }

    public static create(value: number): PayeeIdFk {
        return new PayeeIdFk(value);
    }

    public getValue(): number {
        return Number(this.value);
    }
}