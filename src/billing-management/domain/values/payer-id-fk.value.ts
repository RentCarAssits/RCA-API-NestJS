import { Column } from "typeorm";
export class PayerIdFk {
    @Column('int', { name: 'payer_id' })
    private  value: number;

    private constructor(value: number) {
        this.value = value;
    }

    public static create(value: number): PayerIdFk {
        return new PayerIdFk(value);
    }

    public getValue(): number {
        return this.value;
    }
}