import { Column } from "typeorm";
export class PayeeIdFk {
    @Column('int', { name: 'payee_id' })
    private  value: number;

    private constructor(value: number) {
        this.value = Number(value);
    }

    public static create(value: number): PayeeIdFk {
        return new PayeeIdFk(value);
    }

    public getValue(): number {
        return this.value;
    }
}